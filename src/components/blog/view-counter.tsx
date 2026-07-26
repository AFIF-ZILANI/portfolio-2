"use client";

import { useEffect, useRef, useState } from "react";

export function ViewCounter({ slug, initial }: { slug: string; initial: number }) {
    const [views, setViews] = useState(initial);
    const counted = useRef(false);

    useEffect(() => {
        // React 18+ StrictMode mounts effects twice in dev; don't double-count.
        if (counted.current) return;
        counted.current = true;

        fetch(`/api/views/${slug}`, { method: "POST" })
            .then((r) => (r.ok ? r.json() : null))
            .then((d: { views: number } | null) => d && setViews(d.views))
            .catch(() => {
                /* a broken counter must never break the page */
            });
    }, [slug]);

    return <span>{views.toLocaleString()} views</span>;
}
