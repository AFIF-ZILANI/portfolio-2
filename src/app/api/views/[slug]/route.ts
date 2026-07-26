import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publishedWhere } from "@/lib/blog";

/**
 * Increments and returns a post's view count.
 *
 * Lives outside the cached render so the number stays live under ISR.
 * ponytail: no dedupe — a refresh recounts. Add an IP+slug day-bucket if the
 * number ever needs to be defensible.
 */
export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Only published posts are countable — otherwise this endpoint confirms
    // whether an unpublished slug exists.
    const post = await prisma.post.findFirst({
        where: { slug, ...publishedWhere() },
        select: { id: true },
    });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await prisma.post.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
        select: { views: true },
    });

    return NextResponse.json({ views: updated.views });
}
