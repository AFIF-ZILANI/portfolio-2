import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { EventCard } from "@/components/events/event-card";
import { Reveal } from "@/components/reveal";
import type { EventCard as EventCardData } from "@/lib/events";

/**
 * Pinned events on the homepage, three or four across, each opening its
 * write-up. Pin them in the event editor; until any are pinned this shows the
 * newest (see getPinnedEvents).
 */
export function PinnedEvents({ events }: { events: EventCardData[] }) {
    if (events.length === 0) return null;
    // Columns follow the count so three cards never leave an empty fourth slot
    const cols =
        events.length >= 4 ? "lg:grid-cols-4" : events.length === 3 ? "lg:grid-cols-3" : "";

    return (
        <section id="events" className="border-t border-border py-24 md:py-32">
            <div className="container mx-auto max-w-6xl px-6">
                <SectionHeading
                    eyebrow="Events"
                    title="Where I’ve shown up."
                    action={
                        <Link
                            href="/events"
                            className="group flex shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-gold-ink"
                        >
                            All events
                            <ArrowRight
                                size={14}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>
                    }
                />
                <div className={`grid gap-4 sm:grid-cols-2 ${cols}`}>
                    {events.map((event, i) => (
                        <Reveal key={event.id} index={i} className="min-w-0">
                            <EventCard event={event} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
