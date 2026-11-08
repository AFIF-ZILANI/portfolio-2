import type { Metadata } from "next";
import { getPublishedEvents } from "@/lib/events";
import { EventsArchive } from "@/components/events/events-archive";
import { SITE_URL, abs } from "@/lib/site";

export const revalidate = 60;

const TITLE = "Events — talks, meetups and workshops I've been to";
const DESCRIPTION =
    "First-hand write-ups of the events, meetups and workshops Afif Zilani has attended, with photos and what came out of each one.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/events" },
    openGraph: {
        type: "website",
        url: abs("/events"),
        title: TITLE,
        description: DESCRIPTION,
    },
};

export default async function EventsPage() {
    const events = await getPublishedEvents();
    const places = new Set(events.map((e) => e.city?.trim().toLowerCase()).filter(Boolean)).size;

    // A CollectionPage listing real, dated, located items is what lets an assistant
    // answer "which events has he been to" without crawling every detail page.
    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/events#collection`,
        url: abs("/events"),
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#person` },
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: events.length,
            itemListElement: events.map((event, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: abs(`/events/${event.slug}`),
                name: event.title,
            })),
        },
    };

    return (
        <main className="pt-36 pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <div className="container mx-auto px-6 max-w-6xl">
                <header className="mb-14 grid gap-8 border-b border-border pb-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                    <div className="space-y-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
                            Events
                        </p>
                        <h1 className="text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] md:text-7xl">
                            Where I&apos;ve shown up.
                        </h1>
                        <p className="max-w-2xl text-lg text-muted-foreground">
                            Meetups, summits and workshops, and what I took away from each.
                        </p>
                    </div>
                    {events.length > 0 && (
                        <dl className="flex gap-10">
                            <div className="flex flex-col-reverse">
                                <dt className="text-sm text-muted-foreground">events</dt>
                                <dd className="text-4xl font-extrabold tracking-[-0.04em] tabular-nums">
                                    {events.length}
                                </dd>
                            </div>
                            {places > 0 && (
                                <div className="flex flex-col-reverse">
                                    <dt className="text-sm text-muted-foreground">
                                        {places === 1 ? "city" : "cities"}
                                    </dt>
                                    <dd className="text-4xl font-extrabold tracking-[-0.04em] tabular-nums">
                                        {places}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    )}
                </header>

                <EventsArchive events={events} />
            </div>
        </main>
    );
}
