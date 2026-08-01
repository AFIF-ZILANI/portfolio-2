import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { EventCard as EventCardData } from "@/lib/events";
import { formatEventDates, formatLocation } from "@/lib/events-utils";

/**
 * One event in a grid. A server component — static markup, so it adds no
 * JavaScript to whichever page renders it.
 *
 * `priority` is for the first card above the fold, which is the LCP element on
 * /events. Everything else stays lazy.
 */
export function EventCard({ event, priority = false }: { event: EventCardData; priority?: boolean }) {
    const where = formatLocation(event);

    return (
        <article>
            <Link
                href={`/events/${event.slug}`}
                className="group flex flex-col h-full bg-card border border-border hover:border-primary transition-colors duration-300"
            >
                <div className="relative w-full aspect-video bg-muted overflow-hidden">
                    {event.cover ? (
                        <Image
                            src={event.cover.url}
                            alt={event.cover.alt || event.title}
                            fill
                            priority={priority}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 grid place-items-center font-mono text-xs text-muted-foreground">
                            {event.slug}
                        </div>
                    )}
                </div>

                <div className="p-5 flex flex-col gap-3 flex-1">
                    <p className="font-mono text-xs text-primary">
                        {formatEventDates(event.startDate, event.endDate)}
                        {event.role ? ` · ${event.role}` : ""}
                    </p>

                    <h3 className="font-bold leading-snug group-hover:text-primary transition-colors">
                        {event.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-3">{event.excerpt}</p>

                    {where && (
                        <p className="font-mono text-xs text-muted-foreground mt-auto pt-1 flex items-center gap-1.5">
                            <MapPin size={12} className="shrink-0" />
                            <span className="truncate">{where}</span>
                        </p>
                    )}
                </div>
            </Link>
        </article>
    );
}
