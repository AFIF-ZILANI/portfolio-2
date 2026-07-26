import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    if (isAdminRoute(req)) await auth.protect();
});

export const config = {
    // Only /admin and /signin need Clerk. The public site — the SEO-critical part —
    // never touches the middleware or ships Clerk's JS.
    // /api/admin is included so whoami and the media cleanup can read the Clerk
    // session. Note isAdminRoute above does NOT cover it: whoami must answer
    // "false" for anonymous visitors rather than redirect them to sign in.
    matcher: ["/admin/:path*", "/signin/:path*", "/api/admin/:path*"],
};
