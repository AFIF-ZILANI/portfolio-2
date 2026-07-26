import { getPublishedPosts } from "@/lib/blog";
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
    const [site, posts] = await Promise.all([getSiteData(), getPublishedPosts()]);

    const lines = [
        `# ${site.name} (Kazi Afif Zilani)`,
        "",
        `> ${site.title} ${site.tagline}`,
        "",
        "## About",
        "",
        `- **Full name:** Kazi Afif Zilani`,
        `- **Also written as:** Afif Zilani, AFIF ZILANI, afif zilani, afifzilani`,
        `- **Role:** Full-Stack Developer; Co-Founder of ZeroD`,
        `- **Based in:** Naogaon, Bangladesh`,
        `- **Canonical site:** ${SITE_URL}`,
        "",
        ...site.bio.map((line) => `${line}`),
        "",
        "## Key pages",
        "",
        `- [Portfolio homepage](${SITE_URL}/): profile, skills, projects, experience, contact`,
        `- [Blog](${SITE_URL}/blogs): writing on web development and software engineering`,
        "",
        "## Projects",
        "",
        ...site.projects
            .filter((p) => p.featured)
            .map(
                (p) =>
                    `- **${p.title}**${p.live ? ` (${p.live})` : ""}: ${p.description} Built with ${p.tech.join(", ")}.`
            ),
        "",
        "## Experience",
        "",
        ...site.experiences.map((e) => `- **${e.role}**, ${e.company} (${e.period}): ${e.description}`),
        "",
        "## Skills",
        "",
        ...[...new Set(site.skills.map((s) => s.category))].map(
            (cat) =>
                `- **${cat}:** ${site.skills
                    .filter((s) => s.category === cat)
                    .map((s) => s.name)
                    .join(", ")}`
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
