import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { EventCard as EventCardData } from "@/lib/events";
import { formatEventDates } from "@/lib/events-utils";

/**
 * One event in a grid. A server component: static markup, no JavaScript.
 *
 * The date sits on the cover as a calendar stamp, because "when" is the first
 * thing anyone wants to know about an event and it reads at a glance there.
 * `priority` is for the first card above the fold, the LCP element on /events.
 */
export function EventCard({
    event,
    priority = false,
    headingLevel: H = "h3",
}: {
    event: EventCardData;
    priority?: boolean;
    headingLevel?: "h2" | "h3";
}) {
    const start = new Date(event.startDate);
    const day = start.toLocaleDateString("en-GB", { day: "2-digit" });
    const month = start.toLocaleDateString("en-GB", { month: "short" });
    const place = [event.city, event.country === "BD" ? "Bangladesh" : event.country]
        .filter(Boolean)
        .join(", ");

    return (
        <article className="h-full">
            <Link
                href={`/events/${event.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_10px_30px_-12px_rgb(20_33_61/0.18)]"
            >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    {event.cover ? (
                        <Image
                            src={event.cover.url}
                            alt={event.cover.alt || event.title}
                            fill
                            priority={priority}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-gold/15" />
                    )}

                    {/* Calendar stamp */}
                    <div className="absolute left-3 top-3 flex w-14 flex-col items-center overflow-hidden rounded-xl bg-white text-[#0E1320] shadow-[0_6px_20px_-8px_rgb(0_0_0/0.35)]">
                        <span className="w-full bg-[#14213D] py-0.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                            {month}
                        </span>
                        <span className="py-1 text-xl font-extrabold tabular-nums tracking-[-0.03em]">
                            {day}
                        </span>
                    </div>

                    {event.role && (
                        <span className="absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                            {event.role}
                        </span>
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-2.5 p-5">
                    {/* The stamp already says when; this line says who ran it */}
                    <p className="truncate text-xs font-medium text-muted-foreground">
                        {event.organizer || formatEventDates(event.startDate, event.endDate)}
                    </p>
                    <H className="text-lg font-bold leading-snug tracking-[-0.02em] text-foreground">
                        {event.title}
                    </H>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {event.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                        <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                            {place && (
                                <>
                                    <MapPin size={13} className="shrink-0 text-gold" />
                                    <span className="truncate">{place}</span>
                                </>
                            )}
                        </span>
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border transition-all duration-300 group-hover:rotate-45 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                            <ArrowUpRight size={14} />
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    );
}
