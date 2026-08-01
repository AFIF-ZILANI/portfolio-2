/**
 * Image types and pure helpers.
 *
 * Split from images.ts for the same reason blog-utils is split from blog: client
 * components need `ImageRef` and the static fallbacks, and importing those from a
 * module that touches Prisma would drag the client into the browser bundle.
 */

export type ImageRef = {
    id: string;
    url: string;
    alt: string;
    caption: string | null;
    width: number;
    height: number;
};

/** The only columns anything outside the media manager needs. */
export const IMAGE_SELECT = {
    id: true,
    url: true,
    alt: true,
    caption: true,
    width: true,
    height: true,
} as const;

/**
 * An image that lives in the repo rather than the database — the built-in fallback
 * so a fresh database still renders a complete page. `id: ""` marks it as having no
 * row, which is also what an unset reference resolves to.
 */
export const staticImage = (url: string, alt: string): ImageRef => ({
    id: "",
    url,
    alt,
    caption: null,
    width: 0,
    height: 0,
});

/**
 * Props for next/image that avoid layout shift when the dimensions are known.
 *
 * A stored 0 means the dimensions were never captured (a static file, or a row
 * that predates them), in which case the caller's own sizing has to stand.
 */
export const hasDimensions = (image: ImageRef) => image.width > 0 && image.height > 0;
