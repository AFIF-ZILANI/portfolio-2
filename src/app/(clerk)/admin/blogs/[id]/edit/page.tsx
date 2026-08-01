import { notFound } from "next/navigation";
import { getAllSeries } from "@/lib/blog";
import { prisma } from "@/lib/prisma";
import { PostEditor } from "@/components/admin/post-editor";
import { IMAGE_SELECT } from "@/lib/image-utils";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [post, series] = await Promise.all([
        prisma.post.findUnique({
            where: { id },
            // The editor renders the images, so pull the rows rather than the ids.
            include: {
                coverImage: { select: IMAGE_SELECT },
                ogImage: { select: IMAGE_SELECT },
            },
        }),
        getAllSeries(),
    ]);

    if (!post) notFound();

    return (
        <PostEditor
            series={series.map((s) => ({ id: s.id, title: s.title }))}
            post={{
                id: post.id,
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                content: post.content,
                coverImage: post.coverImage,
                ogImage: post.ogImage,
                tags: post.tags,
                status: post.status,
                // The editor needs a Date for the datetime-local field; the action takes a string.
                publishedAt: post.publishedAt?.toISOString() ?? null,
                publishedAtDate: post.publishedAt,
                seoTitle: post.seoTitle,
                seoDescription: post.seoDescription,
                canonicalUrl: post.canonicalUrl,
                noindex: post.noindex,
                seriesId: post.seriesId,
                seriesOrder: post.seriesOrder,
            }}
        />
    );
}
