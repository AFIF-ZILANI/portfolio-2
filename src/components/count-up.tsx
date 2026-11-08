"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Counts the leading number of a stat ("10k", "5+", "10,000") up from zero the first
 * time it is seen, keeping whatever follows the digits. Non-numeric values render
 * as they are.
 */
export function CountUp({ value }: { value: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const seen = useInView(ref, { once: true, margin: "-40px" });
    const reduce = useReducedMotion();
    const m = value.match(/^(\d[\d,]*(?:\.\d+)?)(.*)$/);
    const grouped = Boolean(m?.[1].includes(","));
    const target = m ? Number(m[1].replace(/,/g, "")) : 0;
    // A year ("2022") is a date, not a quantity: counting it up from zero reads wrong
    const isYear = !grouped && /^(19|20)\d\d$/.test(m?.[1] ?? "");
    const [n, setN] = useState(m && !reduce && !isYear ? 0 : target);

    useEffect(() => {
        if (!m || !seen || reduce || isYear) return;
        const c = animate(0, target, { duration: 1.4, ease: EASE, onUpdate: (v) => setN(v) });
        return () => c.stop();
    }, [seen, target, reduce, isYear]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!m) return <span>{value}</span>;
    const decimals = m[1].includes(".") ? 1 : 0;
    return (
        <span ref={ref} className="tabular-nums">
            {grouped ? Math.round(n).toLocaleString("en-US") : n.toFixed(decimals)}
            <span className="text-gold">{m[2]}</span>
        </span>
    );
}
