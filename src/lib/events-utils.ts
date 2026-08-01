import type { ImageRef } from "@/lib/image-utils";

/**
 * Gallery bounds.
 *
 * The floor is 1 because an event write-up without a photo is just a blog post,
 * and /events exists to be the visual record.
 *
 * The ceiling is 10 because every image needs an alt written by hand. Ten get
 * written; twenty get skipped, and an undescribed image is worse for both search
 * and screen readers than one fewer photo. It is also roughly where a gallery
 * stops being skimmable and starts needing a lightbox and pagination to work.
 */
export const MIN_EVENT_IMAGES = 1;
export const MAX_EVENT_IMAGES = 10;

/**
 * Why a gallery is unacceptable, or null if it is fine.
 *
 * Pure, and shared by the editor and the server action — the editor uses it to
 * disable the save button, the action uses it as the actual gate. A form is not a
 * trust boundary, so the action must run this too rather than trusting the UI.
 */
export function validateGallery(images: Pick<ImageRef, "alt">[]): string | null {
    if (images.length < MIN_EVENT_IMAGES) {
        return "An event needs at least one image.";
    }
    if (images.length > MAX_EVENT_IMAGES) {
        return `An event can have at most ${MAX_EVENT_IMAGES} images (this one has ${images.length}).`;
    }

    const undescribed = images.findIndex((image) => !image.alt.trim());
    if (undescribed !== -1) {
        return `Image ${undescribed + 1} has no alt text. Describe every image — it is what makes them findable.`;
    }

    return null;
}

/**
 * The human-readable span of an event.
 *
 * A single day renders as one date. A range within one month collapses the
 * repeated month and year, because "3–5 March 2026" reads better than
 * "3 March 2026 — 5 March 2026" in a card.
 */
export function formatEventDates(start: Date, end: Date | null): string {
    const day = (d: Date) =>
        d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

    if (!end) return day(start);

    const sameDay = start.toDateString() === end.toDateString();
    if (sameDay) return day(start);

    const sameMonth =
        start.getUTCFullYear() === end.getUTCFullYear() && start.getUTCMonth() === end.getUTCMonth();
    if (sameMonth) {
        const monthYear = start.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
        return `${start.getUTCDate()}–${end.getUTCDate()} ${monthYear}`;
    }

    return `${day(start)} — ${day(end)}`;
}

/** The venue as one line: "BUET Auditorium, Dhaka, Bangladesh". Empty parts drop out. */
export function formatLocation(event: {
    venueName?: string | null;
    city?: string | null;
    region?: string | null;
    country?: string | null;
}): string {
    return [event.venueName, event.city, event.region, event.country]
        .map((part) => part?.trim())
        .filter(Boolean)
        .join(", ");
}
