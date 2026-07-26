type Failure = { ok: false; error: string };

/**
 * Call a Server Action and turn a thrown error into a normal failure result.
 *
 * Without this, an exception inside `startTransition(async () => …)` rejects with
 * nothing catching it: no toast, no console message, no visible change. The user
 * sees a save that simply does nothing. Every admin action call goes through here.
 */
export async function runAction<T extends { ok: boolean }>(
    fn: () => Promise<T>
): Promise<T | Failure> {
    try {
        return await fn();
    } catch (e) {
        // requireAdmin() throws this when the session no longer matches ADMIN_EMAIL.
        if (e instanceof Error && e.message === "Unauthorized") {
            return {
                ok: false,
                error: "Not authorised — your session may have expired. Reload and sign in again.",
            };
        }
        console.error("[admin action failed]", e);
        return {
            ok: false,
            error: e instanceof Error ? `Failed: ${e.message}` : "Something went wrong.",
        };
    }
}
