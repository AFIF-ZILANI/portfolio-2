import { prisma } from "@/lib/prisma";
import { DEFAULT_SITE_DATA, type SiteData } from "@/lib/site-data";

const SINGLETON_ID = "singleton";

/** Non-empty array wins, otherwise fall back — mirrors the old localStorage loader. */
function pickList<T>(stored: unknown, fallback: T[]): T[] {
    return Array.isArray(stored) && stored.length > 0 ? (stored as T[]) : fallback;
}

function pickText(stored: unknown, fallback: string): string {
    return typeof stored === "string" && stored.trim() ? stored : fallback;
}

/**
 * Merge a stored record over the built-in defaults.
 *
 * Every field falls back independently, so a partial or older record still renders
 * a complete site — and a newly added field works before anyone saves it.
 */
export function mergeSiteData(stored: Partial<SiteData> | null | undefined): SiteData {
    if (!stored) return DEFAULT_SITE_DATA;
    return {
        name: pickText(stored.name, DEFAULT_SITE_DATA.name),
        title: pickText(stored.title, DEFAULT_SITE_DATA.title),
        tagline: pickText(stored.tagline, DEFAULT_SITE_DATA.tagline),
        bio: pickList(stored.bio, DEFAULT_SITE_DATA.bio),
        heroImage: pickText(stored.heroImage, DEFAULT_SITE_DATA.heroImage),
        aboutImage: pickText(stored.aboutImage, DEFAULT_SITE_DATA.aboutImage),
        socialLinks: pickList(stored.socialLinks, DEFAULT_SITE_DATA.socialLinks),
        experiences: pickList(stored.experiences, DEFAULT_SITE_DATA.experiences),
        stats: pickList(stored.stats, DEFAULT_SITE_DATA.stats),
        skills: pickList(stored.skills, DEFAULT_SITE_DATA.skills),
        projects: pickList(stored.projects, DEFAULT_SITE_DATA.projects),
        contact: {
            heading: pickText(stored.contact?.heading, DEFAULT_SITE_DATA.contact.heading),
            // Blank is meaningful here: it means "use the CONTACT_EMAIL env var".
            email: typeof stored.contact?.email === "string" ? stored.contact.email : "",
        },
    };
}

/** The live site content. Falls back to defaults on a fresh database. */
export async function getSiteData(): Promise<SiteData> {
    const row = await prisma.siteContent.findUnique({ where: { id: SINGLETON_ID } });
    return mergeSiteData(row?.data as Partial<SiteData> | undefined);
}

/** Upsert the single row. Callers must have already checked admin access. */
export async function writeSiteData(data: SiteData): Promise<void> {
    await prisma.siteContent.upsert({
        where: { id: SINGLETON_ID },
        create: { id: SINGLETON_ID, data },
        update: { data },
    });
}
