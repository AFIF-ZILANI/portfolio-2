import { getPublishedPosts } from "@/lib/blog";
import { getPublishedEvents } from "@/lib/events";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const esc = (s: string) =>
    s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

/**
 * RSS 2.0 feed. Cheap to serve and it is how aggregators, newsletter tools, and
 * several AI crawlers find new posts without re-crawling the whole site.
 */
export async function GET() {
    const [posts, events] = await Promise.all([getPublishedPosts(), getPublishedEvents()]);

    // Posts and events share one feed, ordered by date: a subscriber wants
    // everything that was published, not one of the two streams.
    type FeedEntry = {
        url: string;
        title: string;
        excerpt: string;
        date: Date | null;
        tags: string[];
        image: string | null;
    };

    const entries: FeedEntry[] = [
        ...posts.map((p) => ({
            url: `${SITE_URL}/blogs/${p.slug}`,
            title: p.title,
            excerpt: p.excerpt,
            date: p.publishedAt,
            tags: p.tags,
            image: p.coverImage?.url ?? null,
        })),
        ...events.map((e) => ({
            url: `${SITE_URL}/events/${e.slug}`,
            title: e.title,
            excerpt: e.excerpt,
            date: e.publishedAt,
            tags: e.tags,
            image: e.cover?.url ?? null,
        })),
    ].sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));

    const items = entries
        .map((entry) =>
            [
                "    <item>",
                `      <title>${esc(entry.title)}</title>`,
                `      <link>${entry.url}</link>`,
                `      <guid isPermaLink="true">${entry.url}</guid>`,
                `      <description>${esc(entry.excerpt)}</description>`,
                entry.date ? `      <pubDate>${entry.date.toUTCString()}</pubDate>` : "",
                ...entry.tags.map((t) => `      <category>${esc(t)}</category>`),
                entry.image
                    ? `      <enclosure url="${esc(entry.image)}" type="image/*" length="0" />`
                    : "",
                "    </item>",
            ]
                .filter(Boolean)
                .join("\n")
        )
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Afif Zilani — Writing &amp; Events</title>
    <link>${SITE_URL}/blogs</link>
    <description>Writing by Afif Zilani on web development, Next.js, TypeScript, and building software.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
