"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { PostCard as PostCardData } from "@/lib/blog";
import { PostCard } from "@/components/blog/post-card";

// Matches the stagger convention used by the homepage sections.
const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 90 } },
};

export function BlogIndex({ posts }: { posts: PostCardData[] }) {
    const [query, setQuery] = useState("");
    const [tag, setTag] = useState<string | null>(null);
    const [series, setSeries] = useState<string | null>(null);

    const allTags = useMemo(() => [...new Set(posts.flatMap((p) => p.tags))].sort(), [posts]);
    const allSeries = useMemo(() => {
        const map = new Map<string, string>();
        posts.forEach((p) => p.series && map.set(p.series.slug, p.series.title));
        return [...map].sort((a, b) => a[1].localeCompare(b[1]));
    }, [posts]);

    // ponytail: client-side filter over the full list. Fine to ~200 posts;
    // move to Postgres full-text (pg_trgm) if it ever gets slow.
    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        return posts.filter((p) => {
            if (tag && !p.tags.includes(tag)) return false;
            if (series && p.series?.slug !== series) return false;
            if (!q) return true;
            return (
                p.title.toLowerCase().includes(q) ||
                p.excerpt.toLowerCase().includes(q) ||
                p.tags.some((t) => t.toLowerCase().includes(q))
            );
        });
    }, [posts, query, tag, series]);

    const filtered = Boolean(query || tag || series);

    const chip = (on: boolean) =>
        `rounded-full border px-3 py-1.5 text-xs transition-colors ${
            on
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
        }`;

    return (
        <div className="space-y-10">
            <div className="space-y-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full max-w-md">
                        <Search
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                        <Input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search posts"
                            aria-label="Search posts"
                            className="h-11 rounded-full pl-10"
                        />
                    </div>
                    <p className="font-mono text-xs text-muted-foreground" aria-live="polite">
                        {results.length} {results.length === 1 ? "post" : "posts"}
                        {filtered && ` of ${posts.length}`}
                    </p>
                </div>

                {(allTags.length > 0 || allSeries.length > 0) && (
                    <div className="flex flex-wrap items-center gap-2">
                        {allSeries.map(([slug, title]) => (
                            <button
                                key={slug}
                                onClick={() => setSeries(series === slug ? null : slug)}
                                aria-pressed={series === slug}
                                className={chip(series === slug)}
                            >
                                Series: {title}
                            </button>
                        ))}
                        {allTags.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTag(tag === t ? null : t)}
                                aria-pressed={tag === t}
                                className={chip(tag === t)}
                            >
                                {t}
                            </button>
                        ))}
                        {filtered && (
                            <button
                                onClick={() => {
                                    setQuery("");
                                    setTag(null);
                                    setSeries(null);
                                }}
                                className="flex items-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                            >
                                <X size={12} /> Clear
                            </button>
                        )}
                    </div>
                )}
            </div>

            {results.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border p-16 text-center">
                    <p className="text-3xl font-extrabold tracking-[-0.03em]">
                        {posts.length === 0
                            ? "The first entry is on its way."
                            : "Nothing matches that."}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {posts.length === 0
                            ? "Notes on running a farm, building software, and growing ZeroD."
                            : "Try another word, or clear the filters."}
                    </p>
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {results.map((p, i) => {
                        // The newest post leads, wide, until a filter narrows the list
                        const featured = i === 0 && !filtered;
                        return (
                            <motion.article
                                key={p.id}
                                variants={itemVariants}
                                layout
                                className={featured ? "sm:col-span-2 lg:col-span-3" : ""}
                            >
                                <PostCard post={p} featured={featured} headingLevel="h2" />
                            </motion.article>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
}
