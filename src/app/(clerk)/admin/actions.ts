"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { readingMinutes, slugify } from "@/lib/blog";
import { cleanupOrphans, recordUpload } from "@/lib/uploads";
import { IMAGE_SELECT, type ImageRef } from "@/lib/image-utils";

export type PostInput = {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImageId: string | null;
    ogImageId: string | null;
    tags: string[];
    status: "DRAFT" | "PUBLISHED";
    publishedAt: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    canonicalUrl: string | null;
    noindex: boolean;
    seriesId: string | null;
    seriesOrder: number | null;
};

type Failure = { ok: false; error: string };
export type SaveResult = { ok: true; slug: string } | Failure;
export type SeriesResult = { ok: true; id: string; title: string } | Failure;
export type UploadResult = { ok: true; image: ImageRef } | Failure;

/** Repopulate every cached surface a post can appear on. */
function revalidateBlog(slug?: string) {
    revalidatePath("/blogs");
    revalidatePath("/sitemap.xml");
    if (slug) revalidatePath(`/blogs/${slug}`);
}

const trim = (v: string | null) => {
    const t = v?.trim();
    return t ? t : null;
};

/**
 * Prisma signals a duplicate unique column with code P2002. Matching on the
 * message text instead would break silently whenever Prisma rewords it — and a
 * missed match here throws, which the UI shows as nothing happening at all.
 */
function isUniqueViolation(e: unknown): boolean {
    return (
        typeof e === "object" &&
        e !== null &&
        ("code" in e ? (e as { code?: string }).code === "P2002" : false)
    );
}

export async function savePost(input: PostInput): Promise<SaveResult> {
    await requireAdmin();

    // Trust boundary: the client is a form, but the action is a public POST endpoint.
    const title = input.title.trim();
    const excerpt = input.excerpt.trim();
    const content = input.content.trim();
    if (!title) return { ok: false, error: "Title is required." };
    if (!excerpt) return { ok: false, error: "Excerpt is required — it's the meta description." };
    if (!content) return { ok: false, error: "Content is required." };

    const slug = slugify(input.slug || title);
    if (!slug) return { ok: false, error: "Slug could not be derived from the title." };

    // Publishing with no date means "now"; a future date means scheduled.
    const publishedAt =
        input.status === "PUBLISHED"
            ? input.publishedAt
                ? new Date(input.publishedAt)
                : new Date()
            : input.publishedAt
              ? new Date(input.publishedAt)
              : null;

    if (publishedAt && Number.isNaN(publishedAt.getTime())) {
        return { ok: false, error: "Publish date is not a valid date." };
    }

    const data = {
        slug,
        title,
        excerpt,
        content,
        coverImageId: trim(input.coverImageId),
        ogImageId: trim(input.ogImageId),
        tags: input.tags.map((t) => t.trim()).filter(Boolean),
        status: input.status,
        publishedAt,
        readingMinutes: readingMinutes(content),
        seoTitle: trim(input.seoTitle),
        seoDescription: trim(input.seoDescription),
        canonicalUrl: trim(input.canonicalUrl),
        noindex: input.noindex,
        seriesId: input.seriesId || null,
        seriesOrder: input.seriesId ? (input.seriesOrder ?? null) : null,
    };

    try {
        if (input.id) {
            // Read the old slug BEFORE updating: prisma.update() returns the NEW row,
            // so reading it afterwards would give us the new slug and leave the old
            // URL serving stale content forever.
            const before = await prisma.post.findUnique({
                where: { id: input.id },
                select: { slug: true },
            });
            await prisma.post.update({ where: { id: input.id }, data });
            if (before && before.slug !== slug) revalidateBlog(before.slug);
        } else {
            await prisma.post.create({ data });
        }
    } catch (e) {
        if (isUniqueViolation(e)) {
            return { ok: false, error: `The slug "${slug}" is already taken.` };
        }
        throw e;
    }

    revalidateBlog(slug);
    return { ok: true, slug };
}

export async function deletePost(id: string): Promise<void> {
    await requireAdmin();
    const post = await prisma.post.delete({ where: { id } });
    revalidateBlog(post.slug);
}

/**
 * Flip a post between draft and published from the list, without opening the editor.
 *
 * Publishing a post that has never had a date sets it to now. Unpublishing keeps
 * the existing date so re-publishing restores the original one.
 */
export async function togglePostStatus(id: string): Promise<SaveResult> {
    await requireAdmin();

    const post = await prisma.post.findUnique({
        where: { id },
        select: { slug: true, status: true, publishedAt: true },
    });
    if (!post) return { ok: false, error: "That post no longer exists." };

    const publishing = post.status === "DRAFT";
    await prisma.post.update({
        where: { id },
        data: {
            status: publishing ? "PUBLISHED" : "DRAFT",
            publishedAt: publishing ? (post.publishedAt ?? new Date()) : post.publishedAt,
        },
    });

    revalidateBlog(post.slug);
    return { ok: true, slug: post.slug };
}

