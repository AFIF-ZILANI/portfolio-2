import { currentUser } from "@clerk/nextjs/server";

/**
 * Single-admin gate.
 *
 * Clerk only proves *someone* signed in — with Google OAuth that is anyone with a
 * Google account. This pins access to one address. Fails closed: if ADMIN_EMAIL is
 * unset, nobody is an admin.
 */
export async function isAdmin(): Promise<boolean> {
    const allowed = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (!allowed) return false;

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase();
    return email === allowed;
}

/**
 * Guard for Server Actions. Middleware does not cover them — actions are POST
 * endpoints callable independently of the page that rendered the form — so every
 * mutation calls this itself.
 */
export async function requireAdmin(): Promise<void> {
    if (!(await isAdmin())) throw new Error("Unauthorized");
}
