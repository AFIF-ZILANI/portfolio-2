import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getStoredSiteData } from "@/lib/site-content";
import { IMAGE_SELECT, type ImageRef } from "@/lib/image-utils";

/**
 * How long a brand-new upload is protected regardless of whether anything
 * references it yet.
 *
 * Without this, uploading a cover and then taking ten minutes to finish writing
 * the post would leave the image eligible for deletion mid-session.
 */
export const ORPHAN_GRACE_MS = 24 * 60 * 60 * 1000;

/** Record an upload so it can be referenced by id and cleaned up later. */
export async function recordUpload(input: {
    publicId: string | null;
    url: string;
    bytes: number;
    width: number;
    height: number;
}): Promise<ImageRef> {
    const { publicId, url, bytes, width, height } = input;

    // Keyed on url rather than publicId because publicId is nullable now: an image
    // Cloudinary does not own still needs exactly one row.
    return prisma.image.upsert({
        where: { url },
        create: { publicId, url, bytes, width, height },
        update: { publicId, bytes, width, height },
        select: IMAGE_SELECT,
    });
}

/**
 * Every image id currently referenced by anything on the site.
 *
 * Includes drafts and post bodies: an unpublished post still needs its cover, and
 * an image pasted into markdown is referenced even though no column points at it.
 */
export async function collectReferencedIds(): Promise<Set<string>> {
    const [posts, events, series, site] = await Promise.all([
        prisma.post.findMany({ select: { coverImageId: true, ogImageId: true, content: true } }),
        prisma.event.findMany({ select: { imageIds: true, content: true } }),
        prisma.series.findMany({ select: { coverImageId: true } }),
        getStoredSiteData(),
    ]);

    const referenced = new Set<string>();
    const add = (v: string | null | undefined) => {
        if (v && v.trim()) referenced.add(v.trim());
    };

    for (const p of posts) {
        add(p.coverImageId);
        add(p.ogImageId);
    }
    for (const e of events) for (const id of e.imageIds) add(id);
    for (const s of series) add(s.coverImageId);

    add(site.heroImageId);
    add(site.aboutImageId);
    for (const project of site.projects) add(project.coverImageId);

    // Markdown bodies reference images by URL, not id, so map those back to rows.
    const bodies = [...posts.map((p) => p.content), ...events.map((e) => e.content)].join("\n");
    if (bodies.trim()) {
        const all = await prisma.image.findMany({ select: { id: true, url: true } });
        for (const { id, url } of all) {
            if (bodies.includes(url)) referenced.add(id);
        }
    }

    return referenced;
}

/**
 * Images safe to delete: not referenced anywhere, and older than the grace window.
 * Pure so the rule is testable without a database or Cloudinary.
 */
export function findOrphans<T extends { id: string; createdAt: Date }>(
    images: T[],
    referenced: Set<string>,
    now: number = Date.now(),
    graceMs: number = ORPHAN_GRACE_MS
): T[] {
    return images.filter((i) => !referenced.has(i.id) && now - i.createdAt.getTime() >= graceMs);
}

/**
 * Cloudinary's destroy endpoint needs a signed request: the params sorted, joined
 * as a query string, with the API secret appended, hashed with SHA-1.
 */
export function signDestroy(publicId: string, timestamp: number, apiSecret: string): string {
    return createHash("sha1")
        .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
        .digest("hex");
}

export type DestroyOutcome = { publicId: string; ok: boolean; detail: string };

/** Delete one image from Cloudinary. Returns the outcome rather than throwing. */
export async function destroyCloudinaryImage(publicId: string): Promise<DestroyOutcome> {
    const cloud = process.env.CLOUDINARY_CLOUD_NAME;
    const key = process.env.CLOUDINARY_API_KEY;
    const secret = process.env.CLOUDINARY_API_SECRET;
    if (!cloud || !key || !secret) {
        return { publicId, ok: false, detail: "Cloudinary API credentials are not configured." };
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const body = new FormData();
    body.append("public_id", publicId);
    body.append("timestamp", String(timestamp));
    body.append("api_key", key);
    body.append("signature", signDestroy(publicId, timestamp, secret));

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/destroy`, {
        method: "POST",
        body,
    });
    const json = (await res.json().catch(() => ({}))) as {
        result?: string;
        error?: { message?: string };
    };

    // "not found" means it's already gone — treat that as success so the row clears.
    const ok = json.result === "ok" || json.result === "not found";

    let detail = json.result ?? json.error?.message ?? `HTTP ${res.status}`;
    if (!ok && detail.includes("Invalid Signature")) {
        // Almost always a wrong CLOUDINARY_API_SECRET rather than a signing bug —
        // the unsigned upload preset works without it, so this is the first thing
        // that would ever notice the value is wrong.
        detail =
            "Cloudinary rejected the signature. Check CLOUDINARY_API_SECRET is the API secret " +
            "from your Cloudinary dashboard (it is not the same as CLOUDINARY_API_KEY).";
    }
    return { publicId, ok, detail };
}

/**
 * Destroy every orphaned upload and drop its row. Rows are only removed when
 * Cloudinary confirms, so a failure leaves it to be retried next run.
 *
 * Only images Cloudinary owns are candidates. A null publicId means the row points
 * at a static file or an external URL: there is nothing to destroy, and dropping
 * the row would unpick a reference that still renders perfectly well.
 */
export async function cleanupOrphans(): Promise<{ deleted: number; failed: DestroyOutcome[] }> {
    const [images, referenced] = await Promise.all([
        prisma.image.findMany({ where: { publicId: { not: null } } }),
        collectReferencedIds(),
    ]);

    const orphans = findOrphans(images, referenced);
    const failed: DestroyOutcome[] = [];
    let deleted = 0;

    for (const orphan of orphans) {
        // Narrowed by the query above; this keeps TypeScript honest.
        if (!orphan.publicId) continue;
        const outcome = await destroyCloudinaryImage(orphan.publicId);
        if (outcome.ok) {
            await prisma.image.delete({ where: { id: orphan.id } });
            deleted++;
        } else {
            failed.push(outcome);
        }
    }

    return { deleted, failed };
}

/** Everything the media page needs: each image plus whether it's in use. */
export async function listUploadsWithUsage() {
    const [images, referenced] = await Promise.all([
        prisma.image.findMany({ orderBy: { createdAt: "desc" } }),
        collectReferencedIds(),
    ]);
    const now = Date.now();

    return images.map((i) => ({
        id: i.id,
        url: i.url,
        alt: i.alt,
        publicId: i.publicId,
        bytes: i.bytes,
        createdAt: i.createdAt,
        inUse: referenced.has(i.id),
        // Unreferenced but still inside the grace window — not deletable yet.
        protectedByGrace: now - i.createdAt.getTime() < ORPHAN_GRACE_MS,
        // No publicId means Cloudinary has nothing to destroy; the row is permanent.
        managed: i.publicId !== null,
    }));
}