/** Destroy Cloudinary images that nothing references any more. */
export async function cleanupUnusedImages(): Promise<
    { ok: true; deleted: number } | { ok: false; error: string }
> {
    await requireAdmin();
    const { deleted, failed } = await cleanupOrphans();
    if (failed.length > 0) {
        return {
            ok: false,
            error: `Deleted ${deleted}, but ${failed.length} failed: ${failed[0].detail}`,
        };
    }
    return { ok: true, deleted };
}

export async function upsertSeries(input: {
    id?: string;
    title: string;
    slug?: string;
    description?: string | null;
}): Promise<SeriesResult> {
    await requireAdmin();

    const title = input.title.trim();
    if (!title) return { ok: false, error: "Series title is required." };
    const slug = slugify(input.slug || title);
    if (!slug) return { ok: false, error: "Series slug could not be derived." };

    const data = { title, slug, description: trim(input.description ?? null) };

    try {
        const series = input.id
            ? await prisma.series.update({ where: { id: input.id }, data })
            : await prisma.series.create({ data });
        revalidateBlog();
        return { ok: true, id: series.id, title: series.title };
    } catch (e) {
        if (isUniqueViolation(e)) {
            return { ok: false, error: `The series slug "${slug}" is already taken.` };
        }
        throw e;
    }
}

/** Posts survive; onDelete: SetNull just detaches them from the series. */
export async function deleteSeries(id: string): Promise<void> {
    await requireAdmin();
    await prisma.series.delete({ where: { id } });
    revalidateBlog();
}

/**
 * Cloudinary unsigned upload. No SDK — it's one multipart POST.
 * ponytail: unsigned preset is fine because this action is admin-gated already.
 */
export async function uploadImage(formData: FormData): Promise<UploadResult> {
    await requireAdmin();

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
        return { ok: false, error: "No file provided." };
    }
    if (!file.type.startsWith("image/")) {
        return { ok: false, error: "That file is not an image." };
    }

    const cloud = process.env.CLOUDINARY_CLOUD_NAME;
    const preset = process.env.CLOUDINARY_PRESET;
    if (!cloud || !preset) {
        return { ok: false, error: "Cloudinary is not configured (CLOUDINARY_CLOUD_NAME/PRESET)." };
    }

    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", preset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
        method: "POST",
        body,
    });

    if (!res.ok) {
        return { ok: false, error: `Cloudinary rejected the upload (${res.status}).` };
    }

    const json = (await res.json()) as {
        secure_url?: string;
        public_id?: string;
        bytes?: number;
        width?: number;
        height?: number;
    };
    if (!json.secure_url) return { ok: false, error: "Cloudinary returned no URL." };

    // Dimensions come back in the same response, so storing them is free — and it
    // is what lets next/image reserve space instead of shifting the layout.
    const image = await recordUpload({
        publicId: json.public_id ?? null,
        url: json.secure_url,
        bytes: json.bytes ?? 0,
        width: json.width ?? 0,
        height: json.height ?? 0,
    });

    return { ok: true, image };
}

/**
 * Register an image the admin pasted a URL for.
 *
 * It still gets a row, because a URL with no row has no alt text and no way to be
 * referenced by id — which would put it outside the one image table entirely.
 * publicId stays null: Cloudinary does not own it, so cleanup must not destroy it.
 */
export async function attachImageByUrl(url: string): Promise<UploadResult> {
    await requireAdmin();

    const trimmed = url.trim();
    if (!trimmed) return { ok: false, error: "No URL provided." };
    if (!/^(https?:\/\/|\/)/.test(trimmed)) {
        return { ok: false, error: "That is not a valid image URL or site-relative path." };
    }

    const existing = await prisma.image.findUnique({
        where: { url: trimmed },
        select: IMAGE_SELECT,
    });
    if (existing) return { ok: true, image: existing };

    const image = await prisma.image.create({
        data: { url: trimmed, publicId: null },
        select: IMAGE_SELECT,
    });
    return { ok: true, image };
}

/**
 * Update the alt text and caption on an image row.
 *
 * Separate from whatever form the image was picked in: alt belongs to the image,
 * not to the post or event that happens to be using it, so it saves on its own.
 */
export async function saveImageMeta(
    id: string,
    alt: string,
    caption?: string | null
): Promise<{ ok: true } | Failure> {
    await requireAdmin();
    if (!id) return { ok: false, error: "No image selected." };

    await prisma.image.update({
        where: { id },
        data: { alt: alt.trim(), ...(caption === undefined ? {} : { caption: trim(caption) }) },
    });

    // Alt is rendered on the public pages, so the cached copies are now stale.
    revalidatePath("/", "layout");
    return { ok: true };
}
