"use client";

import { Moon, Sun, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export function Navbar() {
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    const router = useRouter();

    const scrollTo = (id: string) => {
        if (pathname !== "/") {
            router.push("/");
            // Wait for navigation and then scroll
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
            return;
        }
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <div
                    className="flex items-center gap-2 text-primary font-mono font-bold text-xl cursor-pointer"
                    onClick={() => (pathname === "/" ? scrollTo("hero") : router.push("/"))}
                >
                    <Terminal size={24} />
                    <span>afif@dev</span>
                </div>

                <div className="hidden md:flex items-center gap-8 font-mono text-sm">
                    <button
                        onClick={() => scrollTo("about")}
                        className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                        /about
                    </button>
                    <button
                        onClick={() => scrollTo("skills")}
                        className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                        /skills
                    </button>
                    <button
                        onClick={() => scrollTo("projects")}
                        className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                        /projects
                    </button>
                    <button
                        onClick={() => scrollTo("experience")}
                        className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                        /experience
                    </button>
                    {/* <Link
                        href="/events"
                        className={
                            pathname === "/events"
                                ? "text-primary"
                                : "text-muted-foreground hover:text-primary transition-colors"
                        }
                    >
                        /events
                    </Link> */}
                    <button
                        onClick={() => scrollTo("contact")}
                        className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                        /contact
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="text-muted-foreground hover:text-primary"
                    >
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </Button>

                    {/* <Link href="/dashboard">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-primary"
                        >
                            <Settings size={20} />
                        </Button>
                    </Link> */}
                </div>
            </div>
        </nav>
    );
}
