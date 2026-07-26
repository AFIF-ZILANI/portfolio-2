import { describe, expect, test } from "bun:test";
import { readingMinutes, slugify } from "./blog-utils";
import { publishedWhere } from "./blog";

describe("slugify", () => {
    test("lowercases and dashes", () => {
        expect(slugify("Hello World")).toBe("hello-world");
    });

    test("collapses punctuation runs instead of leaving double dashes", () => {
        expect(slugify("Next.js 15 -- What's New?!")).toBe("next-js-15-whats-new");
    });

    test("strips leading and trailing dashes", () => {
        expect(slugify("  ...Rust & Go...  ")).toBe("rust-go");
    });
});

describe("readingMinutes", () => {
    test("never returns zero for a short or empty post", () => {
        expect(readingMinutes("")).toBe(1);
        expect(readingMinutes("one two three")).toBe(1);
    });

    test("rounds up partial minutes", () => {
        expect(readingMinutes("word ".repeat(201))).toBe(2);
        expect(readingMinutes("word ".repeat(200))).toBe(1);
    });
});

describe("publishedWhere", () => {
    test("excludes drafts", () => {
        expect(publishedWhere().status).toBe("PUBLISHED");
    });

    test("excludes future-dated (scheduled) posts", () => {
        const cutoff = (publishedWhere().publishedAt as { lte: Date }).lte;
        expect(cutoff.getTime()).toBeLessThanOrEqual(Date.now());
    });

    // The bug this guards: as a module-level const, the cutoff would freeze at import
    // time and scheduled posts would never go live on a long-running server.
    test("recomputes the cutoff on every call", async () => {
        const first = (publishedWhere().publishedAt as { lte: Date }).lte;
        await Bun.sleep(5);
        const second = (publishedWhere().publishedAt as { lte: Date }).lte;
        expect(second.getTime()).toBeGreaterThan(first.getTime());
    });
});
