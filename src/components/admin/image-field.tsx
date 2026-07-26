"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImageUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImage } from "@/app/(clerk)/admin/actions";
import { runAction } from "@/components/admin/run-action";

type Props = {
    label: string;
    hint?: string;
    value: string | null;
    onChange: (url: string | null) => void;
};

/** Upload to Cloudinary, or paste a URL directly. Used for both cover and OG images. */
export function ImageField({ label, hint, value, onChange }: Props) {
    const [pending, startTransition] = useTransition();
    const [dirty, setDirty] = useState(false);
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
            onChange(res.url ?? null);
            setDirty((d) => !d);
            toast.success(`${label} uploaded`);
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
                        key={`${value}-${dirty}`}
                        src={value}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="320px"
                        unoptimized={!value.startsWith("http")}
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
            <Input
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || null)}
                placeholder="…or paste an image URL"
                className="font-mono text-xs"
            />
        </div>
    );
}
