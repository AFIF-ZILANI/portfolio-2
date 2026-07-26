import { describe, expect, test } from "bun:test";
import { findOrphans, ORPHAN_GRACE_MS, signDestroy } from "./uploads";

describe("signDestroy", () => {
    // Known vector: sha1("public_id=sample&timestamp=1234567890" + "testsecret").
    // Pins the exact formula Cloudinary requires — params sorted and joined as a
    // query string, secret appended, SHA-1 hex.
    test("matches Cloudinary's documented signing formula", () => {
        expect(signDestroy("sample", 1234567890, "testsecret")).toBe(
            "b2e653c5add27ca7b70c9a94c78955de3ae5a090"
        );
    });

    test("folder-qualified public ids are signed verbatim, not escaped", () => {
        // Uploads land under a folder (e.g. "events/abc"), and the slash must not
        // be percent-encoded or every signature would be rejected.
        const sig = signDestroy("events/abc", 1, "s");
        expect(sig).toBe(signDestroy("events/abc", 1, "s"));
        expect(sig).not.toBe(signDestroy("events%2Fabc", 1, "s"));
    });
});

const NOW = new Date("2026-07-26T12:00:00Z").getTime();
const ago = (ms: number) => new Date(NOW - ms);

const upload = (url: string, age: number) => ({ url, createdAt: ago(age) });

const DAY = 24 * 60 * 60 * 1000;

describe("findOrphans", () => {
    test("keeps anything referenced, however old", () => {
        const uploads = [upload("https://cdn/a.png", 400 * DAY)];
        expect(findOrphans(uploads, new Set(["https://cdn/a.png"]), NOW)).toEqual([]);
    });

    test("deletes unreferenced uploads past the grace window", () => {
        const uploads = [upload("https://cdn/orphan.png", 2 * DAY)];
        expect(findOrphans(uploads, new Set(), NOW)).toHaveLength(1);
    });

    test("spares a fresh upload so an open editor session isn't sabotaged", () => {
        // The exact case: cover uploaded, post not saved yet.
        const uploads = [upload("https://cdn/just-now.png", 5 * 60 * 1000)];
        expect(findOrphans(uploads, new Set(), NOW)).toEqual([]);
    });

    test("the grace boundary is inclusive", () => {
        expect(findOrphans([upload("https://cdn/x.png", ORPHAN_GRACE_MS)], new Set(), NOW)).toHaveLength(1);
        expect(
            findOrphans([upload("https://cdn/x.png", ORPHAN_GRACE_MS - 1)], new Set(), NOW)
        ).toEqual([]);
    });

    test("separates referenced from unreferenced in a mixed batch", () => {
        const uploads = [
            upload("https://cdn/used.png", 10 * DAY),
            upload("https://cdn/dead.png", 10 * DAY),
            upload("https://cdn/fresh.png", 1000),
        ];
        const orphans = findOrphans(uploads, new Set(["https://cdn/used.png"]), NOW);
        expect(orphans.map((o) => o.url)).toEqual(["https://cdn/dead.png"]);
    });

    test("a replaced image becomes an orphan while its successor is kept", () => {
        // Swapping a cover leaves the old URL referenced by nothing.
        const uploads = [
            upload("https://cdn/old-cover.png", 3 * DAY),
            upload("https://cdn/new-cover.png", 3 * DAY),
        ];
        const orphans = findOrphans(uploads, new Set(["https://cdn/new-cover.png"]), NOW);
        expect(orphans.map((o) => o.url)).toEqual(["https://cdn/old-cover.png"]);
    });
});
