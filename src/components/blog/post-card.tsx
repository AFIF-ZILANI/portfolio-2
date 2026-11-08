import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { PostCard as PostCardData } from "@/lib/blog";

export const fmtDate = (d: Date | null) =>
    d
        ? new Date(d).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "";

/**
 * One post in a grid, shared by the homepage and /blogs. `featured` lays it out
 * wide (cover beside the text) for the newest post.
 */
export function PostCard({
    post: p,
    featured = false,
    headingLevel: H = "h3",
}: {
    post: PostCardData;
    featured?: boolean;
    headingLevel?: "h2" | "h3";
}) {
    return (
        <Link
            href={`/blogs/${p.slug}`}
            className={`group relative flex h-full overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_10px_30px_-12px_rgb(20_33_61/0.18)] ${
                featured ? "flex-col md:flex-row" : "flex-col"
            }`}
        >
            <div
                className={`relative overflow-hidden bg-muted ${
                    featured
                        ? "aspect-video md:aspect-auto md:w-[55%] md:min-h-80"
                        : "aspect-[16/10]"
                }`}
            >
                {p.coverImage ? (
                    <Image
                        src={p.coverImage.url}
                        alt={p.coverImage.alt || p.title}
                        fill
                        sizes={
                            featured
                                ? "(max-width: 768px) 100vw, 640px"
                                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        }
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    // No cover: the post's first tag, set large, on a soft green field
                    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary/10 via-transparent to-gold/15">
                        <span className="text-3xl font-extrabold tracking-[-0.03em] text-foreground/70">
                            {p.series?.title ?? p.tags[0] ?? "Journal"}
                        </span>
                    </div>
                )}
            </div>

            <div
                className={`flex flex-1 flex-col gap-3 p-6 ${featured ? "md:p-10 md:justify-center" : ""}`}
            >
                <p className="flex flex-wrap items-center gap-x-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    <time
                        dateTime={p.publishedAt ? new Date(p.publishedAt).toISOString() : undefined}
                    >
                        {fmtDate(p.publishedAt)}
                    </time>
                    <span aria-hidden>·</span>
                    <span>{p.readingMinutes} min read</span>
                    {p.series && (
                        <>
                            <span aria-hidden>·</span>
                            <span className="text-gold-ink normal-case tracking-normal">
                                {p.series.title}
                                {p.seriesOrder ? `, part ${p.seriesOrder}` : ""}
                            </span>
                        </>
                    )}
                </p>
                <H
                    className={`font-bold leading-[1.15] tracking-[-0.025em] transition-colors group-hover:text-primary ${
                        featured ? "text-3xl md:text-5xl" : "text-2xl"
                    }`}
                >
                    {p.title}
                </H>
                <p
                    className={`text-muted-foreground leading-relaxed ${featured ? "md:text-lg line-clamp-4" : "text-sm line-clamp-3"}`}
                >
                    {p.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4">
                    {p.tags.length > 0 ? (
                        <ul className="flex flex-wrap gap-1.5">
                            {p.tags.slice(0, 3).map((t) => (
                                <li
                                    key={t}
                                    className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                                >
                                    {t}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <span />
                    )}
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border transition-all duration-300 group-hover:rotate-45 group-hover:bg-foreground group-hover:text-background">
                        <ArrowUpRight size={15} />
                    </span>
                </div>
            </div>
        </Link>
    );
}
