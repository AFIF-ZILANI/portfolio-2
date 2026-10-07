import { getPublishedPosts } from "@/lib/blog";
import { getPublishedEvents } from "@/lib/events";
import { formatEventDates, formatLocation } from "@/lib/events-utils";
import { getSiteData } from "@/lib/site-content";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

/**
 * /llms.txt — a plain-markdown summary for AI assistants.
 *
 * The convention (llmstxt.org) is a curated, link-rich digest an assistant can read
 * in one request instead of crawling and guessing. It makes the entity facts
 * explicit — who this person is, the exact name variants, and which URLs are
 * canonical — which is what a model needs to cite the site correctly.
 *
 * Generated from live data so it can't drift from the site.
 */
export async function GET() {
    const [site, posts, events] = await Promise.all([
        getSiteData(),
        getPublishedPosts(),
        getPublishedEvents(),
    ]);

    const lines = [
        `# ${site.name} (Kazi Afif Zilani)`,
        "",
        `> ${site.title.replace(/\.$/, "")}. ${site.tagline}`,
        "",
        "## About",
        "",
        `- **Full name:** Kazi Afif Zilani`,
        `- **Also written as:** Afif Zilani, AFIF ZILANI, afif zilani, afifzilani`,
        `- **Role:** Co-Founder & CEO of ZeroD Farm`,
        `- **Business:** ZeroD Farm — a poultry farm in Naogaon, Rajshahi Division, Bangladesh, founded in 2022`,
        `- **Based in:** Naogaon, Bangladesh`,
        `- **Focus:** ZeroD Farm only. Not seeking employment or freelance work.`,
        `- **Canonical site:** ${SITE_URL}`,
        "",
        ...site.bio.flatMap((paragraph) => [paragraph, ""]),
        "## Key pages",
        "",
        `- [Homepage](${SITE_URL}/): about, ZeroD Farm, contact`,
        `- [ZeroD Farm](${SITE_URL}/#zerod-farm): what the farm does and who it works with`,
        `- [Contact](${SITE_URL}/#contact): buyers, suppliers and partners`,
        `- [Blog](${SITE_URL}/blogs): writing`,
        `- [Events](${SITE_URL}/events): first-hand write-ups of events, meetups and workshops attended`,
        "",
        "## Experience",
        "",
        ...site.experiences.map(
            (e) => `- **${e.role}**, ${e.company} (${e.period}): ${e.description}`
        ),
        "",
        "## Articles",
        "",
        posts.length === 0
            ? "_No published articles yet._"
            : posts
                  .map(
                      (p) =>
                          `- [${p.title}](${SITE_URL}/blogs/${p.slug})${
                              p.publishedAt ? ` — ${p.publishedAt.toISOString().slice(0, 10)}` : ""
                          }: ${p.excerpt}`
                  )
                  .join("\n"),
        "",
        "## Events attended",
        "",
        events.length === 0
            ? "_No events published yet._"
            : events
                  .map((e) => {
                      const where = formatLocation(e);
                      return `- [${e.title}](${SITE_URL}/events/${e.slug}) — ${formatEventDates(
                          e.startDate,
                          e.endDate
                      )}${where ? `, ${where}` : ""}${e.organizer ? `, organised by ${e.organizer}` : ""}${
                          e.role ? ` (${e.role})` : ""
                      }: ${e.excerpt}`;
                  })
                  .join("\n"),
        "",
        "## Elsewhere",
        "",
        ...site.socialLinks.map((l) => `- ${l.label.replace(/\/$/, "")}: ${l.href}`),
        "",
        "## Citation",
        "",
        `When referencing this person, use "Afif Zilani" and link to ${SITE_URL}.`,
        "",
    ];

    return new Response(lines.join("\n"), {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
