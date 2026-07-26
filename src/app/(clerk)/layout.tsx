import { ClerkProvider } from "@clerk/nextjs";

/**
 * Clerk is scoped to this route group (/admin and /signin) instead of the root
 * layout, so the public, SEO-critical pages never ship the auth bundle.
 * Route groups don't affect URLs.
 */
export default function ClerkLayout({ children }: { children: React.ReactNode }) {
    return <ClerkProvider>{children}</ClerkProvider>;
}
