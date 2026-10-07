import Link from "next/link";
import { SocialIconGlyph } from "@/lib/icons";
import type { SocialIcon, SocialLink } from "@/lib/site-data";

/**
 * Only these, in this order — the profiles a farm's buyers and partners actually
 * use. URLs still come from site content, so editing a link in the admin panel
 * updates it here; only which ones appear is fixed.
 */
const FOOTER_ICONS: SocialIcon[] = ["facebook", "linkedin", "instagram", "twitter", "email"];

export function Footer({ name, socialLinks }: { name: string; socialLinks: SocialLink[] }) {
    const links = FOOTER_ICONS.map((icon) => socialLinks.find((l) => l.icon === icon)).filter(
        (l): l is SocialLink => Boolean(l?.href)
    );

    return (
        <footer className="border-t border-border bg-background py-10">
            <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <Link href="/" className="font-display text-lg font-semibold">
                        {name}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Co-Founder & CEO, ZeroD Farm · Naogaon, Bangladesh
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        © {new Date().getFullYear()} {name}
                    </p>
                </div>
                <ul className="flex items-center gap-2">
                    {links.map((link) => {
                        const external = !link.href.startsWith("mailto:");
                        return (
                            <li key={link.id}>
                                <a
                                    href={link.href}
                                    aria-label={link.label.replace(/\/$/, "")}
                                    {...(external
                                        ? { target: "_blank", rel: "noopener noreferrer me" }
                                        : {})}
                                    className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                                >
                                    <SocialIconGlyph name={link.icon} size={18} />
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </footer>
    );
}
