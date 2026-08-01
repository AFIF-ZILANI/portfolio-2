import { prisma } from "@/lib/prisma";
import { IMAGE_SELECT, type ImageRef } from "@/lib/image-utils";

// Server-side convenience: the pure helpers live in image-utils so that client
// components can import them without pulling Prisma into the browser bundle.
export { IMAGE_SELECT, staticImage, hasDimensions, type ImageRef } from "@/lib/image-utils";

/**
 * Resolve ids to images in one query.
 *
 * Returns a Map rather than an array because callers look images up by id in
 * arbitrary order — an ordered gallery, two named slots on a post, one cover per
 * project. Ids with no row are simply absent, so a deleted image degrades to a
 * missing image rather than a crash.
 */
export async function resolveImages(ids: readonly string[]): Promise<Map<string, ImageRef>> {
    const wanted = [...new Set(ids.filter(Boolean))];
    if (wanted.length === 0) return new Map();

    const rows = await prisma.image.findMany({
        where: { id: { in: wanted } },
        select: IMAGE_SELECT,
    });
    return new Map(rows.map((row) => [row.id, row]));
}

/** Resolve an ordered list, dropping ids that no longer exist. */
export async function resolveGallery(ids: readonly string[]): Promise<ImageRef[]> {
    const found = await resolveImages(ids);
    return ids.map((id) => found.get(id)).filter((img): img is ImageRef => Boolean(img));
}
