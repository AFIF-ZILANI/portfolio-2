"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/layout/section-heading";
import type { Skill } from "@/lib/site-data";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Skills as broad capabilities, one card per category (Business, Technology),
 * rather than a wall of tool logos. Edited at /admin/site/skills; the icon field
 * is ignored here.
 */
export function Skills({ skills }: { skills: Skill[] }) {
    const categories = Array.from(new Set(skills.map((s) => s.category)));

    return (
        <section id="skills" className="py-24 md:py-32 border-t border-border">
            <div className="container mx-auto px-6 max-w-6xl">
                <SectionHeading eyebrow="What I do" title="Skills" />

                <div className="grid gap-4 md:grid-cols-2">
                    {categories.map((cat, n) => (
                        <motion.div
                            key={cat}
                            className="rounded-3xl border border-border bg-card p-7 md:p-9"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.6, delay: n * 0.1, ease: EASE }}
                        >
                            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
                                {cat}
                            </h3>
                            <ul className="mt-6 divide-y divide-border">
                                {skills
                                    .filter((s) => s.category === cat)
                                    .map((s) => (
                                        <li
                                            key={s.id}
                                            className="flex items-center gap-3 py-3.5 text-lg font-semibold tracking-[-0.01em] text-foreground"
                                        >
                                            <span
                                                aria-hidden
                                                className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                                            />
                                            {s.name}
                                        </li>
                                    ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
