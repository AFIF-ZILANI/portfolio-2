"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { getStoredSiteData, writeSiteData } from "@/lib/site-content";
import type { SiteData } from "@/lib/site-data";

export type SiteSaveResult = { ok: true } | { ok: false; error: string };

/**
 * Patch one part of the site content.
 *
 * Read-merge-write against the single row, so each editor page only sends its own
 * slice and can't blank out the others.
 */
export async function saveSiteSection(patch: Partial<SiteData>): Promise<SiteSaveResult> {
    await requireAdmin();

    const current = await getStoredSiteData();
    const next: SiteData = { ...current, ...patch };

    // Trust boundary — these actions are public POST endpoints.
    if (!next.name.trim()) return { ok: false, error: "Name cannot be empty." };
    if (!next.title.trim()) return { ok: false, error: "Title cannot be empty." };

    for (const link of next.socialLinks) {
        if (!link.href.trim()) return { ok: false, error: `Social link "${link.label}" has no URL.` };
    }
    for (const project of next.projects) {
        if (!project.title.trim()) return { ok: false, error: "Every project needs a title." };
    }
    for (const skill of next.skills) {
        if (!skill.name.trim()) return { ok: false, error: "Every skill needs a name." };
        if (!skill.category.trim()) {
            return { ok: false, error: `Skill "${skill.name}" needs a category.` };
        }
    }
    if (next.contact.email.trim() && !next.contact.email.includes("@")) {
        return { ok: false, error: "Contact email is not a valid address." };
    }

    await writeSiteData(next);

    // The homepage and the footer (site layout) both read this.
    revalidatePath("/", "layout");
    return { ok: true };
}

/** Reset one section back to the built-in defaults. */
export async function resetSiteSection(keys: (keyof SiteData)[]): Promise<SiteSaveResult> {
    await requireAdmin();
    const { DEFAULT_SITE_DATA } = await import("@/lib/site-data");
    const patch = Object.fromEntries(keys.map((k) => [k, DEFAULT_SITE_DATA[k]])) as Partial<SiteData>;
    return saveSiteSection(patch);
}
