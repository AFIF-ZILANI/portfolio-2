"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AdminLink } from "@/components/layout/admin-link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

/**
 * Single source for the nav items, so desktop and mobile can't drift apart.
 * Real hrefs ("/#about"), not onClick scrollers: they work without JavaScript,
 * from any page, open in a new tab, and are crawlable links.
 */
const LINKS = [
    { href: "/#about", label: "About" },
    { href: "/#zerod-farm", label: "ZeroD Farm" },
    { href: "/blogs", label: "Writing" },
    { href: "/events", label: "Events" },
] as const;

export function Navbar() {
    const { resolvedTheme, setTheme } = useTheme();
    const pathname = usePathname();

    // `resolvedTheme` is undefined during SSR, so hold the icon back until mounted
    // to avoid a hydration mismatch.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (href: string) => !href.startsWith("/#") && pathname.startsWith(href);

    return (
        <header className="fixed top-0 w-full z-50 bg-background/85 backdrop-blur-md border-b border-border">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
            >
                Skip to content
            </a>
            <nav
                aria-label="Main"
                className="container mx-auto px-6 h-16 flex items-center justify-between"
            >
                <Link href="/" className="font-display text-xl font-semibold tracking-tight">
                    Afif Zilani
                </Link>

                <ul className="hidden md:flex items-center gap-8 text-sm">
                    {LINKS.map((l) => (
                        <li key={l.href}>
                            <Link
                                href={l.href}
                                aria-current={isActive(l.href) ? "page" : undefined}
                                className={
                                    isActive(l.href)
                                        ? "text-primary font-medium"
                                        : "text-muted-foreground hover:text-foreground transition-colors"
                                }
                            >
                                {l.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-1 sm:gap-2">
                    <AdminLink />
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Toggle dark mode"
                        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        {mounted &&
                            (resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
                    </Button>
                    <Link
                        href="/#contact"
                        className="hidden sm:inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Contact
                    </Link>

                    <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Open menu"
                                className="md:hidden text-muted-foreground hover:text-foreground"
                            >
                                <Menu size={22} />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72">
                            <SheetHeader>
                                <SheetTitle className="font-display text-xl">
                                    Afif Zilani
                                </SheetTitle>
                            </SheetHeader>
                            <ul className="flex flex-col px-4 pb-6">
                                {[...LINKS, { href: "/#contact", label: "Contact" }].map((l) => (
                                    <li key={l.href}>
                                        <Link
                                            href={l.href}
                                            onClick={() => setMenuOpen(false)}
                                            className="block py-3 border-b border-border text-lg hover:text-primary transition-colors"
                                        >
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}
