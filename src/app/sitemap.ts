import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { publishedWhere } from "@/lib/blog";

const SITE = "https://afifzilani.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Same PUBLISHED guard as every public query — drafts and scheduled posts
    // can't leak into the sitemap.
    const posts = await prisma.post.findMany({
        where: { ...publishedWhere(), noindex: false },
        orderBy: { publishedAt: "desc" },
        select: { slug: true, updatedAt: true, coverImage: true },
    });

    return [
        {
            url: SITE,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
            images: [`${SITE}/afifzilani-profile.webp`, `${SITE}/afifzilani-about.webp`],
        },
        {
            url: `${SITE}/blogs`,
            lastModified: posts[0]?.updatedAt ?? new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        ...posts.map((p) => ({
            url: `${SITE}/blogs/${p.slug}`,
            lastModified: p.updatedAt,
            changeFrequency: "monthly" as const,
            priority: 0.8,
            ...(p.coverImage ? { images: [p.coverImage] } : {}),
        })),
    ];
}
