import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { publishedWhere } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";



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
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
            images: [`${SITE_URL}/afifzilani-profile.webp`, `${SITE_URL}/afifzilani-about.webp`],
        },
        {
            url: `${SITE_URL}/blogs`,
            lastModified: posts[0]?.updatedAt ?? new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        ...posts.map((p) => ({
            url: `${SITE_URL}/blogs/${p.slug}`,
            lastModified: p.updatedAt,
            changeFrequency: "monthly" as const,
            priority: 0.8,
            ...(p.coverImage ? { images: [p.coverImage] } : {}),
        })),
    ];
}
