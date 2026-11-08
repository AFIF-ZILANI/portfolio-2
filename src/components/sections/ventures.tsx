"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { CountUp } from "@/components/count-up";
import { DeliveryStepper, FarmTracker } from "@/components/stageshow/venture-stages";
import type { Experience } from "@/lib/site-data";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The ZeroD group as a bento (stageshow references/bento.md): four tiles, one
 * hero, every neighbour a different kind.
 *
 *   Tile         Span  Kind        The one thing
 *   ZeroD Farms  2/3   Hero UI     the farm tracker logging a batch
 *   Capacity     1/3   Stat        10,000 birds, on the one navy tile
 *   ZeroD Agency 1/3   Component   a site ticking Brief → Launch by day 7
 *   ZeroD Umb    2/3   Diagram     zerod.bd with farms. and agency. hanging off it
 *
 * Company, role and link come from the experiences edited in admin, matched by
 * domain; the one-line copy and the pictures belong to each company here.
 */

const COPY: Record<string, string> = {
    "farms.zerod.bd": "A family poultry farm in Mahadebpur, Naogaon, tracked batch by batch.",
    "agency.zerod.bd": "Websites for local businesses, in a week.",
    "zerod.bd": "The group behind the farm and the agency, each on its own subdomain.",
};

const host = (url?: string) => (url ?? "").replace(/^https?:\/\//, "").replace(/\/.*$/, "");

export function Ventures({ experiences }: { experiences: Experience[] }) {
    const by = (h: string) => experiences.find((e) => host(e.url) === h);
    const farms = by("farms.zerod.bd");
    const agency = by("agency.zerod.bd");
    const umb = by("zerod.bd");

    return (
        <section id="ventures" className="py-24 md:py-32">
            <div className="container mx-auto px-6 max-w-6xl">
                <SectionHeading eyebrow="Ventures" title="One group, three companies." />

                <div className="grid gap-4 md:grid-cols-3">
                    <Tile
                        venture={farms}
                        fallback="ZeroD Farms"
                        className="md:col-span-2"
                        index={0}
                    >
                        <FarmTracker />
                    </Tile>

                    <Reveal
                        index={1}
                        className="flex flex-col justify-between gap-10 rounded-3xl bg-[#14213D] p-7 text-white md:p-8"
                    >
                        <div>
                            <p className="text-lg text-white/70">Room for</p>
                            <p className="mt-1 whitespace-nowrap text-6xl font-extrabold tracking-[-0.045em] md:text-7xl">
                                <CountUp value="10,000" />
                            </p>
                            <p className="mt-3 max-w-[18ch] text-lg leading-snug text-white/70">
                                birds across five sheds at ZeroD Farms.
                            </p>
                        </div>
                        {/* What the capacity is doing: about half of it raised each month */}
                        <div>
                            {/* The track watches the viewport; the fill starts at zero width and never would */}
                            <motion.div
                                className="h-1.5 overflow-hidden rounded-full bg-white/15"
                                initial="hidden"
                                whileInView="shown"
                                viewport={{ once: true }}
                            >
                                <motion.div
                                    className="h-full origin-left rounded-full bg-gold"
                                    variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 0.5 } }}
                                    transition={{ delay: 0.6, duration: 1.2, ease: EASE }}
                                />
                            </motion.div>
                            <p className="mt-3 text-sm text-white/70">
                                About 5,000 raised each month
                            </p>
                        </div>
                    </Reveal>

                    <Tile venture={agency} fallback="ZeroD Agency" index={2}>
                        <DeliveryStepper />
                    </Tile>

                    <Tile venture={umb} fallback="ZeroD Umb" className="md:col-span-2" index={3}>
                        <DomainTree />
                    </Tile>
                </div>
            </div>
        </section>
    );
}

