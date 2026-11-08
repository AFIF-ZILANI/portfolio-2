"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { FarmStage } from "@/components/stageshow/farm-stage";
import type { Experience } from "@/lib/site-data";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The ZeroD group: what Afif runs, in place of a projects grid. Each card is one
 * company with its role and a link out to its own site; the stage above shows the
 * farm's tracker, the venture with the most going on day to day.
 */
export function Ventures({ experiences }: { experiences: Experience[] }) {
    return (
        <section id="ventures" className="py-24 md:py-32">
            <div className="container mx-auto px-6 max-w-6xl">
                <SectionHeading eyebrow="Ventures" title="One group, three companies." />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.9, ease: EASE }}
                >
                    <FarmStage />
                </motion.div>

                <ol className="mt-6 grid md:grid-cols-3 gap-4">
                    {experiences.map((v, i) => (
                        <motion.li
                            key={v.id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                        >
                            <VentureCard venture={v} index={i} />
                        </motion.li>
                    ))}
                </ol>
            </div>
        </section>
    );
}

function VentureCard({ venture: v, index }: { venture: Experience; index: number }) {
    const host = v.url ? v.url.replace(/^https?:\/\//, "").replace(/\/$/, "") : "";
    const body = (
        <>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <span>0{index + 1}</span>
                <span>{v.period}</span>
            </div>
            <h3 className="mt-8 text-3xl font-bold leading-[1.05] tracking-[-0.03em]">
                {v.company}
            </h3>
            <p className="mt-3 text-sm font-semibold text-gold-ink">{v.role}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
            {host && (
                <span className="mt-auto pt-8">
                    <span className="flex items-center justify-between border-t border-border pt-4 font-mono text-xs">
                        {host}
                        <span className="grid h-8 w-8 place-items-center rounded-full border border-border transition-all duration-300 group-hover:bg-foreground group-hover:text-background group-hover:rotate-45">
                            <ArrowUpRight size={14} />
                        </span>
                    </span>
                </span>
            )}
        </>
    );

    const cls =
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_10px_30px_-12px_rgb(20_33_61/0.18)]";

    return v.url ? (
        <a href={v.url} target="_blank" rel="noopener" className={cls}>
            {body}
        </a>
    ) : (
        <div className={cls}>{body}</div>
    );
}
