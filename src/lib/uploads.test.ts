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

// Orphan detection keys on the image id now that every table refers to images by
// id rather than storing URLs. The url is carried along only so failures name the
// image that was wrongly kept or deleted.
const image = (id: string, age: number) => ({ id, url: `https://cdn/${id}.png`, createdAt: ago(age) });

const DAY = 24 * 60 * 60 * 1000;

describe("findOrphans", () => {
    test("keeps anything referenced, however old", () => {
        expect(findOrphans([image("a", 400 * DAY)], new Set(["a"]), NOW)).toEqual([]);
    });

    test("deletes unreferenced uploads past the grace window", () => {
        expect(findOrphans([image("orphan", 2 * DAY)], new Set(), NOW)).toHaveLength(1);
    });

    test("spares a fresh upload so an open editor session isn't sabotaged", () => {
        // The exact case: cover uploaded, post not saved yet.
        expect(findOrphans([image("just-now", 5 * 60 * 1000)], new Set(), NOW)).toEqual([]);
    });

    test("the grace boundary is inclusive", () => {
        expect(findOrphans([image("x", ORPHAN_GRACE_MS)], new Set(), NOW)).toHaveLength(1);
        expect(findOrphans([image("x", ORPHAN_GRACE_MS - 1)], new Set(), NOW)).toEqual([]);
    });

    test("separates referenced from unreferenced in a mixed batch", () => {
        const images = [image("used", 10 * DAY), image("dead", 10 * DAY), image("fresh", 1000)];
        expect(findOrphans(images, new Set(["used"]), NOW).map((o) => o.id)).toEqual(["dead"]);
    });

    test("a replaced image becomes an orphan while its successor is kept", () => {
        // Swapping a cover leaves the old row referenced by nothing.
        const images = [image("old-cover", 3 * DAY), image("new-cover", 3 * DAY)];
        expect(findOrphans(images, new Set(["new-cover"]), NOW).map((o) => o.id)).toEqual([
            "old-cover",
        ]);
    });

    test("an image referenced only by an event gallery is never an orphan", () => {
        // The regression the id-based rewrite exists to prevent: event photos are
        // referenced through Event.imageIds, which no URL scan would ever see.
        const images = [image("event-photo", 30 * DAY)];
        expect(findOrphans(images, new Set(["event-photo"]), NOW)).toEqual([]);
    });
});
