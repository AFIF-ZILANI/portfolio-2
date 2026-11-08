"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Rises into place the first time it scrolls into view, `index` steps later than
 * its neighbours. For server-rendered grids that want a stagger without becoming
 * client components themselves.
 */
export function Reveal({
    index = 0,
    className,
    children,
}: {
    index?: number;
    className?: string;
    children: ReactNode;
}) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: index * 0.09, ease: EASE }}
        >
            {children}
        </motion.div>
    );
}
