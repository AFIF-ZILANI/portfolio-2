"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { PostCard } from "@/lib/blog";

// Matches the stagger convention used by the homepage sections.
const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 90 } },
};

const fmt = (d: Date | null) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

export function BlogIndex({ posts }: { posts: PostCard[] }) {
    const [query, setQuery] = useState("");
    const [tag, setTag] = useState<string | null>(null);
    const [series, setSeries] = useState<string | null>(null);

    const allTags = useMemo(
        () => [...new Set(posts.flatMap((p) => p.tags))].sort(),
        [posts]
    );
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

    return (
        <div className="space-y-10">
            <div className="space-y-4">
                <div className="relative max-w-md">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                    <Input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="search posts…"
                        aria-label="Search posts"
                        className="pl-9 font-mono"
                    />
                </div>

                {(allTags.length > 0 || allSeries.length > 0) && (
                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                        {allSeries.map(([slug, title]) => (
                            <button
                                key={slug}
                                onClick={() => setSeries(series === slug ? null : slug)}
                                aria-pressed={series === slug}
                                className={`px-2 py-1 border transition-colors ${
                                    series === slug
                                        ? "border-primary text-primary"
                                        : "border-border text-muted-foreground hover:border-primary"
                                }`}
                            >
                                ⛓ {title}
                            </button>
                        ))}
                        {allTags.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTag(tag === t ? null : t)}
                                aria-pressed={tag === t}
                                className={`px-2 py-1 border transition-colors ${
                                    tag === t
                                        ? "border-primary text-primary"
                                        : "border-border text-muted-foreground hover:border-primary"
                                }`}
                            >
                                #{t}
                            </button>
                        ))}
                        {filtered && (
                            <button
                                onClick={() => {
                                    setQuery("");
                                    setTag(null);
                                    setSeries(null);
                                }}
                                className="px-2 py-1 text-muted-foreground hover:text-primary flex items-center gap-1"
                            >
                                <X size={12} /> clear
                            </button>
                        )}
                    </div>
                )}

                <p className="font-mono text-xs text-muted-foreground" aria-live="polite">
                    {results.length} {results.length === 1 ? "post" : "posts"}
                    {filtered && ` of ${posts.length}`}
                </p>
            </div>

            {results.length === 0 ? (
                <p className="text-muted-foreground font-mono text-sm border border-dashed border-border p-16 text-center">
                    {posts.length === 0 ? "Nothing published yet." : "No posts match that search."}
                </p>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {results.map((p) => (
                        <motion.article key={p.id} variants={itemVariants} layout>
                            <Link
                                href={`/blogs/${p.slug}`}
                                className="group block h-full bg-card border border-border hover:border-primary transition-colors duration-300"
                            >
                                <div className="relative w-full aspect-video bg-muted overflow-hidden">
                                    {p.coverImage ? (
                                        <Image
                                            src={p.coverImage.url}
                                            alt={p.coverImage.alt || p.title}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 grid place-items-center font-mono text-xs text-muted-foreground">
                                            {p.slug}.md
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 space-y-3">
                                    {p.series && (
                                        <p className="font-mono text-xs text-primary">
                                            {p.series.title}
                                            {p.seriesOrder ? ` · part ${p.seriesOrder}` : ""}
                                        </p>
                                    )}
                                    <h2 className="font-bold leading-snug group-hover:text-primary transition-colors">
                                        {p.title}
                                    </h2>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {p.excerpt}
                                    </p>
                                    <p className="font-mono text-xs text-muted-foreground pt-1">
                                        {fmt(p.publishedAt)} · {p.readingMinutes} min
                                    </p>
                                    {p.tags.length > 0 && (
                                        <ul className="flex flex-wrap gap-2 font-mono text-xs text-muted-foreground">
                                            {p.tags.slice(0, 4).map((t) => (
                                                <li key={t}>#{t}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
