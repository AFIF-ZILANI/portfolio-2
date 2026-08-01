import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EventEditor } from "@/components/admin/event-editor";
import { resolveGallery } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) notFound();

    // The editor renders the gallery, so resolve the ids into rows here.
    const images = await resolveGallery(event.imageIds);

    return (
        <EventEditor
            event={{
                id: event.id,
                title: event.title,
                slug: event.slug,
                excerpt: event.excerpt,
                content: event.content,
                images,
                // The editor needs Dates for the datetime-local fields; the action takes strings.
                startDate: event.startDate.toISOString(),
                startDateValue: event.startDate,
                endDate: event.endDate?.toISOString() ?? null,
                endDateValue: event.endDate,
                venueName: event.venueName,
                streetAddress: event.streetAddress,
                city: event.city,
                region: event.region,
                country: event.country,
                latitude: event.latitude,
                longitude: event.longitude,
                organizer: event.organizer,
                role: event.role,
                tags: event.tags,
                status: event.status,
                publishedAt: event.publishedAt?.toISOString() ?? null,
                publishedAtDate: event.publishedAt,
                seoTitle: event.seoTitle,
                seoDescription: event.seoDescription,
                canonicalUrl: event.canonicalUrl,
                noindex: event.noindex,
            }}
        />
    );
}
