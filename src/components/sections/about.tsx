import Image from "next/image";
import { SectionHeading } from "@/components/layout/section-heading";
import { SocialIconGlyph } from "@/lib/icons";
import type { ResolvedSiteData, SocialIcon } from "@/lib/site-data";

/**
 * Profiles worth showing a farm's customers and partners. The developer profiles
 * (GitHub, Stack Overflow, ORCID, Hugging Face…) stay in the Person schema's
 * sameAs so search engines still tie them to the same person, but listing all
 * fourteen here was a link dump that pointed visitors away from the business.
 */
const VISIBLE_SOCIALS: SocialIcon[] = ["facebook", "linkedin", "instagram", "twitter", "email"];

/** Display names by icon, so old stored labels like "facebook/" still read well. */
const SOCIAL_NAMES: Partial<Record<SocialIcon, string>> = {
    facebook: "Facebook",
    linkedin: "LinkedIn",
    instagram: "Instagram",
    twitter: "X",
    email: "Email",
};

export function About({ data }: { data: ResolvedSiteData }) {
    const links = VISIBLE_SOCIALS.map((icon) =>
        data.socialLinks.find((l) => l.icon === icon)
    ).filter((l) => Boolean(l?.href)) as ResolvedSiteData["socialLinks"];

    return (
        <section
            id="about"
            aria-labelledby="about-heading"
            className="py-20 md:py-28 bg-card border-y border-border"
        >
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-12 md:gap-16 items-start">
                    <div className="relative aspect-square overflow-hidden rounded-[1.75rem] border border-border bg-muted">
                        <Image
                            src={data.aboutImage.url}
                            alt={data.aboutImage.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, 480px"
                            className="object-cover object-bottom"
                        />
                    </div>

                    <div>
                        <SectionHeading id="about-heading" eyebrow="About" title="Who I am" />
                        <div className="-mt-4 space-y-5 text-lg leading-relaxed text-muted-foreground">
                            {data.bio.map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                        </div>

                        {data.stats.length > 0 && (
                            <dl className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {data.stats.map((s) => (
                                    <div
                                        key={s.key}
                                        className="rounded-2xl border border-border bg-background p-5"
                                    >
                                        <dt className="text-sm text-muted-foreground">{s.label}</dt>
                                        <dd className="mt-1 font-display text-2xl font-semibold text-primary">
                                            {s.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        )}

                        {links.length > 0 && (
                            <ul className="mt-10 flex flex-wrap gap-3" aria-label="Find me online">
                                {links.map((link) => {
                                    const external = !link.href.startsWith("mailto:");
                                    return (
                                        <li key={link.id}>
                                            <a
                                                href={link.href}
                                                {...(external
                                                    ? {
                                                          target: "_blank",
                                                          rel: "noopener noreferrer me",
                                                      }
                                                    : {})}
                                                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
                                            >
                                                <SocialIconGlyph name={link.icon} size={16} />
                                                {SOCIAL_NAMES[link.icon] ??
                                                    link.label.replace(/\/$/, "")}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
