"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * The heading for a public section: a small gold eyebrow, then a bold title whose
 * words rise into place the first time it scrolls into view.
 *
 * The hairline runs from the eyebrow to the right edge so the label sits in the
 * page's structure rather than floating above it; `action` (e.g. "all posts →")
 * ends that line.
 */
export function SectionHeading({
    eyebrow,
    title,
    action,
}: {
    eyebrow: string;
    title: string;
    action?: ReactNode;
}) {
    const words = title.split(" ");
    return (
        <div className="mb-12 md:mb-16">
            <div className="flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink shrink-0">
                    {eyebrow}
                </span>
                <motion.span
                    aria-hidden
                    className="h-px flex-1 bg-border origin-left"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
                {action}
            </div>
            <h2 className="mt-5 font-bold text-4xl md:text-[3.5rem] leading-[1.08] tracking-[-0.03em] text-foreground">
                {words.map((w, i) => (
                    <span key={i} className="inline-block overflow-hidden pb-1 -mb-1 align-bottom">
                        <motion.span
                            className="inline-block"
                            initial={{ y: "105%" }}
                            whileInView={{ y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.7,
                                delay: i * 0.06,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            {w}
                            {i < words.length - 1 ? " " : ""}
                        </motion.span>
                    </span>
                ))}
            </h2>
        </div>
    );
}
