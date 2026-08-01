import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { resolveGallery, type ImageRef } from "@/lib/images";

// Server-side convenience: the pure helpers live in events-utils so that client
// components can import them without pulling Prisma into the browser bundle.
export {
    MIN_EVENT_IMAGES,
    MAX_EVENT_IMAGES,
    validateGallery,
    formatEventDates,
    formatLocation,
} from "@/lib/events-utils";

/**
 * The single source of truth for "is this event publicly visible".
 *
 * Mirrors publishedWhere() for posts, and exists for the same reason: one guard
 * that every public query imports, so a new route cannot forget it and leak a
 * draft. Must stay a function — as a const, `new Date()` would freeze at module
 * load and scheduled events would never appear.
 */
export function publishedEventWhere(): Prisma.EventWhereInput {
    return { status: "PUBLISHED", publishedAt: { lte: new Date() } };
}

/** Fields the listing grid needs — deliberately excludes `content`. */
const cardSelect = {
    id: true,
    slug: true,
    title: true,
    excerpt: true,
    imageIds: true,
    startDate: true,
    endDate: true,
    venueName: true,
    city: true,
    region: true,
    country: true,
    organizer: true,
    role: true,
    tags: true,
    publishedAt: true,
    views: true,
} satisfies Prisma.EventSelect;

type EventRow = Prisma.EventGetPayload<{ select: typeof cardSelect }>;

/** An event card with its cover resolved. Only the cover — the grid shows one image. */
export type EventCard = Omit<EventRow, "imageIds"> & { cover: ImageRef | null };

/**
 * Published events, newest first.
 *
 * Covers are resolved in a single query for the whole page rather than one per
 * card, which is why this maps ids by hand instead of using a Prisma relation.
 */
export async function getPublishedEvents(take?: number): Promise<EventCard[]> {
    const events = await prisma.event.findMany({
        where: publishedEventWhere(),
        orderBy: { startDate: "desc" },
        select: cardSelect,
        ...(take ? { take } : {}),
    });

    const covers = await resolveGallery(events.map((e) => e.imageIds[0]).filter(Boolean));
    const byId = new Map(covers.map((image) => [image.id, image]));

    return events.map(({ imageIds, ...event }) => ({
        ...event,
        cover: byId.get(imageIds[0]) ?? null,
    }));
}

/** One published event with its full gallery, in order. */
export async function getEventBySlug(slug: string) {
    const event = await prisma.event.findFirst({
        where: { slug, ...publishedEventWhere() },
    });
    if (!event) return null;

    return { ...event, images: await resolveGallery(event.imageIds) };
}

/** Admin listing: drafts and scheduled events included, newest first. */
export function getAllEvents() {
    return prisma.event.findMany({
        orderBy: { startDate: "desc" },
        select: { ...cardSelect, status: true, noindex: true },
    });
}
