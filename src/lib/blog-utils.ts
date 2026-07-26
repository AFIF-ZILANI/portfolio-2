/**
 * Pure blog helpers — no Prisma import, so client components can use them.
 *
 * Keep this file dependency-free: the moment it imports `@/lib/prisma`, every
 * client component that touches it drags `pg` (and Node's `net`/`tls`) into the
 * browser bundle and the build fails.
 */

export const POSTS_PER_MINUTE = 200;

/** URL-safe slug from a title. Callers may override the result manually. */
export function slugify(input: string): string {
    return input
        .toLowerCase()
        .trim()
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/** Estimated read time in whole minutes, never zero. */
export function readingMinutes(markdown: string): number {
    const words = markdown.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / POSTS_PER_MINUTE));
}
