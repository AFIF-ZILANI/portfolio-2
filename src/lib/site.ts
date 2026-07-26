/**
 * The one canonical origin for the site.
 *
 * It was hardcoded as "https://afifzilani.com" in 23 places across layout,
 * sitemap, robots, and the JSON-LD — while the deployment actually 307-redirects
 * the apex to https://www.afifzilani.com. Canonical URLs, schema @ids, and
 * sitemap entries pointing at a redirect split ranking signals between two hosts.
 *
 * Set NEXT_PUBLIC_SITE_URL to whichever host actually serves 200 without
 * redirecting, and every one of those places follows. No trailing slash.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://afifzilani.com").replace(
    /\/+$/,
    ""
);

/** Absolute URL for a site-relative path. */
export const abs = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
