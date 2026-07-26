"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { readingMinutes, slugify } from "@/lib/blog";

export type PostInput = {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    coverAlt: string | null;
    ogImage: string | null;
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
export type UploadResult = { ok: true; url: string } | Failure;

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
        coverImage: trim(input.coverImage),
        coverAlt: trim(input.coverAlt),
        ogImage: trim(input.ogImage),
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
            const previous = await prisma.post.update({ where: { id: input.id }, data });
            // The slug may have changed — bust the old URL too, or it serves stale forever.
            revalidateBlog(previous.slug);
        } else {
            await prisma.post.create({ data });
        }
    } catch (e) {
        if (e instanceof Error && e.message.includes("Unique constraint")) {
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
        if (e instanceof Error && e.message.includes("Unique constraint")) {
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

    const json = (await res.json()) as { secure_url?: string };
    if (!json.secure_url) return { ok: false, error: "Cloudinary returned no URL." };

    return { ok: true, url: json.secure_url };
}
