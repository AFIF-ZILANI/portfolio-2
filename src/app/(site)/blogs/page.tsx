import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/blog";
import { BlogIndex } from "@/components/blog/blog-index";
import { SITE_URL } from "@/lib/site";

// Short window so scheduled posts appear without a deploy.
export const revalidate = 60;

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Writing by Afif Zilani, co-founder of ZeroD Farm, on poultry farming, running an agribusiness in Bangladesh, and lessons from building things.",
    alternates: { canonical: "/blogs" },
    openGraph: {
        type: "website",
        url: `${SITE_URL}/blogs`,
        title: "Blog | Afif Zilani",
        description:
            "Writing by Afif Zilani, co-founder of ZeroD Farm, on poultry farming, running an agribusiness in Bangladesh, and lessons from building things.",
    },
};

export default async function BlogsPage() {
    const posts = await getPublishedPosts();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": `${SITE_URL}/blogs#blog`,
        url: `${SITE_URL}/blogs`,
        name: "Afif Zilani — Blog",
        author: { "@id": `${SITE_URL}/#person` },
        blogPost: posts.slice(0, 20).map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${SITE_URL}/blogs/${p.slug}`,
            datePublished: p.publishedAt?.toISOString(),
        })),
    };

    return (
        <>
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-6xl space-y-12">
                    <header className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                            Blog
                        </h1>
                        <p className="text-muted-foreground max-w-2xl">
                            Notes from running ZeroD Farm, and things I have learned along the way.
                        </p>
                    </header>

                    <BlogIndex posts={posts} />
                </div>
            </main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </>
    );
}
