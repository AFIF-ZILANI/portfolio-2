import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { PostCard } from "@/components/blog/post-card";
import type { PostCard as PostCardData } from "@/lib/blog";

/**
 * Latest writing on the homepage: the newest post wide, the next two beside each
 * other. Static markup apart from the heading's reveal.
 */
export function LatestPosts({ posts }: { posts: PostCardData[] }) {
    // Nothing published yet: render nothing rather than an empty shell.
    if (posts.length === 0) return null;
    const [lead, ...rest] = posts;

    return (
        <section id="writing" className="py-24 md:py-32 border-t border-border">
            <div className="container mx-auto px-6 max-w-6xl">
                <SectionHeading
                    eyebrow="Journal"
                    title="Notes from the farm and the keyboard."
                    action={
                        <Link
                            href="/blogs"
                            className="group flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                            All posts
                            <ArrowRight
                                size={14}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>
                    }
                />

                <div className="grid gap-4">
                    <PostCard post={lead} featured />
                    {rest.length > 0 && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {rest.map((p) => (
                                <PostCard key={p.id} post={p} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
