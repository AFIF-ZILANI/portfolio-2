import Link from "next/link";
import type { SocialIcon, SocialLink } from "@/lib/site-data";
import { SocialIconGlyph } from "@/lib/icons";
import { BackToTop, FooterWordmark } from "@/components/layout/footer-wordmark";

/** The ZeroD group's sites: fixed, they're the real domains. */
const VENTURES = [
    { label: "zerod.bd", href: "https://zerod.bd" },
    { label: "farms.zerod.bd", href: "https://farms.zerod.bd" },
    { label: "agency.zerod.bd", href: "https://agency.zerod.bd" },
];

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
        <footer className="relative overflow-hidden border-t border-border">
            <div className="container mx-auto max-w-6xl px-6 pt-16 md:pt-20">
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    <p className="col-span-2 max-w-xs text-lg font-semibold md:col-span-1 leading-snug tracking-[-0.01em] text-foreground">
                        Entrepreneur, General Manager of ZeroD Farms, programmer, and Co-Founder of
                        ZeroD Umb.
                        <span className="mt-2 block text-sm font-normal text-muted-foreground">
                            Naogaon, Bangladesh
                        </span>
                    </p>
                    <FooterColumn title="ZeroD">
                        {VENTURES.map((v) => (
                            <li key={v.href}>
                                <a href={v.href} target="_blank" rel="noopener" className={LINK}>
                                    {v.label}
                                    <span className="text-muted-foreground">↗</span>
                                </a>
                            </li>
                        ))}
                    </FooterColumn>
                    <FooterColumn title="Site">
                        <li>
                            <Link href="/blogs" className={LINK}>
                                Journal
                            </Link>
                        </li>
                        <li>
                            <Link href="/events" className={LINK}>
                                Events
                            </Link>
                        </li>
                        <li>
                            <Link href="/#contact" className={LINK}>
                                Contact
                            </Link>
                        </li>
                    </FooterColumn>
                    <FooterColumn title="Elsewhere">
                        {links.map((link) => (
                            <li key={link.id}>
                                <a
                                    href={link.href}
                                    target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                                    rel={
                                        link.href.startsWith("mailto:")
                                            ? undefined
                                            : "noopener noreferrer"
                                    }
                                    className={LINK}
                                >
                                    <SocialIconGlyph name={link.icon} size={14} />
                                    {LABELS[link.icon] ?? link.label.replace(/\/$/, "")}
                                </a>
                            </li>
                        ))}
                    </FooterColumn>
                </div>

                <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} {name}. Built in Naogaon.
                    </p>
                    <BackToTop />
                </div>

                <div className="mt-10 md:mt-14">
                    <FooterWordmark name={name} />
                </div>
            </div>
        </footer>
    );
}

const LINK =
    "inline-flex items-center gap-1.5 text-sm text-foreground transition-colors hover:text-gold-ink";

const LABELS: Partial<Record<SocialIcon, string>> = {
    github: "GitHub",
    linkedin: "LinkedIn",
    twitter: "X",
    email: "Email",
};

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <nav aria-label={title}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
                {title}
            </p>
            <ul className="mt-4 space-y-2.5">{children}</ul>
        </nav>
    );
}
