/**
 * Exercises the site-content Server Actions against the real database.
 * Same approach as actions.test.ts: only the admin gate and revalidatePath are stubbed.
 */
import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";

mock.module("@/lib/admin", () => ({
    isAdmin: async () => true,
    requireAdmin: async () => {},
}));

const revalidated: string[] = [];
mock.module("next/cache", () => ({
    revalidatePath: (p: string) => revalidated.push(p),
}));

const { saveSiteSection, resetSiteSection } = await import("./site-actions");
const { getStoredSiteData } = await import("@/lib/site-content");
const { DEFAULT_SITE_DATA } = await import("@/lib/site-data");
const { prisma } = await import("@/lib/prisma");

// These tests write the real singleton row, so snapshot and restore whatever the
// developer already had.
let saved: unknown = null;
beforeAll(async () => {
    saved = (await prisma.siteContent.findUnique({ where: { id: "singleton" } }))?.data ?? null;
});
afterAll(async () => {
    if (saved) {
        await prisma.siteContent.upsert({
            where: { id: "singleton" },
            create: { id: "singleton", data: saved as object },
            update: { data: saved as object },
        });
    } else {
        await prisma.siteContent.deleteMany({});
    }
});

describe("saveSiteSection", () => {
    test("patches one section and leaves the others alone", async () => {
        // Compared against what was actually stored, not against the defaults: the
        // row holds real image ids once anything has been uploaded, so "equals
        // DEFAULT_SITE_DATA" would only ever hold on a pristine database.
        const before = await getStoredSiteData();

        await saveSiteSection({ name: "PATCHED NAME" });
        const after = await getStoredSiteData();

        expect(after.name).toBe("PATCHED NAME");
        // The read-merge-write must not blank sections this editor didn't send.
        expect(after.experiences).toEqual(before.experiences);
        expect(after.socialLinks).toEqual(before.socialLinks);
    });

    test("two sequential patches to different sections both persist", async () => {
        await saveSiteSection({ tagline: "First patch." });
        await saveSiteSection({ stats: [{ key: "k", value: "1", label: "one" }] });
        const after = await getStoredSiteData();
        expect(after.tagline).toBe("First patch.");
        expect(after.stats).toEqual([{ key: "k", value: "1", label: "one" }]);
        expect(after.name).toBe("PATCHED NAME");
    });

    test("revalidates the layout so the footer updates too", async () => {
        revalidated.length = 0;
        await saveSiteSection({ name: "AGAIN" });
        expect(revalidated).toContain("/");
    });

    test("rejects a blank name or title", async () => {
        expect((await saveSiteSection({ name: "   " })).ok).toBe(false);
        expect((await saveSiteSection({ title: "" })).ok).toBe(false);
    });

    test("rejects a social link with no URL", async () => {
        const res = await saveSiteSection({
            socialLinks: [{ id: "1", label: "broken/", href: "", icon: "website" }],
        });
        expect(res.ok).toBe(false);
        if (!res.ok) expect(res.error).toContain("broken/");
    });

    test("rejects a contact email that isn't an address, but allows blank", async () => {
        expect((await saveSiteSection({ contact: { heading: "H", email: "nope" } })).ok).toBe(false);
        expect((await saveSiteSection({ contact: { heading: "H", email: "" } })).ok).toBe(true);
    });

});

describe("resetSiteSection", () => {
    test("restores only the named keys", async () => {
        await saveSiteSection({ name: "TEMP", tagline: "Temp tagline." });
        await resetSiteSection(["name"]);
        const after = await getStoredSiteData();
        expect(after.name).toBe(DEFAULT_SITE_DATA.name);
        expect(after.tagline).toBe("Temp tagline.");
    });
});