function Reveal({
    index,
    className,
    children,
}: {
    index: number;
    className?: string;
    children: ReactNode;
}) {
    return (
        <motion.div
            // min-w-0: a grid item otherwise grows to its Stage's first-paint width
            className={`min-w-0 ${className ?? ""}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: index * 0.11, ease: EASE }}
        >
            {children}
        </motion.div>
    );
}

/** A company tile: run-in copy on top, its picture pinned to the bottom edge. */
function Tile({
    venture,
    fallback,
    className = "",
    index,
    children,
}: {
    venture?: Experience;
    fallback: string;
    className?: string;
    index: number;
    children: ReactNode;
}) {
    const h = host(venture?.url);
    const inner = (
        <>
            <div className="flex items-start justify-between gap-6 px-7 pt-7 md:px-8 md:pt-8">
                <div className="max-w-xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
                        {venture?.role}
                    </p>
                    <p className="mt-3 text-xl leading-snug">
                        <b className="font-bold text-foreground">{venture?.company ?? fallback}.</b>{" "}
                        <span className="text-muted-foreground">
                            {COPY[h] ?? venture?.description}
                        </span>
                    </p>
                </div>
                {h && (
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border transition-all duration-300 group-hover:rotate-45 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                        <ArrowUpRight size={16} />
                    </span>
                )}
            </div>
            <div className="mt-auto px-7 pt-8 md:px-8">{children}</div>
        </>
    );
    const cls =
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-[border-color,box-shadow] duration-500 hover:border-gold/60 hover:shadow-[0_10px_30px_-12px_rgb(20_33_61/0.18)]";
    return (
        <Reveal index={index} className={className}>
            {venture?.url ? (
                <a href={venture.url} target="_blank" rel="noopener" className={cls}>
                    {inner}
                </a>
            ) : (
                <div className={cls}>{inner}</div>
            )}
        </Reveal>
    );
}

/**
 * The group's real structure: two subdomains hanging off the root domain.
 * Drawn in true pixels (no stretched viewBox, which breaks the draw-in), with
 * one layout for the wide tile and one for a phone column.
 */
function DomainTree() {
    return (
        <div
            role="img"
            aria-label="zerod.bd, with farms.zerod.bd and agency.zerod.bd under it"
            className="pb-8"
        >
            <Tree
                className="hidden md:block"
                w={560}
                h={168}
                root={{ x: 0, y: 84 }}
                leafX={280}
                leafYs={[34, 134]}
            />
            <Tree
                className="md:hidden"
                w={300}
                h={200}
                root={{ x: 0, y: 24 }}
                leafX={64}
                leafYs={[104, 168]}
                vertical
            />
        </div>
    );
}

const ROOT_W = 112;
const PILL_H = 44;

function Tree({
    className,
    w,
    h,
    root,
    leafX,
    leafYs,
    vertical = false,
}: {
    className: string;
    w: number;
    h: number;
    root: { x: number; y: number };
    leafX: number;
    leafYs: number[];
    vertical?: boolean;
}) {
    const subs = ["farms", "agency"];
    // Each branch leaves the root's edge and lands on the leaf's left edge
    const path = (y: number) => {
        if (vertical) {
            const sx = root.x + 32;
            const sy = root.y + PILL_H / 2;
            return `M${sx} ${sy} V${y - 12} Q${sx} ${y} ${sx + 12} ${y} H${leafX}`;
        }
        const sx = root.x + ROOT_W;
        const mid = (sx + leafX) / 2;
        return `M${sx} ${root.y} C${mid} ${root.y} ${mid} ${y} ${leafX} ${y}`;
    };
    return (
        <div className={`relative max-w-full ${className}`} style={{ width: w, height: h }}>
            <svg width={w} height={h} className="absolute inset-0 overflow-visible" aria-hidden>
                {leafYs.map((y, i) => (
                    <motion.path
                        key={y}
                        d={path(y)}
                        fill="none"
                        stroke="hsl(var(--gold))"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.15, duration: 0.8, ease: EASE }}
                    />
                ))}
            </svg>
            <span
                className="absolute grid place-items-center rounded-full bg-primary font-mono text-sm font-medium text-primary-foreground"
                style={{ left: root.x, top: root.y - PILL_H / 2, width: ROOT_W, height: PILL_H }}
            >
                zerod.bd
            </span>
            {leafYs.map((y, i) => (
                <motion.span
                    key={y}
                    className="absolute flex items-center whitespace-nowrap rounded-full border border-border bg-background px-4 font-mono text-sm"
                    style={{ left: leafX, top: y - PILL_H / 2, height: PILL_H }}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 + i * 0.15, duration: 0.5, ease: EASE }}
                >
                    <b className="font-semibold text-foreground">{subs[i]}</b>
                    <span className="text-muted-foreground">.zerod.bd</span>
                </motion.span>
            ))}
        </div>
    );
}
