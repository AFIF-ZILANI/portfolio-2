import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getSiteData } from "@/lib/site-content";

/**
 * How long a brand-new upload is protected regardless of whether anything
 * references it yet.
 *
 * Without this, uploading a cover and then taking ten minutes to finish writing
 * the post would leave the image eligible for deletion mid-session.
 */
export const ORPHAN_GRACE_MS = 24 * 60 * 60 * 1000;

export type UploadRow = { id: string; publicId: string; url: string; createdAt: Date };

/** Record an upload so cleanup can find it later. */
export async function recordUpload(publicId: string, url: string, bytes: number) {
    await prisma.upload.upsert({
        where: { publicId },
        create: { publicId, url, bytes },
        update: { url, bytes },
    });
}

/**
 * Every image URL currently referenced by anything on the site.
 *
 * Includes post bodies: an image pasted into the markdown is referenced even
 * though no column points at it, and deleting those would silently break
 * published posts.
 */
export async function collectReferencedUrls(): Promise<Set<string>> {
    const [posts, site] = await Promise.all([
        prisma.post.findMany({ select: { coverImage: true, ogImage: true, content: true } }),
        getSiteData(),
    ]);

    const referenced = new Set<string>();
    const add = (v: string | null | undefined) => {
        if (v && v.trim()) referenced.add(v.trim());
    };

    // Drafts count too — an unpublished post still needs its images.
    for (const p of posts) {
        add(p.coverImage);
        add(p.ogImage);
    }
    add(site.heroImage);
    add(site.aboutImage);
    for (const project of site.projects) add(project.coverImage);

    // Markdown bodies are free text, so scan them for each known upload URL.
    const bodies = posts.map((p) => p.content).join("\n");
    const uploads = await prisma.upload.findMany({ select: { url: true } });
    for (const { url } of uploads) {
        if (bodies.includes(url)) referenced.add(url);
    }

    return referenced;
}

/**
 * Uploads safe to delete: not referenced anywhere, and older than the grace window.
 * Pure so the rule is testable without a database or Cloudinary.
 */
export function findOrphans<T extends { url: string; createdAt: Date }>(
    uploads: T[],
    referenced: Set<string>,
    now: number = Date.now(),
    graceMs: number = ORPHAN_GRACE_MS
): T[] {
    return uploads.filter(
        (u) => !referenced.has(u.url) && now - u.createdAt.getTime() >= graceMs
    );
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
    const json = (await res.json().catch(() => ({}))) as { result?: string; error?: { message?: string } };

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
 */
export async function cleanupOrphans(): Promise<{ deleted: number; failed: DestroyOutcome[] }> {
    const [uploads, referenced] = await Promise.all([
        prisma.upload.findMany(),
        collectReferencedUrls(),
    ]);

    const orphans = findOrphans(uploads, referenced);
    const failed: DestroyOutcome[] = [];
    let deleted = 0;

    for (const orphan of orphans) {
        const outcome = await destroyCloudinaryImage(orphan.publicId);
        if (outcome.ok) {
            await prisma.upload.delete({ where: { id: orphan.id } });
            deleted++;
        } else {
            failed.push(outcome);
        }
    }

    return { deleted, failed };
}

/** Everything the media page needs: each upload plus whether it's in use. */
export async function listUploadsWithUsage() {
    const [uploads, referenced] = await Promise.all([
        prisma.upload.findMany({ orderBy: { createdAt: "desc" } }),
        collectReferencedUrls(),
    ]);
    const now = Date.now();

    return uploads.map((u) => ({
        id: u.id,
        url: u.url,
        publicId: u.publicId,
        bytes: u.bytes,
        createdAt: u.createdAt,
        inUse: referenced.has(u.url),
        // Unreferenced but still inside the grace window — not deletable yet.
        protectedByGrace: now - u.createdAt.getTime() < ORPHAN_GRACE_MS,
    }));
}
