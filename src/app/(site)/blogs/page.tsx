import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/blog";
import { BlogIndex } from "@/components/blog/blog-index";
import { SITE_URL } from "@/lib/site";

// Short window so scheduled posts appear without a deploy.
export const revalidate = 60;

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Writing by Afif Zilani on running a business, poultry farming, web development, and building software.",
    alternates: { canonical: "/blogs" },
    openGraph: {
        type: "website",
        url: `${SITE_URL}/blogs`,
        title: "Blog | Afif Zilani",
        description:
            "Writing by Afif Zilani on running a business, poultry farming, web development, and building software.",
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
            <main className="pt-36 pb-24">
                <div className="container mx-auto px-6 max-w-6xl space-y-12">
                    <header className="space-y-5 border-b border-border pb-12">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
                            Journal
                        </p>
                        <h1 className="font-extrabold text-5xl md:text-7xl leading-[0.98] tracking-[-0.045em]">
                            Notes from the farm
                            <br />
                            <span className="text-muted-foreground">and the keyboard.</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            What I learn running ZeroD Farms, building software at ZeroD Agency, and
                            growing a group of companies from Naogaon.
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
