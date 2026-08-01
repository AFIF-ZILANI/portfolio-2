import type { Metadata } from "next";
import { getPublishedEvents } from "@/lib/events";
import { EventCard } from "@/components/events/event-card";
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
        <main className="pt-32 pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <div className="container mx-auto px-6 max-w-6xl">
                <header className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold">
                        <span className="text-primary font-mono">~/</span>events
                    </h1>
                    <p className="text-muted-foreground mt-3 max-w-2xl">
                        Where I&apos;ve been and what I took away from it.
                    </p>
                </header>

                {events.length === 0 ? (
                    <p className="text-muted-foreground font-mono text-sm border border-dashed border-border p-12 text-center">
                        No write-ups yet. The next one goes up after the next event.
                    </p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event, i) => (
                            <EventCard key={event.id} event={event} priority={i === 0} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
