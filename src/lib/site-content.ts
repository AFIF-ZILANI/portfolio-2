import { prisma } from "@/lib/prisma";
import {
    DEFAULT_ABOUT_IMAGE,
    DEFAULT_HERO_IMAGE,
    DEFAULT_SITE_DATA,
    type ResolvedSiteData,
    type SiteData,
} from "@/lib/site-data";
import { resolveImages } from "@/lib/images";

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
        heroImageId: pickText(stored.heroImageId, DEFAULT_SITE_DATA.heroImageId),
        aboutImageId: pickText(stored.aboutImageId, DEFAULT_SITE_DATA.aboutImageId),
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

/**
 * The stored content, image fields still as ids.
 *
 * Callers that write use this — a read-merge-write cycle has to round-trip the ids
 * it was given, not the resolved images they point at.
 */
export async function getStoredSiteData(): Promise<SiteData> {
    const row = await prisma.siteContent.findUnique({ where: { id: SINGLETON_ID } });
    return mergeSiteData(row?.data as Partial<SiteData> | undefined);
}

/**
 * Swap image ids for the images themselves, in one query for the whole page.
 *
 * Hero and about fall back to the repo portraits so the page is never missing its
 * two most prominent images — including on a fresh database. A project cover
 * resolves to null instead, because the projects grid already renders a placeholder
 * for that case.
 */
export async function resolveSiteData(data: SiteData): Promise<ResolvedSiteData> {
    const found = await resolveImages([
        data.heroImageId,
        data.aboutImageId,
        ...data.projects.map((p) => p.coverImageId),
    ]);

    const { heroImageId, aboutImageId, projects, ...rest } = data;
    return {
        ...rest,
        heroImage: found.get(heroImageId) ?? DEFAULT_HERO_IMAGE,
        aboutImage: found.get(aboutImageId) ?? DEFAULT_ABOUT_IMAGE,
        projects: projects.map(({ coverImageId, ...project }) => ({
            ...project,
            coverImage: found.get(coverImageId) ?? null,
        })),
    };
}

/** The live site content, ready to render. Falls back to defaults on a fresh database. */
export async function getSiteData(): Promise<ResolvedSiteData> {
    return resolveSiteData(await getStoredSiteData());
}

/** Upsert the single row. Callers must have already checked admin access. */
export async function writeSiteData(data: SiteData): Promise<void> {
    await prisma.siteContent.upsert({
        where: { id: SINGLETON_ID },
        create: { id: SINGLETON_ID, data },
        update: { data },
    });
}
