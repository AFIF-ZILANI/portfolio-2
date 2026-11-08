"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** A hairline under the navbar that fills as the post is read. */
export function ReadingProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
    return (
        <motion.div
            aria-hidden
            className="fixed inset-x-0 top-16 z-50 h-0.5 origin-left bg-primary"
            style={{ scaleX }}
        />
    );
}
