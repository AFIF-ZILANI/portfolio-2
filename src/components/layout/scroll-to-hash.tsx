"use client";

import { useEffect } from "react";

/**
 * Extracted from the homepage when it became a server component. Restores manual
 * scroll control and honours a #section hash arrived at from another route.
 */
export function ScrollToHash() {
    useEffect(() => {
        window.history.scrollRestoration = "manual";
        window.scrollTo(0, 0);

        const hash = window.location.hash.slice(1);
        if (!hash) return;
        const timer = setTimeout(() => {
            document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    return null;
}
