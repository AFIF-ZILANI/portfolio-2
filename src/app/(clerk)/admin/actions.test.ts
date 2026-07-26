/**
 * Exercises the real Server Actions against the real database.
 *
 * Only the two framework boundaries are stubbed: the admin gate (needs a Clerk
 * request context) and revalidatePath (needs a Next render context). Everything
 * else — validation, slug handling, Prisma writes — is the production code path.
 *
 * Run with: bun test src/app/\(clerk\)/admin/actions.test.ts
 */
import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";

mock.module("@/lib/admin", () => ({
    isAdmin: async () => true,
    requireAdmin: async () => {},
}));

const revalidated: string[] = [];
mock.module("next/cache", () => ({
    revalidatePath: (p: string) => revalidated.push(p),
}));

const { savePost, deletePost, upsertSeries, deleteSeries } = await import("./actions");
const { prisma } = await import("@/lib/prisma");

const PREFIX = "acttest-";

const base = {
    title: "Action Test Post",
    slug: `${PREFIX}post`,
    excerpt: "An excerpt.",
    content: "Some **markdown** body with enough words to be measured.",
    coverImage: null,
    coverAlt: null,
    ogImage: null,
    tags: ["alpha", "beta"],
    status: "PUBLISHED" as const,
    publishedAt: null,
    seoTitle: null,
    seoDescription: null,
    canonicalUrl: null,
    noindex: false,
    seriesId: null,
    seriesOrder: null,
};

async function cleanup() {
    await prisma.post.deleteMany({ where: { slug: { startsWith: PREFIX } } });
    await prisma.series.deleteMany({ where: { slug: { startsWith: PREFIX } } });
}

beforeAll(cleanup);
afterAll(cleanup);

describe("savePost", () => {
    test("creates a post and reports the slug", async () => {
        const res = await savePost(base);
        expect(res).toEqual({ ok: true, slug: `${PREFIX}post` });

        const row = await prisma.post.findUnique({ where: { slug: `${PREFIX}post` } });
        expect(row?.title).toBe("Action Test Post");
        expect(row?.tags).toEqual(["alpha", "beta"]);
        expect(row?.status).toBe("PUBLISHED");
        // Publishing with no date means "now", so it must be immediately visible.
        expect(row?.publishedAt).toBeInstanceOf(Date);
        expect(row!.publishedAt!.getTime()).toBeLessThanOrEqual(Date.now());
        expect(row?.readingMinutes).toBeGreaterThanOrEqual(1);
    });

    test("a duplicate slug reports an error instead of throwing", async () => {
        // A thrown error would reject in the client's startTransition with no
        // catch, so the user would see nothing at all.
        const res = await savePost({ ...base, title: "Another" });
        expect(res.ok).toBe(false);
        if (!res.ok) expect(res.error).toContain("already taken");
    });

    test("rejects a missing title, excerpt, or content", async () => {
        for (const patch of [{ title: "  " }, { excerpt: "" }, { content: "\n" }]) {
            const res = await savePost({ ...base, slug: `${PREFIX}x`, ...patch });
            expect(res.ok).toBe(false);
        }
    });

    test("a title with no alphanumerics is rejected, not saved with an empty slug", async () => {
        const res = await savePost({ ...base, title: "!!!", slug: "" });
        expect(res.ok).toBe(false);
    });

    test("updates an existing post and revalidates the old slug too", async () => {
        const existing = await prisma.post.findUnique({ where: { slug: `${PREFIX}post` } });
        revalidated.length = 0;

        const res = await savePost({
            ...base,
            id: existing!.id,
            slug: `${PREFIX}renamed`,
            title: "Renamed",
        });
        expect(res).toEqual({ ok: true, slug: `${PREFIX}renamed` });
        // Both URLs must be busted or the old one serves stale content forever.
        expect(revalidated).toContain(`/blogs/${PREFIX}post`);
        expect(revalidated).toContain(`/blogs/${PREFIX}renamed`);
    });

    test("a draft is stored with no publish date", async () => {
        const res = await savePost({
            ...base,
            slug: `${PREFIX}draft`,
            status: "DRAFT",
            publishedAt: null,
        });
        expect(res.ok).toBe(true);
        const row = await prisma.post.findUnique({ where: { slug: `${PREFIX}draft` } });
        expect(row?.status).toBe("DRAFT");
        expect(row?.publishedAt).toBeNull();
    });

    test("an invalid date is reported, not written", async () => {
        const res = await savePost({
            ...base,
            slug: `${PREFIX}baddate`,
            publishedAt: "not-a-date",
        });
        expect(res.ok).toBe(false);
    });
});

describe("series", () => {
    test("creates a series and returns its real id", async () => {
        const res = await upsertSeries({ title: `${PREFIX}Series` });
        expect(res.ok).toBe(true);
        if (!res.ok) return;
        // The editor selects this id straight away — a slug here would corrupt the link.
        const row = await prisma.series.findUnique({ where: { id: res.id } });
        expect(row).not.toBeNull();
        expect(res.title).toBe(`${PREFIX}Series`);
    });

    test("a post can be attached to a series", async () => {
        const series = await prisma.series.findFirst({
            where: { slug: { startsWith: PREFIX } },
        });
        const res = await savePost({
            ...base,
            slug: `${PREFIX}inseries`,
            seriesId: series!.id,
            seriesOrder: 2,
        });
        expect(res.ok).toBe(true);
        const row = await prisma.post.findUnique({ where: { slug: `${PREFIX}inseries` } });
        expect(row?.seriesId).toBe(series!.id);
        expect(row?.seriesOrder).toBe(2);
    });

    test("deleting a series keeps its posts and detaches them", async () => {
        const series = await prisma.series.findFirst({
            where: { slug: { startsWith: PREFIX } },
        });
        await deleteSeries(series!.id);
        const row = await prisma.post.findUnique({ where: { slug: `${PREFIX}inseries` } });
        expect(row).not.toBeNull();
        expect(row?.seriesId).toBeNull();
    });
});

describe("deletePost", () => {
    test("removes the post", async () => {
        const row = await prisma.post.findUnique({ where: { slug: `${PREFIX}draft` } });
        await deletePost(row!.id);
        expect(await prisma.post.findUnique({ where: { slug: `${PREFIX}draft` } })).toBeNull();
    });
});
