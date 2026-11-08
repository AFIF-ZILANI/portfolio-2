import Link from "next/link";
import { SocialIconGlyph } from "@/lib/icons";

/** The ZeroD group's sites: fixed, they're the real domains. */
const VENTURES = [
    { label: "zerod.bd", href: "https://zerod.bd" },
    { label: "farms.zerod.bd", href: "https://farms.zerod.bd" },
    { label: "agency.zerod.bd", href: "https://agency.zerod.bd" },
];
import type { SocialIcon, SocialLink } from "@/lib/site-data";

/**
 * The footer shows only these four, in this order. The full set still renders in
 * the About panel — a footer with fourteen icons reads as a link dump.
 *
 * URLs still come from site content, so editing a link in the admin panel updates
 * it here; only which ones appear is fixed.
 */
const FOOTER_ICONS: SocialIcon[] = ["github", "linkedin", "twitter", "email"];

export function Footer({ name, socialLinks }: { name: string; socialLinks: SocialLink[] }) {
    const links = FOOTER_ICONS.map((icon) => socialLinks.find((l) => l.icon === icon)).filter(
        (l): l is SocialLink => Boolean(l?.href)
    );

    return (
        <footer className="border-t border-border">
            <div className="container mx-auto px-6 max-w-6xl py-16">
                <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
                    <div>
                        <p className="text-3xl font-extrabold tracking-[-0.04em]">
                            Afif Zilani
                            <span
                                aria-hidden
                                className="ml-0.5 inline-block h-2 w-2 rounded-full bg-gold align-baseline"
                            />
                        </p>
                        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                            Entrepreneur, General Manager of ZeroD Farms, programmer, and Co-Founder
                            of ZeroD Umb. Naogaon, Bangladesh.
                        </p>
                    </div>
                    <nav aria-label="ZeroD companies">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            ZeroD
                        </p>
                        <ul className="mt-4 space-y-2 text-sm">
                            {VENTURES.map((v) => (
                                <li key={v.href}>
                                    <a
                                        href={v.href}
                                        target="_blank"
                                        rel="noopener"
                                        className="hover:text-primary transition-colors"
                                    >
                                        {v.label} <span className="text-muted-foreground">↗</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <nav aria-label="Site">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Site
                        </p>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/blogs"
                                    className="hover:text-primary transition-colors"
                                >
                                    Journal
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/events"
                                    className="hover:text-primary transition-colors"
                                >
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#contact"
                                    className="hover:text-primary transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="mt-16 flex flex-col-reverse gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} {name}. All rights reserved.
                    </p>
                    <div className="flex items-center gap-5">
                        {links.map((link) => (
                            <a
                                key={link.id}
                                href={link.href}
                                aria-label={link.label.replace(/\/$/, "")}
                                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                                rel={
                                    link.href.startsWith("mailto:")
                                        ? undefined
                                        : "noopener noreferrer"
                                }
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <SocialIconGlyph name={link.icon} size={18} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
