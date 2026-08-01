"use client";

import { useMemo, useState, useTransition } from "react";
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
import { ImageField } from "@/components/admin/image-field";
import { savePost, upsertSeries, type PostInput } from "@/app/(clerk)/admin/actions";
import type { ImageRef } from "@/lib/image-utils";
import { readingMinutes, slugify } from "@/lib/blog-utils";
import { runAction } from "@/components/admin/run-action";

export type SeriesOption = { id: string; title: string };

const NO_SERIES = "__none__";

/** `datetime-local` needs `YYYY-MM-DDTHH:mm` in *local* time, not an ISO UTC string. */
function toLocalInput(date: Date | null): string {
    if (!date) return "";
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

const labelClass = "font-mono text-xs uppercase tracking-wider text-muted-foreground";

/** Red asterisk marking a field the server will reject if left blank. */
const Req = () => <span className="text-destructive ml-1">*</span>;

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-xs text-destructive font-mono">{message}</p>;
}

export function PostEditor({
    post,
    series,
}: {
    /**
     * Images arrive resolved so the editor can show them; only their ids are sent
     * back. Alt text is not here at all — it belongs to the image row, and
     * ImageField saves it directly.
     */
    post?: Omit<PostInput, "coverImageId" | "ogImageId"> & {
        id: string;
        publishedAtDate: Date | null;
        coverImage: ImageRef | null;
        ogImage: ImageRef | null;
    };
    series: SeriesOption[];
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [tab, setTab] = useState<"write" | "preview">("write");

    const [title, setTitle] = useState(post?.title ?? "");
    const [slug, setSlug] = useState(post?.slug ?? "");
    const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
    const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
    const [content, setContent] = useState(post?.content ?? "");
    const [coverImage, setCoverImage] = useState<ImageRef | null>(post?.coverImage ?? null);
    const [ogImage, setOgImage] = useState<ImageRef | null>(post?.ogImage ?? null);
    const [tags, setTags] = useState((post?.tags ?? []).join(", "));
    const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(post?.status ?? "DRAFT");
    // New posts default to right now, so publishing is one click. Editing keeps
    // whatever date the post already had.
    const [publishedAt, setPublishedAt] = useState(
        toLocalInput(post ? post.publishedAtDate : new Date())
    );
    const [seriesId, setSeriesId] = useState(post?.seriesId ?? "");
    const [seriesOrder, setSeriesOrder] = useState(post?.seriesOrder?.toString() ?? "");
    const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? "");
    const [seoDescription, setSeoDescription] = useState(post?.seoDescription ?? "");
    const [canonicalUrl, setCanonicalUrl] = useState(post?.canonicalUrl ?? "");
    const [noindex, setNoindex] = useState(post?.noindex ?? false);

    const [seriesList, setSeriesList] = useState(series);
    const [newSeries, setNewSeries] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    // generateMetadata already falls back to the cover when ogImage is null, so
    // "same as cover" is simply ogImage = null — no extra column needed.
    const [ogSameAsCover, setOgSameAsCover] = useState(!post?.ogImage);

    const effectiveSlug = slugTouched ? slugify(slug) : slugify(title);
    const minutes = useMemo(() => readingMinutes(content), [content]);
    const scheduled =
        status === "PUBLISHED" && publishedAt && new Date(publishedAt).getTime() > Date.now();

    function addSeries() {
        const name = newSeries.trim();
        if (!name) return;
        startTransition(async () => {
            const res = await runAction(() => upsertSeries({ title: name }));
            if (!res.ok) {
                toast.error(res.error);
                return;
            }
            setSeriesList((s) => [...s, { id: res.id, title: res.title }]);
            setSeriesId(res.id);
            setNewSeries("");
            toast.success(`Series "${res.title}" created and selected`);
        });
    }

    /**
     * Check required fields here as well as on the server, so the message lands
     * next to the offending field instead of only in a toast.
     */
    function validate(): Record<string, string> {
        const next: Record<string, string> = {};
        if (!title.trim()) next.title = "Required.";
        if (!effectiveSlug) next.slug = "Could not build a slug — add letters or numbers.";
        if (!excerpt.trim()) next.excerpt = "Required — it's the card blurb and meta description.";
        if (!content.trim()) next.content = "Required — write something.";
        return next;
    }

    function submit() {
        const found = validate();
        setErrors(found);
        if (Object.keys(found).length > 0) {
            toast.error(`Can't save — ${Object.keys(found).length} field(s) need attention.`);
            return;
        }

        startTransition(async () => {
            const res = await runAction(() =>
                savePost({
                    id: post?.id,
                    title,
                    slug: effectiveSlug,
                    excerpt,
                    content,
                    coverImageId: coverImage?.id ?? null,
                    ogImageId: ogSameAsCover ? null : (ogImage?.id ?? null),
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
                    seriesId: seriesId || null,
                    seriesOrder: seriesOrder ? Number(seriesOrder) : null,
                })
            );

            if (!res.ok) {
                toast.error(res.error);
                return;
            }
            toast.success(post ? "Post updated" : "Post created");
            router.push("/admin/blogs");
            router.refresh();
        });
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <h1 className="text-2xl font-bold font-mono">
                    <span className="text-primary">$</span> {post ? "edit" : "new"}_post
                </h1>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground">
                        {minutes} min read
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
                            placeholder="How I shipped a blog in one afternoon"
                            aria-invalid={Boolean(errors.title)}
                            className={`text-lg ${errors.title ? "border-destructive" : ""}`}
                        />
                        <FieldError message={errors.title} />
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClass}>Slug</Label>
                        <Input
                            value={slugTouched ? slug : effectiveSlug}
                            onChange={(e) => {
                                setSlugTouched(true);
                                setSlug(e.target.value);
                            }}
                            className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground font-mono">
                            /blogs/{effectiveSlug || "…"}
                        </p>
                        <FieldError message={errors.slug} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <Label className={labelClass}>
                                Excerpt
                                <Req />
                                <span className="normal-case tracking-normal ml-1">
                                    (card blurb + meta description fallback)
                                </span>
                            </Label>
                            <span
                                className={`text-xs font-mono ${
                                    excerpt.length > 160 && !seoDescription
                                        ? "text-destructive"
                                        : "text-muted-foreground"
                                }`}
                                title="Search engines truncate descriptions past ~160 characters"
                            >
                                {excerpt.length}/160
                            </span>
                        </div>
                        <Textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            rows={2}
                            aria-invalid={Boolean(errors.excerpt)}
                            className={errors.excerpt ? "border-destructive" : ""}
                        />
                        <FieldError message={errors.excerpt} />
                    </div>

                    <div
                        className={`border ${errors.content ? "border-destructive" : "border-border"}`}
                    >
                        <div className="flex border-b border-border items-center">
                            <span className={`${labelClass} pl-3 pr-1`}>
                                Body
                                <Req />
                            </span>
                            {(["write", "preview"] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setTab(t)}
                                    className={`px-4 py-2 font-mono text-xs flex items-center gap-2 transition-colors ${
                                        tab === t
                                            ? "text-primary border-b-2 border-primary -mb-px"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {t === "write" ? <Pencil size={13} /> : <Eye size={13} />}
                                    {t}
                                </button>
                            ))}
                        </div>
                        {tab === "write" ? (
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={28}
                                placeholder={"## Heading\n\nWrite markdown here. ```ts fenced code``` works."}
                                className="border-0 rounded-none font-mono text-sm resize-y focus-visible:ring-0"
                            />
                        ) : (
                            <div className="p-6 min-h-[400px]">
                                {content.trim() ? (
                                    <Markdown>{content}</Markdown>
                                ) : (
                                    <p className="text-muted-foreground text-sm font-mono">
                                        nothing to preview yet
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    <FieldError message={errors.content} />
                </div>

                {/* ---- sidebar ---- */}
                <aside className="space-y-6 lg:sticky lg:top-24">
                    <section className="border border-border p-4 space-y-4">
                        <div className="space-y-2">
                            <Label className={labelClass}>Status</Label>
                            <Select
                                value={status}
                                onValueChange={(v) => setStatus(v as "DRAFT" | "PUBLISHED")}
                            >
                                <SelectTrigger className="font-mono text-sm w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className={labelClass}>Publish date</Label>
                            <Input
                                type="datetime-local"
                                value={publishedAt}
                                onChange={(e) => setPublishedAt(e.target.value)}
                                className="font-mono text-xs"
                            />
                            <p className="text-xs text-muted-foreground">
                                {scheduled
                                    ? "Future date — goes live automatically."
                                    : "Leave empty to publish immediately."}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label className={labelClass}>Tags</Label>
                            <Input
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="nextjs, prisma, seo"
                                className="font-mono text-xs"
                            />
                        </div>
                    </section>

                    <section className="border border-border p-4 space-y-4">
                        <p className={labelClass}>Series</p>
                        <Select
                            value={seriesId || NO_SERIES}
                            onValueChange={(v) => setSeriesId(v === NO_SERIES ? "" : v)}
                        >
                            <SelectTrigger className="font-mono text-sm w-full">
                                <SelectValue placeholder="None" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={NO_SERIES}>None</SelectItem>
                                {seriesList.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {seriesId && (
                            <div className="space-y-2">
                                <Label className={labelClass}>Part number</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={seriesOrder}
                                    onChange={(e) => setSeriesOrder(e.target.value)}
                                    className="font-mono text-xs"
                                />
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Input
                                value={newSeries}
                                onChange={(e) => setNewSeries(e.target.value)}
                                placeholder="new series name"
                                className="font-mono text-xs"
                            />
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={addSeries}
                                disabled={pending || !newSeries.trim()}
                            >
                                add
                            </Button>
                        </div>
                    </section>

                    <section className="border border-border p-4 space-y-4">
                        <ImageField
                            label="Cover image"
                            value={coverImage}
                            onChange={setCoverImage}
                        />
                        <div className="pt-2 border-t border-border space-y-3">
                            <div className="flex items-center justify-between gap-3">
                                <Label className={labelClass}>Use cover as OG image</Label>
                                <Switch
                                    checked={ogSameAsCover}
                                    onCheckedChange={setOgSameAsCover}
                                />
                            </div>
                            {ogSameAsCover ? (
                                <p className="text-xs text-muted-foreground">
                                    Social shares will use the cover image.
                                </p>
                            ) : (
                                <ImageField
                                    label="OG image"
                                    hint="Shown on social shares instead of the cover."
                                    value={ogImage}
                                    onChange={setOgImage}
                                />
                            )}
                        </div>
                    </section>

                    <section className="border border-border p-4 space-y-4">
                        <p className={labelClass}>SEO</p>

                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <Label className={labelClass}>Meta title</Label>
                                <span
                                    className={`text-xs font-mono ${seoTitle.length > 60 ? "text-destructive" : "text-muted-foreground"}`}
                                >
                                    {seoTitle.length}/60
                                </span>
                            </div>
                            <Input
                                value={seoTitle}
                                onChange={(e) => setSeoTitle(e.target.value)}
                                placeholder={title || "Defaults to the post title"}
                                className="text-xs"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <Label className={labelClass}>Meta description</Label>
                                <span
                                    className={`text-xs font-mono ${seoDescription.length > 160 ? "text-destructive" : "text-muted-foreground"}`}
                                >
                                    {seoDescription.length}/160
                                </span>
                            </div>
                            <Textarea
                                value={seoDescription}
                                onChange={(e) => setSeoDescription(e.target.value)}
                                rows={3}
                                placeholder="Defaults to the excerpt"
                                className="text-xs"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className={labelClass}>Canonical URL</Label>
                            <Input
                                value={canonicalUrl}
                                onChange={(e) => setCanonicalUrl(e.target.value)}
                                placeholder="Only if cross-posted"
                                className="font-mono text-xs"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label className={labelClass}>noindex</Label>
                            <Switch checked={noindex} onCheckedChange={setNoindex} />
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
