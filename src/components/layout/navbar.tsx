"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Moon, Sun, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { AdminLink } from "@/components/layout/admin-link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

/** Single source for the nav items, so desktop and mobile can't drift apart. */
const SECTIONS = [
    { id: "about", label: "/about" },
    { id: "skills", label: "/skills" },
    { id: "projects", label: "/projects" },
    { id: "experience", label: "/experience" },
    { id: "contact", label: "/contact" },
] as const;

export function Navbar() {
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    const router = useRouter();

    // `theme` is undefined during SSR, so the server renders one icon and the client
    // renders the other — a hydration mismatch. Hold the icon back until mounted.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const [menuOpen, setMenuOpen] = useState(false);

    const scrollTo = (id: string) => {
        setMenuOpen(false);
        if (pathname !== "/") {
            router.push(`/#${id}`);
            return;
        }
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const onBlog = pathname.startsWith("/blogs");
    const onEvents = pathname.startsWith("/events");

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <button
                    type="button"
                    aria-label="Back to top"
                    className="flex items-center gap-2 text-primary font-mono font-bold text-xl cursor-pointer"
                    onClick={() => (pathname === "/" ? scrollTo("hero") : router.push("/"))}
                >
                    <Terminal size={24} />
                    <span>afif@dev</span>
                </button>

                <div className="hidden md:flex items-center gap-8 font-mono text-sm">
                    {SECTIONS.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => scrollTo(s.id)}
                            className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        >
                            {s.label}
                        </button>
                    ))}
                    <Link
                        href="/blogs"
                        className={
                            onBlog
                                ? "text-primary"
                                : "text-muted-foreground hover:text-primary transition-colors"
                        }
                    >
                        /blogs
                    </Link>
                    <Link
                        href="/events"
                        className={
                            onEvents
                                ? "text-primary"
                                : "text-muted-foreground hover:text-primary transition-colors"
                        }
                    >
                        /events
                    </Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <AdminLink />
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Toggle theme"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="text-muted-foreground hover:text-primary"
                    >
                        {mounted && (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
                    </Button>

                    {/* Below md the links above are hidden, which previously left phone
                        visitors with no navigation at all. */}
                    <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Open menu"
                                className="md:hidden text-muted-foreground hover:text-primary"
                            >
                                <Menu size={22} />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64 font-mono">
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2 text-primary">
                                    <Terminal size={18} />
                                    afif@dev
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col px-4 pb-6">
                                {SECTIONS.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => scrollTo(s.id)}
                                        className="text-left py-3 text-muted-foreground hover:text-primary transition-colors border-b border-border"
                                    >
                                        {s.label}
                                    </button>
                                ))}
                                <Link
                                    href="/blogs"
                                    onClick={() => setMenuOpen(false)}
                                    className={`py-3 border-b border-border transition-colors ${
                                        onBlog ? "text-primary" : "text-muted-foreground hover:text-primary"
                                    }`}
                                >
                                    /blogs
                                </Link>
                                <Link
                                    href="/events"
                                    onClick={() => setMenuOpen(false)}
                                    className={`py-3 border-b border-border transition-colors ${
                                        onEvents ? "text-primary" : "text-muted-foreground hover:text-primary"
                                    }`}
                                >
                                    /events
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
