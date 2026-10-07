import Link from "next/link";
import { SectionHeading } from "@/components/layout/section-heading";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { PostCard } from "@/lib/blog";

const fmt = (d: Date | null) =>
    d
        ? new Date(d).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "";

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
        <section id="writing" className="py-20 md:py-28">
            <div className="container mx-auto px-6 max-w-6xl">
                <SectionHeading
                    eyebrow="Writing"
                    title="Latest writing"
                    action={
                        <Link
                            href="/blogs"
                            className="text-sm font-medium text-primary hover:underline underline-offset-4 flex items-center gap-1.5 group shrink-0"
                        >
                            All posts
                            <ArrowRight
                                size={14}
                                className="group-hover:translate-x-1 transition-transform"
                            />
                        </Link>
                    }
                />

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((p) => (
                        <article key={p.id}>
                            <Link
                                href={`/blogs/${p.slug}`}
                                className="group flex flex-col h-full overflow-hidden rounded-2xl bg-card border border-border hover:border-primary transition-colors duration-300"
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
                                        <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
                                            {p.slug}.md
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 flex flex-col gap-3 flex-1">
                                    {p.series && (
                                        <p className="text-xs text-primary">
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
                                    <p className="text-xs text-muted-foreground mt-auto pt-1">
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
