"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/blog";
import { validateGallery } from "@/lib/events-utils";

export type EventInput = {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    /** Ordered Image ids. [0] is the cover. */
    imageIds: string[];
    startDate: string;
    endDate: string | null;
    venueName: string | null;
    streetAddress: string | null;
    city: string | null;
    region: string | null;
    country: string;
    latitude: number | null;
    longitude: number | null;
    organizer: string | null;
    role: string | null;
    tags: string[];
    status: "DRAFT" | "PUBLISHED";
    publishedAt: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    canonicalUrl: string | null;
    noindex: boolean;
};

type Failure = { ok: false; error: string };
export type EventSaveResult = { ok: true; slug: string } | Failure;

/** Repopulate every cached surface an event can appear on. */
function revalidateEvents(slug?: string) {
    revalidatePath("/events");
    revalidatePath("/");
    revalidatePath("/sitemap.xml");
    if (slug) revalidatePath(`/events/${slug}`);
}

const trim = (v: string | null) => {
    const t = v?.trim();
    return t ? t : null;
};

function isUniqueViolation(e: unknown): boolean {
    return (
        typeof e === "object" &&
        e !== null &&
        ("code" in e ? (e as { code?: string }).code === "P2002" : false)
    );
}

/**
 * Latitude and longitude are only useful as a pair, and only inside real bounds.
 * A half-filled or out-of-range coordinate would emit GeoCoordinates that place
 * the event somewhere it was not, which is worse than emitting none.
 */
function validateCoordinates(lat: number | null, lng: number | null): string | null {
    if (lat === null && lng === null) return null;
    if (lat === null || lng === null) {
        return "Latitude and longitude must both be set, or both be empty.";
    }
    if (lat < -90 || lat > 90) return "Latitude must be between -90 and 90.";
    if (lng < -180 || lng > 180) return "Longitude must be between -180 and 180.";
    return null;
}

export async function saveEvent(input: EventInput): Promise<EventSaveResult> {
    await requireAdmin();

    // Trust boundary: the client is a form, but the action is a public POST endpoint.
    const title = input.title.trim();
    const excerpt = input.excerpt.trim();
    const content = input.content.trim();
    if (!title) return { ok: false, error: "Title is required." };
    if (!excerpt) return { ok: false, error: "Excerpt is required — it's the meta description." };
    if (!content) return { ok: false, error: "Content is required." };

    const slug = slugify(input.slug || title);
    if (!slug) return { ok: false, error: "Slug could not be derived from the title." };

    const startDate = new Date(input.startDate);
    if (!input.startDate || Number.isNaN(startDate.getTime())) {
        return { ok: false, error: "Start date is required and must be a valid date." };
    }
    const endDate = input.endDate ? new Date(input.endDate) : null;
    if (endDate && Number.isNaN(endDate.getTime())) {
        return { ok: false, error: "End date is not a valid date." };
    }
    if (endDate && endDate < startDate) {
        return { ok: false, error: "The event cannot end before it starts." };
    }

    const coordError = validateCoordinates(input.latitude, input.longitude);
    if (coordError) return { ok: false, error: coordError };

    // Re-read the images rather than trusting alt text sent by the client: alt lives
    // on the image row, and the row is what the page will actually render.
    const imageIds = input.imageIds.filter(Boolean);
    const images = await prisma.image.findMany({
        where: { id: { in: imageIds } },
        select: { id: true, alt: true },
    });
    const byId = new Map(images.map((i) => [i.id, i]));

    const missing = imageIds.filter((id) => !byId.has(id));
    if (missing.length > 0) {
        return { ok: false, error: "One of the selected images no longer exists." };
    }

    // Ordered, so "Image 2 has no alt text" points at the one the editor shows second.
    const galleryError = validateGallery(imageIds.map((id) => byId.get(id)!));
    if (galleryError) return { ok: false, error: galleryError };

    // Publishing with no date means "now"; a future date means scheduled.
    const publishedAt =
        input.status === "PUBLISHED"
            ? input.publishedAt
                ? new Date(input.publishedAt)
                : new Date()
            : input.publishedAt
              ? new Date(input.publishedAt)
              : null;

    if (publishedAt && Number.isNaN(publishedAt.getTime())) {
        return { ok: false, error: "Publish date is not a valid date." };
    }

    const data = {
        slug,
        title,
        excerpt,
        content,
        imageIds,
        startDate,
        endDate,
        venueName: trim(input.venueName),
        streetAddress: trim(input.streetAddress),
        city: trim(input.city),
        region: trim(input.region),
        country: input.country.trim() || "BD",
        latitude: input.latitude,
        longitude: input.longitude,
        organizer: trim(input.organizer),
        role: trim(input.role),
        tags: input.tags.map((t) => t.trim()).filter(Boolean),
        status: input.status,
        publishedAt,
        seoTitle: trim(input.seoTitle),
        seoDescription: trim(input.seoDescription),
        canonicalUrl: trim(input.canonicalUrl),
        noindex: input.noindex,
    };

    try {
        if (input.id) {
            // Read the old slug BEFORE updating: prisma.update() returns the NEW row,
            // so reading it afterwards would leave the old URL serving stale content.
            const before = await prisma.event.findUnique({
                where: { id: input.id },
                select: { slug: true },
            });
            await prisma.event.update({ where: { id: input.id }, data });
            if (before && before.slug !== slug) revalidateEvents(before.slug);
        } else {
            await prisma.event.create({ data });
        }
    } catch (e) {
        if (isUniqueViolation(e)) {
            return { ok: false, error: `The slug "${slug}" is already taken.` };
        }
        throw e;
    }

    revalidateEvents(slug);
    return { ok: true, slug };
}

export async function deleteEvent(id: string): Promise<void> {
    await requireAdmin();
    const event = await prisma.event.delete({ where: { id } });
    revalidateEvents(event.slug);
}

/**
 * Flip an event between draft and published from the list.
 *
 * Publishing an event that has never had a date sets it to now. Unpublishing keeps
 * the existing date so re-publishing restores the original one.
 */
export async function toggleEventStatus(id: string): Promise<EventSaveResult> {
    await requireAdmin();

    const event = await prisma.event.findUnique({
        where: { id },
        select: { slug: true, status: true, publishedAt: true, imageIds: true },
    });
    if (!event) return { ok: false, error: "That event no longer exists." };

    const publishing = event.status === "DRAFT";

    // The gallery rule is enforced on the way out too — publishing from the list
    // bypasses the editor, and an event with no described images must not go live.
    if (publishing) {
        const images = await prisma.image.findMany({
            where: { id: { in: event.imageIds } },
            select: { id: true, alt: true },
        });
        const byId = new Map(images.map((i) => [i.id, i]));
        const ordered = event.imageIds.map((id) => byId.get(id)).filter(Boolean) as {
            alt: string;
        }[];
        const error = validateGallery(ordered);
        if (error) return { ok: false, error };
    }

    await prisma.event.update({
        where: { id },
        data: {
            status: publishing ? "PUBLISHED" : "DRAFT",
            publishedAt: publishing ? (event.publishedAt ?? new Date()) : event.publishedAt,
        },
    });

    revalidateEvents(event.slug);
    return { ok: true, slug: event.slug };
}
