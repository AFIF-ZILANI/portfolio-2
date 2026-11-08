"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ImageRef } from "@/lib/image-utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The event's photos as a grid; any photo opens a lightbox. Arrow keys step,
 * Escape closes, and focus returns to the thumbnail that opened it.
 */
export function EventGallery({ images, title }: { images: ImageRef[]; title: string }) {
    const [open, setOpen] = useState<number | null>(null);
    const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
    const closeBtn = useRef<HTMLButtonElement>(null);

    const close = useCallback(() => {
        setOpen((i) => {
            if (i !== null) thumbs.current[i]?.focus();
            return null;
        });
    }, []);
    const step = useCallback(
        (d: number) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)),
        [images.length]
    );

    useEffect(() => {
        if (open === null) return;
        closeBtn.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
        };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, close, step]);

    const current = open === null ? null : images[open];

    return (
        <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {images.map((image, i) => (
                    <motion.button
                        key={image.id}
                        ref={(el) => {
                            thumbs.current[i] = el;
                        }}
                        type="button"
                        onClick={() => setOpen(i)}
                        aria-label={`Open photo ${i + 1} of ${images.length}${image.alt ? `: ${image.alt}` : ""}`}
                        // Mosaic: with three or more photos the first leads, two columns
                        // wide and (from md) two rows tall, the next two stacked beside it
                        className={`group relative overflow-hidden rounded-2xl border border-border bg-muted ${
                            i === 0 && images.length >= 3
                                ? "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto"
                                : images.length === 1
                                  ? "col-span-2 aspect-video md:col-span-3"
                                  : "aspect-[4/3]"
                        }`}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.55, delay: (i % 3) * 0.07, ease: EASE }}
                    >
                        <Image
                            src={image.url}
                            alt={image.alt || title}
                            fill
                            loading="lazy"
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                    </motion.button>
                ))}
            </div>

            <AnimatePresence>
                {current && open !== null && (
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={`${title}, photo ${open + 1} of ${images.length}`}
                        className="fixed inset-0 z-[60] flex flex-col bg-[#0A0F1C]/95 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={close}
                    >
                        <div className="flex items-center justify-between px-5 py-4 text-sm text-white/70">
                            <span className="tabular-nums">
                                {open + 1} / {images.length}
                            </span>
                            <button
                                ref={closeBtn}
                                type="button"
                                onClick={close}
                                aria-label="Close"
                                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={current.id}
                                    className="absolute inset-4 md:inset-x-20"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.3, ease: EASE }}
                                >
                                    <Image
                                        src={current.url}
                                        alt={current.alt || title}
                                        fill
                                        sizes="100vw"
                                        className="object-contain"
                                    />
                                </motion.div>
                            </AnimatePresence>
                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => step(-1)}
                                        aria-label="Previous photo"
                                        className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => step(1)}
                                        aria-label="Next photo"
                                        className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>

                        <p className="min-h-14 px-5 py-4 text-center text-sm text-white/70">
                            {current.caption || current.alt}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
