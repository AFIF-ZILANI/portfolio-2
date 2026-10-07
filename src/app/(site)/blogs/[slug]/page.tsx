import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, getSeriesPosts, publishedWhere } from "@/lib/blog";
import { prisma } from "@/lib/prisma";
import { Markdown } from "@/components/blog/markdown";
import { SeriesNav } from "@/components/blog/series-nav";
import { ViewCounter } from "@/components/blog/view-counter";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;



export async function generateStaticParams() {
    const posts = await prisma.post.findMany({
        where: publishedWhere(),
        select: { slug: true },
    });
    return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Post not found" };

    const title = post.seoTitle ?? post.title;
    const description = post.seoDescription ?? post.excerpt;
    const image = post.ogImage ?? post.coverImage;

    return {
        title,
        description,
        keywords: post.tags,
        alternates: { canonical: post.canonicalUrl ?? `/blogs/${post.slug}` },
        robots: post.noindex ? { index: false, follow: false } : undefined,
        openGraph: {
            type: "article",
            url: `${SITE_URL}/blogs/${post.slug}`,
            title,
            description,
            publishedTime: post.publishedAt?.toISOString(),
            modifiedTime: post.updatedAt.toISOString(),
            authors: ["Afif Zilani"],
            tags: post.tags,
            images: image ? [{ url: image.url, alt: image.alt || post.title }] : undefined,
        },
        twitter: {
            card: image ? "summary_large_image" : "summary",
            title,
            description,
            images: image ? [image.url] : undefined,
        },
    };
}

const fmt = (d: Date | null) =>
    d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    // Covers a missing slug, a draft, and a scheduled post whose time hasn't come.
    if (!post) notFound();

    const parts = post.seriesId ? await getSeriesPosts(post.seriesId) : [];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${SITE_URL}/blogs/${post.slug}#post`,
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blogs/${post.slug}` },
        headline: post.title,
        description: post.seoDescription ?? post.excerpt,
        datePublished: post.publishedAt?.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        keywords: post.tags.join(", "),
        wordCount: post.content.trim().split(/\s+/).length,
        // Attach to the Person entity the homepage already declares, so posts
        // reinforce the existing name-ranking signal rather than creating a new author.
        author: { "@id": `${SITE_URL}/#person` },
        publisher: { "@id": `${SITE_URL}/#person` },
        isPartOf: { "@id": `${SITE_URL}/blogs#blog` },
        inLanguage: "en",
        // A described image is eligible for image results; a bare URL string is not.
        ...(post.coverImage
            ? {
                  image: {
                      "@type": "ImageObject",
                      url: post.coverImage.url,
                      caption: post.coverImage.alt || post.title,
                      ...(post.coverImage.width > 0
                          ? { width: post.coverImage.width, height: post.coverImage.height }
                          : {}),
                  },
              }
            : {}),
    };

    // Breadcrumbs give search results the Home › Blog › Post trail instead of a
    // bare URL, and tell crawlers how this page sits in the site.
    const breadcrumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blogs` },
            {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: `${SITE_URL}/blogs/${post.slug}`,
            },
        ],
    };

    return (
        <>
            <main className="pt-32 pb-24">
                <article className="container mx-auto px-6 max-w-3xl space-y-8">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft size={14} /> all posts
                    </Link>

                    <header className="space-y-4">
                        {post.series && (
                            <p className="text-xs text-primary">
                                {post.series.title}
                                {post.seriesOrder ? ` · part ${post.seriesOrder}` : ""}
                            </p>
                        )}
                        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
                            {post.title}
                        </h1>
                        <p className="text-muted-foreground">{post.excerpt}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            <time dateTime={post.publishedAt?.toISOString()}>
                                {fmt(post.publishedAt)}
                            </time>
                            <span aria-hidden>·</span>
                            <span>{post.readingMinutes} min read</span>
                            <span aria-hidden>·</span>
                            <ViewCounter slug={post.slug} initial={post.views} />
                        </div>
                        {post.tags.length > 0 && (
                            <ul className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                {post.tags.map((t) => (
                                    <li key={t} className="border border-border px-2 py-1">
                                        #{t}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </header>

                    {post.coverImage && (
                        <div className="relative w-full aspect-video border border-border">
                            <Image
                                src={post.coverImage.url}
                                alt={post.coverImage.alt || post.title}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 768px"
                                className="object-cover"
                            />
                        </div>
                    )}

                    <Markdown>{post.content}</Markdown>

                    {post.series && (
                        <SeriesNav
                            seriesTitle={post.series.title}
                            description={post.series.description}
                            parts={parts}
                            currentSlug={post.slug}
                        />
                    )}
                </article>
            </main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
            />
        </>
    );
}
