import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    if (isAdminRoute(req)) await auth.protect();
});

export const config = {
    // Only /admin and /signin need Clerk. The public site — the SEO-critical part —
    // never touches the middleware or ships Clerk's JS.
    matcher: ["/admin/:path*", "/signin/:path*"],
};
