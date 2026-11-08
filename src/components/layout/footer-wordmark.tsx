"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The footer's sign-off: the name set across the full width, each letter rising
 * out of the footer's floor as the reader reaches the end, the gold dot landing
 * last. Letters lift a touch under the pointer. Sized to fill the container:
 * "Afif Zilani." in Manrope 800 at -0.06em is about 4.24em wide, so the font
 * is a hair under (viewport - 48px gutters) / 4.24, capped where the container stops. Decorative: the name is already
 * in the page's heading and schema, so this is aria-hidden.
 */
export function FooterWordmark({ name }: { name: string }) {
    const reduce = useReducedMotion();
    // Stored as "AFIF ZILANI"; title case reads better at this size
    const text = name
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    const letters = text.split("");

    return (
        <motion.div
            aria-hidden
            className="flex select-none items-end overflow-hidden whitespace-nowrap font-extrabold leading-[0.78] tracking-[-0.06em] text-foreground text-[clamp(3rem,calc(23vw_-_12px),15.9rem)]"
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, margin: "0px 0px -40px 0px" }}
        >
            {letters.map((ch, i) => (
                <motion.span
                    key={i}
                    className="inline-block pb-[0.06em]"
                    whileHover={
                        reduce
                            ? undefined
                            : { y: "-8%", transition: { duration: 0.25, ease: EASE } }
                    }
                    variants={{
                        hidden: { y: reduce ? 0 : "105%" },
                        shown: { y: 0 },
                    }}
                    transition={{ delay: i * 0.045, duration: 0.9, ease: EASE }}
                >
                    {ch === " " ? " " : ch}
                </motion.span>
            ))}
            <motion.span
                className="mb-[0.06em] ml-[0.04em] inline-block h-[0.14em] w-[0.14em] shrink-0 rounded-full bg-gold"
                variants={{
                    hidden: { scale: reduce ? 1 : 0 },
                    shown: { scale: 1 },
                }}
                transition={{
                    delay: letters.length * 0.045 + 0.25,
                    type: "spring",
                    stiffness: 420,
                    damping: 14,
                }}
            />
        </motion.div>
    );
}

export function BackToTop() {
    return (
        <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
            Back to top
            <span className="grid h-8 w-8 place-items-center rounded-full border border-border transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                <ArrowUp size={14} />
            </span>
        </button>
    );
}
