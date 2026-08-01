import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { IMAGE_SELECT } from "@/lib/image-utils";

// Server-side convenience: the pure helpers live in blog-utils so that client
// components can import them without pulling Prisma into the browser bundle.
export { POSTS_PER_MINUTE, readingMinutes, slugify } from "@/lib/blog-utils";

/**
 * The single source of truth for "is this post publicly visible".
 *
 * Every public query and the sitemap import this — one guard instead of one per
 * call site, so a new route can't forget it and leak a draft.
 *
 * Must stay a function: as a const, `new Date()` would freeze at module load and
 * scheduled posts would never become visible.
 */
export function publishedWhere(): Prisma.PostWhereInput {
    return { status: "PUBLISHED", publishedAt: { lte: new Date() } };
}

/** Fields the listing grid needs — deliberately excludes `content`. */
const cardSelect = {
    id: true,
    slug: true,
    title: true,
    excerpt: true,
    coverImage: { select: IMAGE_SELECT },
    tags: true,
    publishedAt: true,
    readingMinutes: true,
    views: true,
    series: { select: { slug: true, title: true } },
    seriesOrder: true,
} satisfies Prisma.PostSelect;

export type PostCard = Prisma.PostGetPayload<{ select: typeof cardSelect }>;

export function getPublishedPosts() {
    return prisma.post.findMany({
        where: publishedWhere(),
        orderBy: { publishedAt: "desc" },
        select: cardSelect,
    });
}

export function getPostBySlug(slug: string) {
    return prisma.post.findFirst({
        where: { slug, ...publishedWhere() },
        include: {
            series: true,
            coverImage: { select: IMAGE_SELECT },
            ogImage: { select: IMAGE_SELECT },
        },
    });
}

/** Sibling parts of a series, published only, in reading order. */
export function getSeriesPosts(seriesId: string) {
    return prisma.post.findMany({
        where: { seriesId, ...publishedWhere() },
        orderBy: [{ seriesOrder: "asc" }, { publishedAt: "asc" }],
        select: { slug: true, title: true, seriesOrder: true },
    });
}

export function getAllSeries() {
    return prisma.series.findMany({ orderBy: { title: "asc" } });
}
