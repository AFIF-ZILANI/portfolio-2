import { describe, expect, test } from "bun:test";
import { mergeSiteData } from "./site-content";
import { DEFAULT_SITE_DATA } from "./site-data";

describe("mergeSiteData", () => {
    test("a fresh database renders the built-in defaults", () => {
        expect(mergeSiteData(null)).toEqual(DEFAULT_SITE_DATA);
        expect(mergeSiteData(undefined)).toEqual(DEFAULT_SITE_DATA);
    });

    test("stored values win", () => {
        const merged = mergeSiteData({ name: "NEW NAME", title: "Tinkerer." });
        expect(merged.name).toBe("NEW NAME");
        expect(merged.title).toBe("Tinkerer.");
    });

    test("fields absent from the record fall back independently", () => {
        // This is what makes adding a new SiteData field safe without a migration:
        // an older stored record simply inherits the default for it.
        const merged = mergeSiteData({ name: "NEW NAME" });
        expect(merged.tagline).toBe(DEFAULT_SITE_DATA.tagline);
        expect(merged.projects).toEqual(DEFAULT_SITE_DATA.projects);
        expect(merged.skills).toEqual(DEFAULT_SITE_DATA.skills);
    });

    test("an empty list falls back rather than blanking a section", () => {
        expect(mergeSiteData({ skills: [] }).skills).toEqual(DEFAULT_SITE_DATA.skills);
        expect(mergeSiteData({ socialLinks: [] }).socialLinks).toEqual(
            DEFAULT_SITE_DATA.socialLinks
        );
    });

    test("a blank string falls back rather than rendering an empty heading", () => {
        expect(mergeSiteData({ name: "   " }).name).toBe(DEFAULT_SITE_DATA.name);
        expect(mergeSiteData({ heroImage: "" }).heroImage).toBe(DEFAULT_SITE_DATA.heroImage);
    });

    test("a blank contact email is preserved — it means 'use CONTACT_EMAIL'", () => {
        // The one field where empty is a real choice, not a missing value.
        expect(mergeSiteData({ contact: { heading: "Say hi", email: "" } }).contact).toEqual({
            heading: "Say hi",
            email: "",
        });
    });

    test("a non-empty list replaces the default entirely", () => {
        const skills = [{ id: "x", name: "Zig", category: "Languages", icon: "SiZig" }];
        expect(mergeSiteData({ skills }).skills).toEqual(skills);
    });
});
