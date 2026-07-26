"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

/**
 * Dashboard shortcut, revealed only to the admin.
 *
 * Asks /api/admin/whoami after mount rather than checking the session during the
 * server render — reading cookies on the homepage would force it out of static
 * rendering. Renders nothing for everyone else, and /admin is protected regardless.
 */
export function AdminLink() {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        let active = true;
        fetch("/api/admin/whoami")
            .then((r) => (r.ok ? r.json() : { admin: false }))
            .then((d: { admin?: boolean }) => {
                if (active) setIsAdmin(Boolean(d.admin));
            })
            .catch(() => {
                /* not signed in, or offline — just stay hidden */
            });
        return () => {
            active = false;
        };
    }, []);

    if (!isAdmin) return null;

    return (
        <Link
            href="/admin/blogs"
            title="Admin dashboard"
            className="flex items-center gap-1.5 px-2 py-1 border border-primary/40 text-primary hover:border-primary transition-colors font-mono text-xs"
        >
            <LayoutDashboard size={14} />
            <span className="hidden sm:inline">dashboard</span>
        </Link>
    );
}
