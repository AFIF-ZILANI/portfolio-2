import { prisma } from "@/lib/prisma";
import { SeriesManager } from "@/components/admin/series-manager";

export const dynamic = "force-dynamic";

export default async function AdminSeriesPage() {
    const series = await prisma.series.findMany({
        orderBy: { title: "asc" },
        include: { _count: { select: { posts: true } } },
    });

    return (
        <SeriesManager
            rows={series.map((s) => ({
                id: s.id,
                title: s.title,
                slug: s.slug,
                description: s.description,
                postCount: s._count.posts,
            }))}
        />
    );
}
