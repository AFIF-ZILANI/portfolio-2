"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, Pencil, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Markdown } from "@/components/blog/markdown";
import { GalleryField } from "@/components/admin/gallery-field";
import { saveEvent, type EventInput } from "@/app/(clerk)/admin/event-actions";
import { runAction } from "@/components/admin/run-action";
import { slugify } from "@/lib/blog-utils";
import { validateGallery } from "@/lib/events-utils";
import type { ImageRef } from "@/lib/image-utils";

/** `datetime-local` needs `YYYY-MM-DDTHH:mm` in *local* time, not an ISO UTC string. */
function toLocalInput(date: Date | null): string {
    if (!date) return "";
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

const labelClass = "font-mono text-xs uppercase tracking-wider text-muted-foreground";
const Req = () => <span className="text-destructive ml-1">*</span>;

/** Parses a coordinate input, treating blank as "not set" rather than 0. */
function parseCoord(value: string): number | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
}

export function EventEditor({
    event,
}: {
    event?: Omit<EventInput, "imageIds"> & {
        id: string;
        startDateValue: Date;
        endDateValue: Date | null;
        publishedAtDate: Date | null;
        images: ImageRef[];
    };
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [preview, setPreview] = useState(false);

    const [title, setTitle] = useState(event?.title ?? "");
    const [slug, setSlug] = useState(event?.slug ?? "");
    const [excerpt, setExcerpt] = useState(event?.excerpt ?? "");
    const [content, setContent] = useState(event?.content ?? "");
    const [images, setImages] = useState<ImageRef[]>(event?.images ?? []);

    const [startDate, setStartDate] = useState(toLocalInput(event?.startDateValue ?? null));
    const [endDate, setEndDate] = useState(toLocalInput(event?.endDateValue ?? null));

    const [venueName, setVenueName] = useState(event?.venueName ?? "");
    const [streetAddress, setStreetAddress] = useState(event?.streetAddress ?? "");
    const [city, setCity] = useState(event?.city ?? "");
    const [region, setRegion] = useState(event?.region ?? "");
    const [country, setCountry] = useState(event?.country ?? "BD");
    const [latitude, setLatitude] = useState(event?.latitude?.toString() ?? "");
    const [longitude, setLongitude] = useState(event?.longitude?.toString() ?? "");

    const [organizer, setOrganizer] = useState(event?.organizer ?? "");
    const [role, setRole] = useState(event?.role ?? "Attendee");
    const [tags, setTags] = useState((event?.tags ?? []).join(", "));

    const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(event?.status ?? "DRAFT");
    const [publishedAt, setPublishedAt] = useState(toLocalInput(event?.publishedAtDate ?? null));
    const [seoTitle, setSeoTitle] = useState(event?.seoTitle ?? "");
    const [seoDescription, setSeoDescription] = useState(event?.seoDescription ?? "");
    const [canonicalUrl, setCanonicalUrl] = useState(event?.canonicalUrl ?? "");
    const [noindex, setNoindex] = useState(event?.noindex ?? false);

    const galleryProblem = validateGallery(images);
    const scheduled = status === "PUBLISHED" && publishedAt && new Date(publishedAt) > new Date();

    function submit() {
        startTransition(async () => {
            const res = await runAction(() =>
                saveEvent({
                    ...(event?.id ? { id: event.id } : {}),
                    title,
                    slug: slug || slugify(title),
                    excerpt,
                    content,
                    imageIds: images.map((i) => i.id),
                    startDate: startDate ? new Date(startDate).toISOString() : "",
                    endDate: endDate ? new Date(endDate).toISOString() : null,
                    venueName: venueName || null,
                    streetAddress: streetAddress || null,
                    city: city || null,
                    region: region || null,
                    country: country || "BD",
                    latitude: parseCoord(latitude),
                    longitude: parseCoord(longitude),
                    organizer: organizer || null,
                    role: role || null,
                    tags: tags
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    status,
                    publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
                    seoTitle: seoTitle || null,
                    seoDescription: seoDescription || null,
                    canonicalUrl: canonicalUrl || null,
                    noindex,
                })
            );

            if (!res.ok) {
                toast.error(res.error);
                return;
            }
            toast.success(event ? "Event updated" : "Event created");
            router.push("/admin/events");
            router.refresh();
        });
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <h1 className="text-2xl font-bold font-mono">
                    <span className="text-primary">$</span> {event ? "edit" : "new"}_event
                </h1>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground">
                        {images.length} image{images.length === 1 ? "" : "s"}
                        {scheduled && " · scheduled"}
                    </span>
                    <Button onClick={submit} disabled={pending} className="font-mono">
                        <Save size={16} />
                        {pending ? "saving…" : "save"}
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
                {/* ---- main column ---- */}
                <div className="space-y-4 min-w-0">
                    <div className="space-y-2">
                        <Label className={labelClass}>
                            Title
                            <Req />
                        </Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="DevFest Dhaka 2026"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClass}>Slug</Label>
                        <Input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder={slugify(title) || "derived-from-title"}
                            className="font-mono text-xs"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClass}>
                            Excerpt
                            <Req />
                        </Label>
                        <Textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            rows={2}
                            placeholder="One or two lines — this is the card blurb and the meta description."
                        />
                        <p className="font-mono text-xs text-muted-foreground">
                            {excerpt.length}/160 recommended for the meta description
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className={labelClass}>
                                What happened
                                <Req />
                            </Label>
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => setPreview((p) => !p)}
                                className="font-mono text-xs"
                            >
                                {preview ? <Pencil size={14} /> : <Eye size={14} />}
                                {preview ? "edit" : "preview"}
                            </Button>
                        </div>
                        {preview ? (
                            <div className="border border-border p-4 min-h-64">
                                <Markdown>{content}</Markdown>
                            </div>
                        ) : (
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={18}
                                placeholder="Markdown. What the event was, what you took away from it."
                                className="font-mono text-sm"
                            />
                        )}
                    </div>

                    <section className="border border-border p-4">
                        <GalleryField images={images} onChange={setImages} />
                    </section>
                </div>

                {/* ---- sidebar ---- */}
                <div className="space-y-4">
                    <section className="border border-border p-4 space-y-4">
                        <div className="space-y-2">
                            <Label className={labelClass}>
                                Started
                                <Req />
                            </Label>
                            <Input
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="font-mono text-xs"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className={labelClass}>Ended</Label>
                            <Input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="font-mono text-xs"
                            />
                            <p className="text-xs text-muted-foreground">
                                Leave blank for a single-day event.
                            </p>
                        </div>
                    </section>

                    <section className="border border-border p-4 space-y-4">
                        <p className={labelClass}>Where</p>
                        <p className="text-xs text-muted-foreground">
                            Feeds the Place and GeoCoordinates in the event schema — this is
                            what makes it a local search signal.
                        </p>
                        <Input
                            value={venueName}
                            onChange={(e) => setVenueName(e.target.value)}
                            placeholder="Venue name"
                            className="text-xs"
                        />
                        <Input
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                            placeholder="Street address"
                            className="text-xs"
                        />
                        <Input
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                            className="text-xs"
                        />
                        <Input
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            placeholder="Region / division"
                            className="text-xs"
                        />
                        <Input
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Country code (BD)"
                            className="font-mono text-xs"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                placeholder="Latitude"
                                inputMode="decimal"
                                className="font-mono text-xs"
                            />
                            <Input
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                placeholder="Longitude"
                                inputMode="decimal"
                                className="font-mono text-xs"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Both coordinates or neither — a half-set pair is rejected.
                        </p>
                    </section>

                    <section className="border border-border p-4 space-y-4">
                        <div className="space-y-2">
                            <Label className={labelClass}>Organizer</Label>
                            <Input
                                value={organizer}
                                onChange={(e) => setOrganizer(e.target.value)}
                                placeholder="Google Developer Groups"
                                className="text-xs"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className={labelClass}>Your role</Label>
                            <Input
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="Attendee / Speaker / Volunteer"
                                className="text-xs"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className={labelClass}>Tags</Label>
                            <Input
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="comma, separated"
                                className="font-mono text-xs"
                            />
                        </div>
                    </section>

                    <section className="border border-border p-4 space-y-4">
                        <div className="space-y-2">
                            <Label className={labelClass}>Status</Label>
                            <Select
                                value={status}
                                onValueChange={(v) => setStatus(v as "DRAFT" | "PUBLISHED")}
                            >
                                <SelectTrigger className="font-mono text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                </SelectContent>
                            </Select>
                            {galleryProblem && status === "PUBLISHED" && (
                                <p className="font-mono text-xs text-destructive">
                                    {galleryProblem}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label className={labelClass}>Publish at</Label>
                            <Input
                                type="datetime-local"
                                value={publishedAt}
                                onChange={(e) => setPublishedAt(e.target.value)}
                                className="font-mono text-xs"
                            />
                            <p className="text-xs text-muted-foreground">
                                A future date schedules it. Blank means now.
                            </p>
                        </div>
                    </section>

                    <section className="border border-border p-4 space-y-4">
                        <p className={labelClass}>SEO</p>
                        <Input
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            placeholder="SEO title (defaults to the title)"
                            className="text-xs"
                        />
                        <Textarea
                            value={seoDescription}
                            onChange={(e) => setSeoDescription(e.target.value)}
                            rows={2}
                            placeholder="SEO description (defaults to the excerpt)"
                            className="text-xs"
                        />
                        <Input
                            value={canonicalUrl}
                            onChange={(e) => setCanonicalUrl(e.target.value)}
                            placeholder="Canonical URL (if published elsewhere first)"
                            className="font-mono text-xs"
                        />
                        <div className="flex items-center justify-between gap-3">
                            <Label className={labelClass}>Hide from search</Label>
                            <Switch checked={noindex} onCheckedChange={setNoindex} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
