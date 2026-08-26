/**
 * The one canonical origin for the site.
 *
 * Every canonical URL, schema @id, and sitemap entry must point at the host that
 * serves 200 without redirecting — otherwise ranking signals split across hosts.
 * Live: the apex (https://afifzilani.com) serves 200 and www 307-redirects to it,
 * so the apex is canonical and the default below matches it.
 *
 * If the canonical host ever changes, set NEXT_PUBLIC_SITE_URL to whichever host
 * serves 200 without redirecting and every one of those places follows. No
 * trailing slash.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://afifzilani.com").replace(
    /\/+$/,
    ""
);

/** Absolute URL for a site-relative path. */
export const abs = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
