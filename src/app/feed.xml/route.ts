import { getPublishedPosts } from "@/lib/blog";
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
    const posts = await getPublishedPosts();

    const items = posts
        .map((p) => {
            const url = `${SITE_URL}/blogs/${p.slug}`;
            return [
                "    <item>",
                `      <title>${esc(p.title)}</title>`,
                `      <link>${url}</link>`,
                `      <guid isPermaLink="true">${url}</guid>`,
                `      <description>${esc(p.excerpt)}</description>`,
                p.publishedAt ? `      <pubDate>${p.publishedAt.toUTCString()}</pubDate>` : "",
                ...p.tags.map((t) => `      <category>${esc(t)}</category>`),
                p.coverImage
                    ? `      <enclosure url="${esc(p.coverImage)}" type="image/*" length="0" />`
                    : "",
                "    </item>",
            ]
                .filter(Boolean)
                .join("\n");
        })
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Afif Zilani — Blog</title>
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
