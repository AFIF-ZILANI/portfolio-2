import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";

// Never cached — the answer depends on the caller's session.
export const dynamic = "force-dynamic";

/**
 * Tells the navbar whether to reveal the dashboard link.
 *
 * This exists so the homepage can stay statically rendered: reading cookies during
 * the server render would opt / out of caching entirely. It is not a security
 * boundary — /admin enforces access on its own — just a UI hint.
 */
export async function GET() {
    return NextResponse.json({ admin: await isAdmin() }, { headers: { "Cache-Control": "no-store" } });
}
