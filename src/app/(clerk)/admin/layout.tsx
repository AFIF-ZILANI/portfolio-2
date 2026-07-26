import Link from "next/link";
import { notFound } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Terminal } from "lucide-react";
import { isAdmin } from "@/lib/admin";

export const metadata = {
    title: "Admin",
    robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // Middleware proves someone is signed in; this proves it's *the* admin.
    // 404 rather than 403 — no reason to confirm the route exists to a stranger.
    if (!(await isAdmin())) notFound();

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8 font-mono text-sm">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-primary font-bold text-lg"
                        >
                            <Terminal size={20} />
                            <span>afif@admin</span>
                        </Link>
                        <Link
                            href="/admin/blogs"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            /posts
                        </Link>
                        <Link
                            href="/admin/series"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            /series
                        </Link>
                        <Link
                            href="/blogs"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            /view-site
                        </Link>
                    </div>
                    <UserButton />
                </div>
            </header>
            <main className="container mx-auto px-6 py-10">{children}</main>
        </div>
    );
}
