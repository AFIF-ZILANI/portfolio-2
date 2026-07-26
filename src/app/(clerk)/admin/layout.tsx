import Link from "next/link";
import { notFound } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Terminal } from "lucide-react";
import { isAdmin } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

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
                    <Link
                        href="/admin/blogs"
                        className="flex items-center gap-2 text-primary font-mono font-bold text-lg"
                    >
                        <Terminal size={20} />
                        <span>afif@admin</span>
                    </Link>
                    <UserButton />
                </div>
            </header>

            <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
                <aside className="md:w-56 shrink-0 md:sticky md:top-24 md:self-start">
                    <AdminSidebar />
                </aside>
                <main className="min-w-0 flex-1">{children}</main>
            </div>
        </div>
    );
}
