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

/**
 * The portrait, hosted on Cloudinary (uploaded through /admin/media), not /public.
 * The hero renders whatever is selected at /admin/site/profile; this is the
 * fallback for that, and the fixed image for metadata, schema, sitemap and icon,
 * which don't read the database.
 */
const PORTRAIT_PATH = "v1794125968/joehmler3jqra7elnyon.webp";
const CLOUDINARY = "https://res.cloudinary.com/dqsgrsfq8/image/upload";
export const PORTRAIT = { url: `${CLOUDINARY}/${PORTRAIT_PATH}`, width: 1122, height: 1402 };
export const ABOUT_PORTRAIT = {
    url: `${CLOUDINARY}/v1794127134/jpyxcpzyfpbvjx7dyghu.webp`,
    width: 1254,
    height: 1254,
};
/** Square face crop for the app icon. */
export const PORTRAIT_SQUARE = `${CLOUDINARY}/c_fill,g_face,w_512,h_512/${PORTRAIT_PATH}`;
