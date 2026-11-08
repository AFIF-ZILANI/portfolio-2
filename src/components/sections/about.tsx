"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ResolvedSiteData } from "@/lib/site-data";

const EASE = [0.22, 1, 0.36, 1] as const;

/** The four links worth a reader's click; the full set is in the schema and footer. */
const LINK_ICONS = ["linkedin", "github", "twitter", "email"] as const;
const LINK_NAMES: Record<string, string> = {
    linkedin: "LinkedIn",
    github: "GitHub",
    twitter: "X",
    email: "Email",
};

/**
 * About, led by the first line of the bio set large instead of a slogan, then
 * the rest of the story beside a dated timeline built from the experiences.
 */
export function About({ data }: { data: ResolvedSiteData }) {
    // Older records store the bio as short wrapped lines (it was a terminal);
    // newer ones as paragraphs. Join short lines so both read as prose.
    const paragraphs = data.bio.every((l) => l.length < 70) ? [data.bio.join(" ")] : data.bio;
    const [statement, ...rest] = paragraphs;

    const timeline = data.experiences
        .map((e) => ({ ...e, year: Number(e.period.match(/\d{4}/)?.[0] ?? 0) }))
        .sort((a, b) => a.year - b.year);

    const links = LINK_ICONS.map((icon) => data.socialLinks.find((l) => l.icon === icon)).filter(
        (l): l is NonNullable<typeof l> => Boolean(l?.href)
    );

    return (
        <section
            id="about"
            aria-labelledby="about-title"
            className="border-t border-border py-24 md:py-32"
        >
            <div className="container mx-auto max-w-6xl px-6">
                <div className="flex items-center gap-4">
                    <h2
                        id="about-title"
                        className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink"
                    >
                        About
                    </h2>
                    <motion.span
                        aria-hidden
                        className="h-px flex-1 origin-left bg-border"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: EASE }}
                    />
                </div>

                <motion.p
                    className="mt-8 max-w-4xl text-3xl font-bold leading-[1.2] tracking-[-0.03em] text-balance text-foreground md:text-[2.75rem]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.8, ease: EASE }}
                >
                    {statement}
                </motion.p>

                <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-12">
                    <motion.div
                        className="md:col-span-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
                    >
                        <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-border bg-card">
                            <Image
                                src={data.aboutImage.url}
                                alt={data.aboutImage.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, 360px"
                                className="object-cover"
                                data-testid="img-profile-about"
                            />
                        </div>
                    </motion.div>

                    <div className="grid content-start gap-12 md:col-span-8">
                        {rest.length > 0 && (
                            <div className="grid gap-6 text-lg leading-relaxed text-muted-foreground sm:grid-cols-2">
                                {rest.map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        )}

                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                Timeline
                            </h3>
                            <ol className="mt-4 divide-y divide-border border-y border-border">
                                {timeline.map((e, i) => (
                                    <motion.li
                                        key={e.id}
                                        className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-4 py-4 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto]"
                                        initial={{ opacity: 0, x: -12 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.1 + i * 0.1,
                                            ease: EASE,
                                        }}
                                    >
                                        <span className="text-lg font-extrabold tabular-nums tracking-[-0.02em] text-foreground">
                                            {e.year || "—"}
                                        </span>
                                        <span className="text-lg font-semibold text-foreground">
                                            {e.company}
                                        </span>
                                        <span className="col-start-2 text-sm text-muted-foreground sm:col-start-auto">
                                            {e.role}
                                        </span>
                                    </motion.li>
                                ))}
                            </ol>
                        </div>

                        {links.length > 0 && (
                            <p className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                                <span className="text-muted-foreground">Elsewhere</span>
                                {links.map((l) => (
                                    <a
                                        key={l.id}
                                        href={l.href}
                                        target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                                        rel={
                                            l.href.startsWith("mailto:")
                                                ? undefined
                                                : "noopener noreferrer"
                                        }
                                        className="font-semibold text-foreground underline decoration-gold decoration-2 underline-offset-[6px] transition-colors hover:text-gold-ink"
                                        data-testid={`link-about-${l.icon}`}
                                    >
                                        {LINK_NAMES[l.icon]}
                                    </a>
                                ))}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
