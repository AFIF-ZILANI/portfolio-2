"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImageUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImage, attachImageByUrl, saveImageMeta } from "@/app/(clerk)/admin/actions";
import { runAction } from "@/components/admin/run-action";
import type { ImageRef } from "@/lib/image-utils";

type Props = {
    label: string;
    hint?: string;
    value: ImageRef | null;
    onChange: (image: ImageRef | null) => void;
};

/**
 * Pick one image: upload to Cloudinary, or paste a URL.
 *
 * Carries the alt field with it. Alt lives on the image row, so writing it here
 * means every place that image appears describes it the same way — and it is
 * captured at the moment of choosing, which is the only time anyone remembers
 * what the picture actually shows.
 */
export function ImageField({ label, hint, value, onChange }: Props) {
    const [pending, startTransition] = useTransition();
    const [dirty, setDirty] = useState(false);
    const [urlDraft, setUrlDraft] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    function handleFile(file: File | undefined) {
        if (!file) return;
        const body = new FormData();
        body.append("file", file);
        startTransition(async () => {
            const res = await runAction(() => uploadImage(body));
            if (!res.ok) {
                toast.error(res.error);
                return;
            }
            onChange(res.image ?? null);
            setDirty((d) => !d);
            toast.success(`${label} uploaded`);
        });
    }

    function handleUrl(url: string) {
        const trimmed = url.trim();
        if (!trimmed) return;
        startTransition(async () => {
            const res = await runAction(() => attachImageByUrl(trimmed));
            if (!res.ok) {
                toast.error(res.error);
                return;
            }
            onChange(res.image ?? null);
            setUrlDraft("");
        });
    }

    /**
     * Alt is saved straight to the image row rather than held until the parent
     * form is submitted — the row already exists by this point, and a half-typed
     * alt lost to a navigation is how images end up undescribed.
     */
    function handleAlt(alt: string) {
        if (!value) return;
        onChange({ ...value, alt });
        if (!value.id) return; // a static fallback has no row to update
        startTransition(async () => {
            await runAction(() => saveImageMeta(value.id, alt));
        });
    }

    return (
        <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {label}
            </Label>
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

            {value ? (
                <div className="relative aspect-video w-full border border-border">
                    <Image
                        key={`${value.url}-${dirty}`}
                        src={value.url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="320px"
                        unoptimized={!value.url.startsWith("http")}
                    />
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        aria-label={`Remove ${label}`}
                        className="absolute top-1 right-1 bg-background/90 border border-border p-1 hover:border-primary"
                    >
                        <X size={14} />
                    </button>
                </div>
            ) : (
                <div className="aspect-video w-full border border-dashed border-border grid place-items-center text-muted-foreground text-xs">
                    no image
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <div className="flex gap-2">
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={pending}
                    onClick={() => inputRef.current?.click()}
                    className="font-mono text-xs"
                >
                    <ImageUp size={14} />
                    {pending ? "uploading…" : "upload"}
                </Button>
            </div>

            {value ? (
                <Input
                    value={value.alt}
                    onChange={(e) => handleAlt(e.target.value)}
                    placeholder="Describe this image (alt text)"
                    className="font-mono text-xs"
                />
            ) : (
                <Input
                    value={urlDraft}
                    onChange={(e) => setUrlDraft(e.target.value)}
                    onBlur={(e) => handleUrl(e.target.value)}
                    placeholder="…or paste an image URL"
                    className="font-mono text-xs"
                />
            )}
        </div>
    );
}
