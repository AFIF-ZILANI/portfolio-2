import { describe, expect, test } from "bun:test";
import {
    formatEventDates,
    formatLocation,
    MAX_EVENT_IMAGES,
    validateGallery,
} from "./events-utils";

const img = (alt: string) => ({ alt });

describe("validateGallery", () => {
    test("an event with no images is rejected", () => {
        expect(validateGallery([])).toBe("An event needs at least one image.");
    });

    test("one described image is enough", () => {
        expect(validateGallery([img("Opening keynote")])).toBeNull();
    });

    test("the maximum is allowed, one over is not", () => {
        const atMax = Array.from({ length: MAX_EVENT_IMAGES }, (_, i) => img(`photo ${i}`));
        expect(validateGallery(atMax)).toBeNull();
        expect(validateGallery([...atMax, img("one too many")])).toContain("at most 10");
    });

    test("a blank alt fails the save, and says which image", () => {
        // The point of the whole rule: an undescribed image must not reach the site.
        const error = validateGallery([img("fine"), img("   "), img("also fine")]);
        expect(error).toContain("Image 2");
    });

    test("whitespace is not alt text", () => {
        expect(validateGallery([img("\t\n ")])).toContain("Image 1");
    });
});

describe("formatEventDates", () => {
    const d = (iso: string) => new Date(iso);

    test("a one-day event shows a single date", () => {
        expect(formatEventDates(d("2026-03-03T09:00:00Z"), null)).toBe("3 Mar 2026");
    });

    test("start and end on the same day do not render as a range", () => {
        expect(formatEventDates(d("2026-03-03T09:00:00Z"), d("2026-03-03T17:00:00Z"))).toBe(
            "3 Mar 2026"
        );
    });

    test("a range inside one month collapses the repeated month", () => {
        expect(formatEventDates(d("2026-03-03T00:00:00Z"), d("2026-03-05T00:00:00Z"))).toBe(
            "3–5 Mar 2026"
        );
    });

    test("a range spanning months keeps both dates in full", () => {
        expect(formatEventDates(d("2026-03-30T00:00:00Z"), d("2026-04-02T00:00:00Z"))).toBe(
            "30 Mar 2026 — 2 Apr 2026"
        );
    });
});

describe("formatLocation", () => {
    test("joins the parts that are present", () => {
        expect(
            formatLocation({ venueName: "BUET Auditorium", city: "Dhaka", country: "Bangladesh" })
        ).toBe("BUET Auditorium, Dhaka, Bangladesh");
    });

    test("missing and blank parts drop out rather than leaving stray commas", () => {
        expect(formatLocation({ venueName: null, city: "Naogaon", region: "  ", country: "BD" })).toBe(
            "Naogaon, BD"
        );
    });

    test("an event with no location at all is an empty string, not ', , '", () => {
        expect(formatLocation({})).toBe("");
    });
});
