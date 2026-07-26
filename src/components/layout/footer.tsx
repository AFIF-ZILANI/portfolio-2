import { SocialIconGlyph } from "@/lib/icons";
import type { SocialLink } from "@/lib/site-data";

/**
 * Previously hardcoded four icons and the name. Now driven by site content, so
 * adding a social link in the admin panel shows up here.
 */
export function Footer({ name, socialLinks }: { name: string; socialLinks: SocialLink[] }) {
    return (
        <footer className="border-t border-border bg-card py-8 mt-20">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
                <div className="text-muted-foreground font-mono text-sm mb-4 md:mb-0">
                    © {new Date().getFullYear()} {name}. All rights reserved.
                </div>
                <div className="flex items-center gap-6 flex-wrap justify-center">
                    {socialLinks.map((link) => (
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
