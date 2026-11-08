"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EventCard } from "@/components/events/event-card";
import type { EventCard as EventCardData } from "@/lib/events";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Every published event, grouped by year with the year held in a sticky column,
 * filterable by tag. Filtering re-flows the cards in place rather than
 * re-rendering the page, so the reader keeps their place.
 */
export function EventsArchive({ events }: { events: EventCardData[] }) {
    const [tag, setTag] = useState<string | null>(null);

    const tags = useMemo(() => [...new Set(events.flatMap((e) => e.tags))].sort(), [events]);

    const years = useMemo(() => {
        const shown = tag ? events.filter((e) => e.tags.includes(tag)) : events;
        const byYear = new Map<number, EventCardData[]>();
        for (const e of shown) {
            const y = new Date(e.startDate).getFullYear();
            byYear.set(y, [...(byYear.get(y) ?? []), e]);
        }
        return [...byYear].sort((a, b) => b[0] - a[0]);
    }, [events, tag]);

    const chip = (on: boolean) =>
        `rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
            on
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
        }`;

    if (events.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-border p-16 text-center">
                <p className="text-2xl font-bold tracking-[-0.02em]">No write-ups yet.</p>
                <p className="mt-2 text-muted-foreground">
                    The next one goes up after the next event.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-14">
            {tags.length > 1 && (
                <div
                    className="flex flex-wrap items-center gap-2"
                    role="group"
                    aria-label="Filter by tag"
                >
                    <button
                        type="button"
                        className={chip(!tag)}
                        aria-pressed={!tag}
                        onClick={() => setTag(null)}
                    >
                        All
                    </button>
                    {tags.map((t) => (
                        <button
                            key={t}
                            type="button"
                            className={chip(tag === t)}
                            aria-pressed={tag === t}
                            onClick={() => setTag(tag === t ? null : t)}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            )}

            <div className="space-y-16" aria-live="polite">
                {years.map(([year, list]) => (
                    <section
                        key={year}
                        className="grid gap-6 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-10"
                    >
                        <div className="md:sticky md:top-28 md:self-start">
                            <h2 className="text-5xl font-extrabold tracking-[-0.045em] text-foreground tabular-nums">
                                {year}
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {list.length} {list.length === 1 ? "event" : "events"}
                            </p>
                            <span aria-hidden className="mt-4 block h-0.5 w-10 bg-gold" />
                        </div>
                        <motion.div
                            layout
                            className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            <AnimatePresence mode="popLayout" initial={false}>
                                {list.map((event, i) => (
                                    <motion.div
                                        key={event.id}
                                        layout
                                        className="min-w-0"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.96 }}
                                        viewport={{ once: true, margin: "-40px" }}
                                        transition={{
                                            duration: 0.55,
                                            delay: (i % 3) * 0.08,
                                            ease: EASE,
                                        }}
                                    >
                                        <EventCard
                                            event={event}
                                            priority={year === years[0][0] && i === 0}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </section>
                ))}
            </div>
        </div>
    );
}
