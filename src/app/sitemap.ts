import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { publishedWhere } from "@/lib/blog";
import { publishedEventWhere } from "@/lib/events";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Same PUBLISHED guards as every public query — drafts and scheduled entries
    // can't leak into the sitemap.
    const [posts, events] = await Promise.all([
        prisma.post.findMany({
            where: { ...publishedWhere(), noindex: false },
            orderBy: { publishedAt: "desc" },
            select: { slug: true, updatedAt: true, coverImage: { select: { url: true } } },
        }),
        prisma.event.findMany({
            where: { ...publishedEventWhere(), noindex: false },
            orderBy: { startDate: "desc" },
            select: { slug: true, updatedAt: true, imageIds: true },
        }),
    ]);

    // Every gallery image is listed, not just the cover: image sitemap entries are
    // how photos that never appear standalone become eligible for image results.
    const galleryIds = [...new Set(events.flatMap((e) => e.imageIds))];
    const galleryUrls = new Map<string, string>(
        galleryIds.length
            ? (
                  await prisma.image.findMany({
                      where: { id: { in: galleryIds } },
                      select: { id: true, url: true },
                  })
              ).map((i) => [i.id, i.url] as const)
            : []
    );

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
        {
            url: `${SITE_URL}/events`,
            lastModified: events[0]?.updatedAt ?? new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        ...posts.map((p) => ({
            url: `${SITE_URL}/blogs/${p.slug}`,
            lastModified: p.updatedAt,
            changeFrequency: "monthly" as const,
            priority: 0.8,
            ...(p.coverImage ? { images: [p.coverImage.url] } : {}),
        })),
        ...events.map((e) => {
            const images = e.imageIds
                .map((id) => galleryUrls.get(id))
                .filter((url): url is string => Boolean(url));
            return {
                url: `${SITE_URL}/events/${e.slug}`,
                lastModified: e.updatedAt,
                changeFrequency: "monthly" as const,
                priority: 0.8,
                ...(images.length > 0 ? { images } : {}),
            };
        }),
    ];
}
