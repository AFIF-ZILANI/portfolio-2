import { SocialIconGlyph } from "@/lib/icons";
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
        <footer className="border-t border-border bg-card py-8 mt-20">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
                <div className="text-muted-foreground font-mono text-sm mb-4 md:mb-0">
                    © {new Date().getFullYear()} {name}. All rights reserved.
                </div>
                <div className="flex items-center gap-6">
                    {links.map((link) => (
                        <a
                            key={link.id}
                            href={link.href}
                            aria-label={link.label.replace(/\/$/, "")}
                            target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                            rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <SocialIconGlyph name={link.icon} size={20} />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
