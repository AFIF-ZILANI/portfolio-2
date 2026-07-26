import Link from "next/link";
import { Eye, Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { StatusToggle } from "@/components/admin/status-toggle";

export const dynamic = "force-dynamic";

const fmt = (d: Date | null) =>
    d ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default async function AdminBlogsPage() {
    const posts = await prisma.post.findMany({
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        select: {
            id: true,
            slug: true,
            title: true,
            status: true,
            publishedAt: true,
            views: true,
            series: { select: { title: true } },
            seriesOrder: true,
        },
    });

    const now = Date.now();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold font-mono">
                    <span className="text-primary">$</span> ls posts
                    <span className="text-muted-foreground text-sm ml-3">({posts.length})</span>
                </h1>
                <Link href="/admin/blogs/create">
                    <Button className="font-mono">
                        <Plus size={16} /> new post
                    </Button>
                </Link>
            </div>

            {posts.length === 0 ? (
                <p className="text-muted-foreground font-mono text-sm border border-dashed border-border p-12 text-center">
                    No posts yet. Write the first one.
                </p>
            ) : (
                <div className="border border-border divide-y divide-border">
                    {posts.map((p) => {
                        const scheduled =
                            p.status === "PUBLISHED" &&
                            p.publishedAt &&
                            p.publishedAt.getTime() > now;
                        return (
                            <div
                                key={p.id}
                                className="p-4 flex items-center gap-4 hover:bg-card transition-colors"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium truncate">{p.title}</span>
                                        {p.status === "DRAFT" && (
                                            <Badge variant="secondary" className="font-mono text-xs">
                                                draft
                                            </Badge>
                                        )}
                                        {scheduled && (
                                            <Badge className="font-mono text-xs">scheduled</Badge>
                                        )}
                                        {p.series && (
                                            <Badge variant="outline" className="font-mono text-xs">
                                                {p.series.title}
                                                {p.seriesOrder ? ` · ${p.seriesOrder}` : ""}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono mt-1">
                                        /blogs/{p.slug} · {fmt(p.publishedAt)} · {p.views} views
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <StatusToggle id={p.id} title={p.title} status={p.status} />
                                    <Link
                                        href={`/blogs/${p.slug}`}
                                        target="_blank"
                                        aria-label={`View ${p.title}`}
                                        className="text-muted-foreground hover:text-primary transition-colors p-1"
                                    >
                                        <Eye size={16} />
                                    </Link>
                                    <Link
                                        href={`/admin/blogs/${p.id}/edit`}
                                        aria-label={`Edit ${p.title}`}
                                        className="text-muted-foreground hover:text-primary transition-colors p-1"
                                    >
                                        <Pencil size={16} />
                                    </Link>
                                    <DeletePostButton id={p.id} title={p.title} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
