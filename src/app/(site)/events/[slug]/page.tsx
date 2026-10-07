import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getEventBySlug, publishedEventWhere } from "@/lib/events";
import { formatEventDates, formatLocation } from "@/lib/events-utils";
import { Markdown } from "@/components/blog/markdown";
import { SITE_URL, abs } from "@/lib/site";

export const revalidate = 60;

export async function generateStaticParams() {
    const events = await prisma.event.findMany({
        where: publishedEventWhere(),
        select: { slug: true },
    });
    return events.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const event = await getEventBySlug(slug);
    if (!event) return { title: "Event not found" };

    const title = event.seoTitle ?? event.title;
    const description = event.seoDescription ?? event.excerpt;
    const cover = event.images[0];

    return {
        title,
        description,
        keywords: event.tags,
        alternates: { canonical: event.canonicalUrl ?? `/events/${event.slug}` },
        robots: event.noindex ? { index: false, follow: false } : undefined,
        openGraph: {
            type: "article",
            url: abs(`/events/${event.slug}`),
            title,
            description,
            publishedTime: event.publishedAt?.toISOString(),
            modifiedTime: event.updatedAt.toISOString(),
            authors: ["Afif Zilani"],
            tags: event.tags,
            images: cover ? [{ url: cover.url, alt: cover.alt || event.title }] : undefined,
        },
        twitter: {
            card: cover ? "summary_large_image" : "summary",
            title,
            description,
            images: cover ? [cover.url] : undefined,
        },
    };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);
    if (!event) notFound();

    const [cover, ...gallery] = event.images;
    const where = formatLocation(event);
    const when = formatEventDates(event.startDate, event.endDate);

    /**
     * The location block, built only from what is actually set.
     *
     * Emitting a Place with an empty address, or GeoCoordinates with a missing
     * half, would assert something untrue about where this happened — so each
     * layer is added only when it has real content.
     */
    const address = {
        ...(event.streetAddress ? { streetAddress: event.streetAddress } : {}),
        ...(event.city ? { addressLocality: event.city } : {}),
        ...(event.region ? { addressRegion: event.region } : {}),
        ...(event.country ? { addressCountry: event.country } : {}),
    };
    const hasAddress = Object.keys(address).length > 0;
    const hasGeo = event.latitude !== null && event.longitude !== null;

    const location =
        event.venueName || hasAddress || hasGeo
            ? {
                  "@type": "Place",
                  ...(event.venueName ? { name: event.venueName } : {}),
                  ...(hasAddress ? { address: { "@type": "PostalAddress", ...address } } : {}),
                  ...(hasGeo
                      ? {
                            geo: {
                                "@type": "GeoCoordinates",
                                latitude: event.latitude,
                                longitude: event.longitude,
                            },
                        }
                      : {}),
              }
            : undefined;

    const schema = {
        "@context": "https://schema.org",
        "@type": "Event",
        "@id": `${SITE_URL}/events/${event.slug}#event`,
        name: event.title,
        description: event.seoDescription ?? event.excerpt,
        url: abs(`/events/${event.slug}`),
        startDate: event.startDate.toISOString(),
        ...(event.endDate ? { endDate: event.endDate.toISOString() } : {}),
        // Retrospective by design: every event here has already happened.
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        ...(location ? { location } : {}),
        // Every gallery image, described — a bare URL is not eligible for image results.
        ...(event.images.length > 0
            ? {
                  image: event.images.map((image) => ({
                      "@type": "ImageObject",
                      url: image.url,
                      caption: image.alt,
                      ...(image.width > 0 ? { width: image.width, height: image.height } : {}),
                  })),
              }
            : {}),
        ...(event.organizer
            ? { organizer: { "@type": "Organization", name: event.organizer } }
            : {}),
        // Points at the existing Person entity rather than minting a new one, so
        // attendance accrues to the identity the rest of the site already builds.
        attendee: { "@id": `${SITE_URL}/#person` },
        ...(event.tags.length > 0 ? { keywords: event.tags.join(", ") } : {}),
        inLanguage: "en",
    };

    const breadcrumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Events", item: abs("/events") },
            {
                "@type": "ListItem",
                position: 3,
                name: event.title,
                item: abs(`/events/${event.slug}`),
            },
        ],
    };

    return (
        <main className="pt-32 pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
            />

            <article className="container mx-auto px-6 max-w-3xl">
                <Link
                    href="/events"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 mb-8 group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    all events
                </Link>

                <header className="space-y-4 mb-8">
                    <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">{event.title}</h1>

                    <dl className="text-xs text-muted-foreground flex flex-wrap gap-x-5 gap-y-2">
                        <div className="flex items-center gap-1.5">
                            <dt className="sr-only">Date</dt>
                            <CalendarDays size={13} aria-hidden />
                            <dd>
                                <time dateTime={event.startDate.toISOString()}>{when}</time>
                            </dd>
                        </div>
                        {where && (
                            <div className="flex items-center gap-1.5">
                                <dt className="sr-only">Location</dt>
                                <MapPin size={13} aria-hidden />
                                <dd>{where}</dd>
                            </div>
                        )}
                        {event.organizer && (
                            <div className="flex items-center gap-1.5">
                                <dt className="sr-only">Organizer</dt>
                                <Users size={13} aria-hidden />
                                <dd>{event.organizer}</dd>
                            </div>
                        )}
                        {event.role && (
                            <div className="flex items-center gap-1.5">
                                <dt className="sr-only">Role</dt>
                                <dd className="text-primary">{event.role}</dd>
                            </div>
                        )}
                    </dl>
                </header>

                {cover && (
                    <figure className="mb-10">
                        <div className="relative w-full aspect-video border border-border">
                            <Image
                                src={cover.url}
                                alt={cover.alt}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 768px"
                                className="object-cover"
                            />
                        </div>
                        {cover.caption && (
                            <figcaption className="text-xs text-muted-foreground mt-2">
                                {cover.caption}
                            </figcaption>
                        )}
                    </figure>
                )}

                <Markdown>{event.content}</Markdown>

                {gallery.length > 0 && (
                    <section className="mt-14">
                        <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-5">
                            Gallery
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {gallery.map((image) => (
                                <figure key={image.id}>
                                    <div className="relative w-full aspect-video border border-border bg-muted">
                                        <Image
                                            src={image.url}
                                            alt={image.alt}
                                            fill
                                            loading="lazy"
                                            sizes="(max-width: 640px) 100vw, 50vw"
                                            className="object-cover"
                                        />
                                    </div>
                                    {image.caption && (
                                        <figcaption className="text-xs text-muted-foreground mt-1.5">
                                            {image.caption}
                                        </figcaption>
                                    )}
                                </figure>
                            ))}
                        </div>
                    </section>
                )}

                {event.tags.length > 0 && (
                    <ul className="flex flex-wrap gap-2 mt-12">
                        {event.tags.map((tag) => (
                            <li
                                key={tag}
                                className="text-xs border border-border px-2 py-1 text-muted-foreground"
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>
                )}
            </article>
        </main>
    );
}
