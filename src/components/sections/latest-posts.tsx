import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { PostCard } from "@/lib/blog";

const fmt = (d: Date | null) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

/**
 * Latest writing on the homepage.
 *
 * A server component on purpose — it's static markup, so it adds no JavaScript to
 * the homepage bundle, unlike the other sections which are all client components
 * for their animations.
 */
export function LatestPosts({ posts }: { posts: PostCard[] }) {
    // Nothing published yet: render nothing rather than an empty shell.
    if (posts.length === 0) return null;

    return (
        <section id="writing" className="py-24">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex items-end justify-between gap-4 mb-12 flex-wrap">
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                        <span className="text-primary">05.</span> Latest Writing
                    </h2>
                    <Link
                        href="/blogs"
                        className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group"
                    >
                        all posts
                        <ArrowRight
                            size={14}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </Link>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((p) => (
                        <article key={p.id}>
                            <Link
                                href={`/blogs/${p.slug}`}
                                className="group flex flex-col h-full bg-card border border-border hover:border-primary transition-colors duration-300"
                            >
                                <div className="relative w-full aspect-video bg-muted overflow-hidden">
                                    {p.coverImage ? (
                                        <Image
                                            src={p.coverImage}
                                            alt={p.coverAlt || p.title}
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

                                <div className="p-5 flex flex-col gap-3 flex-1">
                                    {p.series && (
                                        <p className="font-mono text-xs text-primary">
                                            {p.series.title}
                                            {p.seriesOrder ? ` · part ${p.seriesOrder}` : ""}
                                        </p>
                                    )}
                                    <h3 className="font-bold leading-snug group-hover:text-primary transition-colors">
                                        {p.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {p.excerpt}
                                    </p>
                                    <p className="font-mono text-xs text-muted-foreground mt-auto pt-1">
                                        {fmt(p.publishedAt)} · {p.readingMinutes} min read
                                    </p>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
