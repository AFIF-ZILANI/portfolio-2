import Link from "next/link";
import { Eye, Pencil, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllEvents, formatEventDates, formatLocation } from "@/lib/events";
import { DeleteEventButton, EventStatusToggle } from "@/components/admin/event-row-actions";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
    const events = await getAllEvents();
    const now = Date.now();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold font-mono">
                    <span className="text-primary">$</span> ls events
                    <span className="text-muted-foreground text-sm ml-3">({events.length})</span>
                </h1>
                <Link href="/admin/events/create">
                    <Button className="font-mono">
                        <Plus size={16} /> new event
                    </Button>
                </Link>
            </div>

            {events.length === 0 ? (
                <p className="text-muted-foreground font-mono text-sm border border-dashed border-border p-12 text-center">
                    No events yet. Write up the last one you went to.
                </p>
            ) : (
                <div className="border border-border divide-y divide-border">
                    {events.map((e) => {
                        const scheduled =
                            e.status === "PUBLISHED" &&
                            e.publishedAt &&
                            e.publishedAt.getTime() > now;
                        const where = formatLocation(e);
                        return (
                            <div
                                key={e.id}
                                className="p-4 flex items-center gap-4 hover:bg-card transition-colors"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium truncate">{e.title}</span>
                                        {e.status === "DRAFT" && (
                                            <Badge variant="secondary" className="font-mono text-xs">
                                                draft
                                            </Badge>
                                        )}
                                        {scheduled && (
                                            <Badge className="font-mono text-xs">scheduled</Badge>
                                        )}
                                        {e.role && (
                                            <Badge variant="outline" className="font-mono text-xs">
                                                {e.role}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono mt-1">
                                        {formatEventDates(e.startDate, e.endDate)}
                                        {where && ` · ${where}`} · {e.views} views
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <EventStatusToggle id={e.id} title={e.title} status={e.status} />
                                    <Link
                                        href={`/events/${e.slug}`}
                                        target="_blank"
                                        aria-label={`View ${e.title}`}
                                        className="text-muted-foreground hover:text-primary transition-colors p-1"
                                    >
                                        <Eye size={16} />
                                    </Link>
                                    <Link
                                        href={`/admin/events/${e.id}/edit`}
                                        aria-label={`Edit ${e.title}`}
                                        className="text-muted-foreground hover:text-primary transition-colors p-1"
                                    >
                                        <Pencil size={16} />
                                    </Link>
                                    <DeleteEventButton id={e.id} title={e.title} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
