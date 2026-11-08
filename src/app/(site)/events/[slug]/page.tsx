import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getEventBySlug, getPublishedEvents, publishedEventWhere } from "@/lib/events";
import { EventCard } from "@/components/events/event-card";
import { EventGallery } from "@/components/events/event-gallery";
import { Reveal } from "@/components/reveal";
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

/**
 * One cell of the ruled facts bar. Two columns on phones, four from md; the
 * caller passes which rules this cell draws, since that depends on its slot.
 */
function Fact({
    label,
    className,
    children,
}: {
    label: string;
    className: string;
    children: React.ReactNode;
}) {
    return (
        <div className={`border-border py-5 ${className}`}>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {label}
            </dt>
            <dd className="mt-2 text-sm font-semibold leading-snug text-foreground">{children}</dd>
        </div>
    );
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);
    if (!event) notFound();

    const [cover, ...gallery] = event.images;
    const more = (await getPublishedEvents(4)).filter((e) => e.id !== event.id).slice(0, 3);
    const where = formatLocation({
        ...event,
        country: event.country === "BD" ? "Bangladesh" : event.country,
    });
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
        <main className="pt-36 pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
            />

            <article>
                <header className="container mx-auto max-w-5xl px-6">
                    <Link
                        href="/events"
                        className="group mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft
                            size={14}
                            className="transition-transform group-hover:-translate-x-1"
                        />
                        All events
                    </Link>

                    {event.tags.length > 0 && (
                        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
                            {event.tags.join(" · ")}
                        </p>
                    )}
                    <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] text-balance md:text-6xl">
                        {event.title}
                    </h1>
                    <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">
                        {event.excerpt}
                    </p>

                    {/* Facts, ruled: the four things anyone asks about an event */}
                    <dl className="mt-10 grid grid-cols-2 border-y border-border md:grid-cols-4">
                        <Fact label="Date" className="pr-5">
                            <time dateTime={event.startDate.toISOString()}>{when}</time>
                        </Fact>
                        <Fact label="Where" className="border-l pl-5">
                            {where || "—"}
                            {hasGeo && (
                                <a
                                    href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 flex items-center gap-1 text-xs font-semibold text-gold-ink hover:underline"
                                >
                                    <MapPin size={12} /> Open in Maps
                                </a>
                            )}
                        </Fact>
                        <Fact
                            label="Organizer"
                            className="border-t pr-5 md:border-t-0 md:border-l md:pl-5"
                        >
                            {event.organizer || "—"}
                        </Fact>
                        <Fact label="My role" className="border-l border-t pl-5 md:border-t-0">
                            {event.role || "Attendee"}
                        </Fact>
                    </dl>
                </header>

                {cover && (
                    <Reveal className="container mx-auto mt-12 max-w-5xl px-6">
                        <figure>
                            <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border bg-muted">
                                <Image
                                    src={cover.url}
                                    alt={cover.alt || event.title}
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 1024px"
                                    className="object-cover"
                                />
                            </div>
                            {cover.caption && (
                                <figcaption className="mt-3 text-sm text-muted-foreground">
                                    {cover.caption}
                                </figcaption>
                            )}
                        </figure>
                    </Reveal>
                )}

                <div className="container mx-auto mt-14 max-w-3xl px-6">
                    <Markdown>{event.content}</Markdown>
                </div>

                {gallery.length > 0 && (
                    <section
                        className="container mx-auto mt-20 max-w-5xl px-6"
                        aria-labelledby="gallery-title"
                    >
                        <div className="mb-6 flex items-center gap-4">
                            <h2
                                id="gallery-title"
                                className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink"
                            >
                                Gallery · {gallery.length}
                            </h2>
                            <span aria-hidden className="h-px flex-1 bg-border" />
                        </div>
                        <EventGallery images={gallery} title={event.title} />
                    </section>
                )}
            </article>

            {more.length > 0 && (
                <section className="container mx-auto mt-28 max-w-6xl border-t border-border px-6 pt-16">
                    <div className="mb-8 flex items-end justify-between gap-6">
                        <h2 className="text-3xl font-bold tracking-[-0.03em]">More events</h2>
                        <Link
                            href="/events"
                            className="group flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-gold-ink"
                        >
                            All events
                            <ArrowRight
                                size={14}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {more.map((e, i) => (
                            <Reveal key={e.id} index={i} className="min-w-0">
                                <EventCard event={e} />
                            </Reveal>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
