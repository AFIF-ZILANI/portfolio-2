import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { EventCard as EventCardData } from "@/lib/events";
import { EventCard } from "@/components/events/event-card";

/**
 * Recent events on the homepage.
 *
 * A server component, like LatestPosts — static markup, so it adds nothing to the
 * homepage bundle.
 */
export function LatestEvents({ events }: { events: EventCardData[] }) {
    // Nothing published yet: render nothing rather than an empty shell.
    if (events.length === 0) return null;

    return (
        <section id="events" className="py-24">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex items-end justify-between gap-4 mb-12 flex-wrap">
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                        <span className="text-primary">06.</span> Recent Events
                    </h2>
                    <Link
                        href="/events"
                        className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group"
                    >
                        all events
                        <ArrowRight
                            size={14}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </Link>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </section>
    );
}
