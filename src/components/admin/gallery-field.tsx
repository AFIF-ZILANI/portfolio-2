"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImageUp, X, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImage, saveImageMeta } from "@/app/(clerk)/admin/actions";
import { runAction } from "@/components/admin/run-action";
import { MAX_EVENT_IMAGES, validateGallery } from "@/lib/events-utils";
import type { ImageRef } from "@/lib/image-utils";

type Props = {
    images: ImageRef[];
    onChange: (images: ImageRef[]) => void;
};

const labelClass = "font-mono text-xs uppercase tracking-wider text-muted-foreground";

/**
 * The ordered 1–10 image gallery for an event.
 *
 * Reordering is arrow buttons rather than drag-and-drop: drag needs a pointer, and
 * this is the one admin control most likely to be used on a phone right after an
 * event. Arrows also give keyboard users the same capability for free.
 *
 * Alt text is edited inline and saved straight to the image row, because alt
 * belongs to the image rather than to this event.
 */
export function GalleryField({ images, onChange }: Props) {
    const [pending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);
    const [announcement, setAnnouncement] = useState("");

    const full = images.length >= MAX_EVENT_IMAGES;
    const problem = validateGallery(images);

    function handleFiles(files: FileList | null) {
        if (!files || files.length === 0) return;

        const room = MAX_EVENT_IMAGES - images.length;
        const chosen = Array.from(files).slice(0, room);
        if (files.length > room) {
            toast.warning(
                `Only ${room} more image${room === 1 ? "" : "s"} fit — the rest were skipped.`
            );
        }

        startTransition(async () => {
            const added: ImageRef[] = [];
            for (const file of chosen) {
                const body = new FormData();
                body.append("file", file);
                const res = await runAction(() => uploadImage(body));
                if (!res.ok) {
                    toast.error(res.error);
                    break;
                }
                if (res.image) added.push(res.image);
            }
            if (added.length > 0) {
                onChange([...images, ...added]);
                toast.success(`${added.length} image${added.length === 1 ? "" : "s"} added`);
            }
        });
    }

    function move(from: number, to: number) {
        if (to < 0 || to >= images.length) return;
        const next = [...images];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        onChange(next);
        setAnnouncement(`Image moved to position ${to + 1} of ${next.length}`);
    }

    function remove(index: number) {
        onChange(images.filter((_, i) => i !== index));
        setAnnouncement(`Image ${index + 1} removed`);
    }

    function setAlt(index: number, alt: string) {
        const next = images.map((image, i) => (i === index ? { ...image, alt } : image));
        onChange(next);

        const image = images[index];
        if (!image.id) return;
        startTransition(async () => {
            await runAction(() => saveImageMeta(image.id, alt));
        });
    }

    return (
        <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
                <Label className={labelClass}>Gallery</Label>
                <span className="font-mono text-xs text-muted-foreground">
                    {images.length} / {MAX_EVENT_IMAGES}
                </span>
            </div>

            <p className="text-xs text-muted-foreground">
                The first image is the cover. Every image needs alt text before this event
                can be published.
            </p>

            {images.length > 0 && (
                <ul className="space-y-3">
                    {images.map((image, index) => (
                        <li
                            key={image.id || image.url}
                            className="border border-border p-3 flex gap-3"
                        >
                            <div className="relative w-24 h-24 shrink-0 border border-border bg-muted">
                                <Image
                                    src={image.url}
                                    alt=""
                                    fill
                                    sizes="96px"
                                    className="object-cover"
                                    unoptimized={!image.url.startsWith("http")}
                                />
                                {index === 0 && (
                                    <span
                                        className="absolute top-0 left-0 bg-primary text-primary-foreground p-0.5"
                                        title="Cover image"
                                    >
                                        <Star size={12} />
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 min-w-0 space-y-2">
                                <Input
                                    value={image.alt}
                                    onChange={(e) => setAlt(index, e.target.value)}
                                    placeholder={`Describe image ${index + 1}`}
                                    aria-label={`Alt text for image ${index + 1}`}
                                    aria-invalid={!image.alt.trim()}
                                    className="font-mono text-xs"
                                />
                                <div className="flex gap-1">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        disabled={index === 0}
                                        onClick={() => move(index, index - 1)}
                                        aria-label={`Move image ${index + 1} earlier`}
                                    >
                                        <ChevronLeft size={14} />
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        disabled={index === images.length - 1}
                                        onClick={() => move(index, index + 1)}
                                        aria-label={`Move image ${index + 1} later`}
                                    >
                                        <ChevronRight size={14} />
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => remove(index)}
                                        aria-label={`Remove image ${index + 1}`}
                                        className="ml-auto"
                                    >
                                        <X size={14} />
                                    </Button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                    handleFiles(e.target.files);
                    // Let the same file be picked again after a removal.
                    e.target.value = "";
                }}
            />

            <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={pending || full}
                onClick={() => inputRef.current?.click()}
                className="font-mono text-xs"
            >
                <ImageUp size={14} />
                {pending ? "uploading…" : full ? `max ${MAX_EVENT_IMAGES} reached` : "add images"}
            </Button>

            {problem && <p className="font-mono text-xs text-destructive">{problem}</p>}

            {/* Reordering and removal are visual changes; announce them for screen readers. */}
            <p aria-live="polite" className="sr-only">
                {announcement}
            </p>
        </div>
    );
}
