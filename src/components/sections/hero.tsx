"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, MapPin } from "lucide-react";
import type { ResolvedSiteData } from "@/lib/site-data";
import { CountUp } from "@/components/count-up";

const EASE = [0.22, 1, 0.36, 1] as const;

/** The ventures orbiting the portrait. Fixed: these are the group's real domains. */
const VENTURES = [
    { label: "zerod.bd", href: "https://zerod.bd", pos: "-left-6 top-10 md:-left-16", bob: 0 },
    {
        label: "farms.zerod.bd",
        href: "https://farms.zerod.bd",
        pos: "-right-4 top-[46%] md:-right-14",
        bob: 0.8,
    },
    {
        label: "agency.zerod.bd",
        href: "https://agency.zerod.bd",
        // Kept clear of the name plate along the photo's foot
        pos: "-left-6 top-[62%] md:-left-16",
        bob: 1.6,
    },
];

export function Hero({ data }: { data: ResolvedSiteData }) {
    const reduce = useReducedMotion();
    const roles = data.title
        .split("·")
        .map((r) => r.trim().replace(/\.$/, ""))
        .filter(Boolean);
    const [i, setI] = useState(0);

    useEffect(() => {
        if (roles.length < 2 || reduce) return;
        const t = setInterval(() => setI((n) => (n + 1) % roles.length), 3000);
        return () => clearInterval(t);
    }, [roles.length, reduce]);

    // Stored as "AFIF ZILANI"; at display size title case reads better.
    const [first, ...rest] = data.name
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

    return (
        <section
            id="hero"
            className="relative min-h-svh flex flex-col justify-center overflow-hidden pt-28 pb-10"
        >
            {/* Ground: a fine grid fading out from the center, and one slow glow */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800f_1px,transparent_1px),linear-gradient(to_bottom,#8080800f_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_70%_60%_at_50%_40%,#000_40%,transparent_100%)]" />
            <motion.div
                aria-hidden
                className="absolute -z-10 top-[-10%] right-[-10%] h-152 w-152 rounded-full bg-primary/10 blur-[120px]"
                animate={
                    reduce ? undefined : { x: [0, -60, 0], y: [0, 40, 0], scale: [1, 1.08, 1] }
                }
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="container mx-auto px-6 max-w-6xl">
                <div className="grid lg:grid-cols-[1.25fr_1fr] gap-16 lg:gap-10 items-center">
                    <div>
                        <motion.p
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-3 py-1.5 text-xs text-muted-foreground"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: EASE }}
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                            </span>
                            <MapPin size={12} className="-ml-0.5" />
                            Naogaon, Bangladesh
                        </motion.p>

                        <h1 className="mt-7 font-extrabold text-[clamp(3.75rem,14vw,6.5rem)] leading-[0.95] tracking-[-0.05em] text-foreground">
                            <span className="sr-only">
                                {data.name} — {roles.join(", ")}
                            </span>
                            <span aria-hidden>
                                <Word text={first} delay={0.1} />{" "}
                                <span className="relative inline-block">
                                    <Word text={rest.join(" ")} delay={0.22} />
                                    {/* The one gold flourish: drawn under the surname once the name lands */}
                                    <motion.span
                                        className="absolute inset-x-0 bottom-[0.04em] h-[0.09em] origin-left rounded-full bg-gold"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 0.75, duration: 0.8, ease: EASE }}
                                    />
                                </span>
                            </span>
                        </h1>

                        {/* The roles roll through one line, each one leaving upward */}
                        <motion.div
                            aria-hidden
                            className="mt-8 flex items-center gap-2 text-xl md:text-2xl leading-[1.4]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            <span className="text-muted-foreground shrink-0">I&apos;m</span>
                            {/* The article rolls with its role, so it never changes under the old one */}
                            <span className="relative h-[1.4em] overflow-hidden flex-1">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    <motion.span
                                        key={roles[i]}
                                        className="absolute left-0 top-0 whitespace-nowrap text-foreground"
                                        initial={{ y: "110%", opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: "-110%", opacity: 0 }}
                                        transition={{ duration: 0.55, ease: EASE }}
                                    >
                                        <span className="text-muted-foreground">
                                            {/^[AEIOU]/i.test(roles[i] ?? "") ? "an" : "a"}{" "}
                                        </span>
                                        <span className="font-bold">{roles[i]}</span>
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                        </motion.div>

                        <motion.p
                            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.7, ease: EASE }}
                        >
                            {data.tagline}
                        </motion.p>

                        <motion.div
                            className="mt-10 flex flex-wrap gap-3"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.05, duration: 0.7, ease: EASE }}
                        >
                            <a
                                href="#ventures"
                                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:brightness-125"
                                data-testid="button-hero-ventures"
                            >
                                See the ventures
                                <ArrowDownRight
                                    size={16}
                                    className="transition-transform group-hover:-rotate-45"
                                />
                            </a>
                            <Link
                                href="/blogs"
                                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold transition-colors hover:border-foreground"
                            >
                                Read the journal
                            </Link>
                        </motion.div>
                    </div>

                    {/* Portrait, with the three ventures floating around it as live links */}
                    <motion.div
                        className="relative mx-auto w-68 md:w-88"
                        initial={{ opacity: 0, scale: 0.94, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 1, ease: EASE }}
                    >
                        {/* Offset outline behind the photo: depth without a shadow blob */}
                        <div
                            aria-hidden
                            className="absolute inset-0 translate-x-3 translate-y-3 rounded-4xl border border-gold/60"
                        />
                        <div className="relative aspect-4/5 overflow-hidden rounded-4xl border border-border bg-card shadow-[0_30px_70px_-24px_rgb(20_33_61/0.32)]">
                            <Image
                                src={data.heroImage.url}
                                alt={data.heroImage.alt}
                                fill
                                priority
                                sizes="(max-width: 768px) 272px, 352px"
                                className="object-cover object-top"
                                data-testid="img-profile-hero"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/55 to-transparent" />
                            {/* Name plate */}
                            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white backdrop-blur-md">
                                <span>
                                    <span className="block text-sm font-medium leading-tight">
                                        {[first, ...rest].join(" ")}
                                    </span>
                                    <span className="block text-xs text-white/70">
                                        Founder, ZeroD
                                    </span>
                                </span>
                                <span className="flex items-center gap-1.5 text-[11px] text-white/80">
                                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                                    Naogaon
                                </span>
                            </div>
                        </div>

                        {VENTURES.map((v, n) => (
                            <motion.a
                                key={v.href}
                                href={v.href}
                                target="_blank"
                                rel="noopener"
                                className={`absolute ${v.pos} group inline-flex items-center gap-2 rounded-full border border-border bg-background/90 backdrop-blur px-3.5 py-2 font-mono text-xs shadow-[0_10px_30px_-12px_rgb(20_33_61/0.18)] transition-colors hover:border-gold`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1, y: reduce ? 0 : [0, -8, 0] }}
                                transition={{
                                    opacity: { delay: 1.1 + n * 0.15, duration: 0.5 },
                                    scale: { delay: 1.1 + n * 0.15, duration: 0.5, ease: EASE },
                                    y: {
                                        delay: v.bob,
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    },
                                }}
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                                {v.label}
                                <ArrowUpRight
                                    size={12}
                                    className="text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </motion.a>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Stats strip: an open ruled row, no boxes. Each column's gold segment
                draws across its top rule in turn as the figures count up. */}
            {data.stats.length > 0 && (
                <div className="container mx-auto px-6 max-w-6xl mt-20">
                    <dl className="grid grid-cols-2 border-t border-border md:grid-cols-4">
                        {data.stats.map((st, n) => (
                            // Rules sit between columns: after the first on phones' two
                            // columns, after every column but the first at md
                            <div
                                key={st.key}
                                className={`${n % 2 === 1 ? "border-l border-border" : ""} ${
                                    n === 2 ? "md:border-l md:border-border" : ""
                                } ${n >= 2 ? "max-md:mt-6 max-md:border-t max-md:border-border" : ""}`}
                            >
                                {/* dt first in a dl; flex-col-reverse puts the figure on top */}
                                <motion.div
                                    className={`relative flex flex-col-reverse gap-1 pt-6 pb-2 ${
                                        n % 2 === 1 ? "pl-6" : n === 2 ? "md:pl-6" : ""
                                    }`}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2 + n * 0.1, duration: 0.6, ease: EASE }}
                                >
                                    <motion.span
                                        aria-hidden
                                        className={`absolute top-[-1px] h-0.5 w-12 origin-left bg-gold ${
                                            n % 2 === 1
                                                ? "left-6"
                                                : n === 2
                                                  ? "left-0 md:left-6"
                                                  : "left-0"
                                        }`}
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{
                                            delay: 1.5 + n * 0.15,
                                            duration: 0.6,
                                            ease: EASE,
                                        }}
                                    />
                                    <dt className="text-sm text-muted-foreground">{st.label}</dt>
                                    <dd className="whitespace-nowrap text-4xl font-extrabold tracking-[-0.045em] text-foreground md:text-5xl">
                                        <CountUp value={st.value} />
                                    </dd>
                                </motion.div>
                            </div>
                        ))}
                    </dl>
                </div>
            )}
        </section>
    );
}

/** A whole word rises out of a mask. */
function Word({ text, delay }: { text: string; delay: number }) {
    return (
        <span className="inline-block overflow-hidden pb-[0.1em] align-top">
            <motion.span
                className="inline-block"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ delay, duration: 0.8, ease: EASE }}
            >
                {text}
            </motion.span>
        </span>
    );
}
