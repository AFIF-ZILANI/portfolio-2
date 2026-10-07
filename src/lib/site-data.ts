/**
 * The shape of everything the public site renders, plus the built-in defaults.
 *
 * These defaults are no longer what the site displays directly — the live values
 * come from the SiteContent row in Postgres (see src/lib/site-content.ts) and are
 * edited at /admin/site/*. They remain the fallback for a fresh database and for
 * any field a stored record is missing, so the site always renders.
 */

import { staticImage, type ImageRef } from "@/lib/image-utils";

export type Experience = {
    id: string;
    company: string;
    role: string;
    period: string;
    description: string;
};

/** Keys must exist in SOCIAL_ICONS (src/lib/icons.tsx) or the link renders no icon. */
export type SocialIcon =
    | "github"
    | "linkedin"
    | "twitter"
    | "email"
    | "discord"
    | "bluesky"
    | "instagram"
    | "threads"
    | "orcid"
    | "stack-overflow"
    | "reddit"
    | "facebook"
    | "hashnode"
    | "website"
    | "huggingface";

export type SocialLink = {
    id: string;
    label: string;
    href: string;
    icon: SocialIcon;
};

export type SiteStats = {
    key: string;
    value: string;
    label: string;
};

export type ContactInfo = {
    heading: string;
    /** Where the contact form delivers. Falls back to CONTACT_EMAIL when blank. */
    email: string;
};

/** What is stored in the SiteContent row: images are Image ids, not URLs. */
export type SiteData = {
    name: string;
    title: string;
    tagline: string;
    bio: string[];
    heroImageId: string;
    aboutImageId: string;
    socialLinks: SocialLink[];
    experiences: Experience[];
    stats: SiteStats[];
    contact: ContactInfo;
};

/**
 * What the site renders: the same data with every image id resolved to a real
 * image. This is what `getSiteData()` returns — components read `heroImage.url`
 * and `heroImage.alt`, admin editors read `heroImage.id` to know the selection.
 */
export type ResolvedSiteData = Omit<SiteData, "heroImageId" | "aboutImageId"> & {
    heroImage: ImageRef;
    aboutImage: ImageRef;
};

/**
 * Portraits that ship in the repo. They remain the fallback for a fresh database,
 * carrying the alt text the components used to hardcode — so the entity-rich alt
 * survives even before anything is uploaded.
 */
export const DEFAULT_HERO_IMAGE = staticImage(
    "/afifzilani-profile.webp",
    "Afif Zilani (Kazi Afif Zilani), Co-Founder and CEO of ZeroD Farm, Naogaon, Bangladesh"
);
export const DEFAULT_ABOUT_IMAGE = staticImage(
    "/afifzilani-about.webp",
    "Kazi Afif Zilani, founder of ZeroD Farm, a poultry farm in Naogaon, Bangladesh"
);

export const DEFAULT_SITE_DATA: SiteData = {
    name: "Afif Zilani",
    title: "Co-Founder & CEO, ZeroD Farm",
    tagline:
        "I run ZeroD Farm, a poultry farm in Naogaon, Bangladesh. My work is healthy flocks, disciplined day-to-day operations, and growing the farm into a business people can rely on.",
    bio: [
        "I'm Kazi Afif Zilani, an entrepreneur from Naogaon, Bangladesh. In 2022 I co-founded ZeroD Farm, and running it is now my full-time focus.",
        "Day to day that means flock health and biosecurity, feed and supply management, coordinating the people who work on the farm, and planning how the business grows from here.",
        "If you buy poultry, supply feed or equipment, or want to partner with a farm that takes its operations seriously, I'd like to hear from you.",
    ],
    // Empty means "no stored selection", which resolves to the repo portraits above.
    heroImageId: "",
    aboutImageId: "",
    socialLinks: [
        { id: "1", label: "GitHub", href: "https://github.com/AFIF-ZILANI", icon: "github" },
        {
            id: "2",
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/afifzilani",
            icon: "linkedin",
        },
        {
            id: "3",
            label: "Stack Overflow",
            href: "https://stackoverflow.com/users/22881891/afif-zilani",
            icon: "stack-overflow",
        },
        {
            id: "4",
            label: "ORCID",
            href: "https://orcid.org/0009-0005-0673-3154",
            icon: "orcid",
        },
        { id: "5", label: "Hashnode", href: "https://hashnode.com/@afifzilani", icon: "hashnode" },
        { id: "6", label: "X", href: "https://x.com/afif_zilani", icon: "twitter" },
        {
            id: "7",
            label: "Bluesky",
            href: "https://bsky.app/profile/afif-zilani.bsky.social",
            icon: "bluesky",
        },
        {
            id: "8",
            label: "Reddit",
            href: "https://www.reddit.com/user/afifzilani",
            icon: "reddit",
        },
        { id: "9", label: "Email", href: "mailto:afifzilani4566@gmail.com", icon: "email" },
        {
            id: "10",
            label: "Hugging Face",
            href: "https://huggingface.co/afifzilani",
            icon: "huggingface",
        },
        { id: "11", label: "afifzilani.link", href: "https://afifzilani.link", icon: "website" },
        {
            id: "12",
            label: "Instagram",
            href: "https://instagram.com/afif.zilani",
            icon: "instagram",
        },
        {
            id: "13",
            label: "Facebook",
            href: "https://facebook.com/AFIF.ZILANI00",
            icon: "facebook",
        },
        { id: "14", label: "Threads", href: "https://threads.com/afif.zilani", icon: "threads" },
    ],
    experiences: [
        {
            id: "1",
            company: "ZeroD Farm",
            role: "Co-Founder & CEO",
            period: "2022 — Present",
            description:
                "Co-founded and run ZeroD Farm, a poultry farm in Naogaon. Responsible for flock health and biosecurity, daily operations, workforce, feed and supply management, and the farm's growth plan.",
        },
    ],
    // Only facts that are true by definition. Real operating numbers (flock size,
    // batches per year, buyers served) belong here once they're entered in the admin.
    stats: [
        { key: "founded", value: "2022", label: "ZeroD Farm founded" },
        { key: "location", value: "Naogaon", label: "Rajshahi Division, Bangladesh" },
        { key: "focus", value: "Poultry", label: "full-time, one business" },
    ],
    contact: {
        heading: "Work with ZeroD Farm",
        email: "",
    },
};
