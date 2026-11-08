/**
 * The shape of everything the public site renders, plus the built-in defaults.
 *
 * These defaults are no longer what the site displays directly — the live values
 * come from the SiteContent row in Postgres (see src/lib/site-content.ts) and are
 * edited at /admin/site/*. They remain the fallback for a fresh database and for
 * any field a stored record is missing, so the site always renders.
 */

import { staticImage, type ImageRef } from "@/lib/image-utils";
import { ABOUT_PORTRAIT, PORTRAIT } from "@/lib/site";

export type Experience = {
    id: string;
    company: string;
    role: string;
    period: string;
    description: string;
    /** The venture's site, shown as its link on the homepage. Optional: older records lack it. */
    url?: string;
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

/** `icon` is a react-icons/si export name (see SKILL_ICONS in src/lib/icons.tsx); optional, the homepage no longer shows it. */
export type Skill = {
    id: string;
    name: string;
    category: string;
    icon: string;
};

export type Project = {
    id: string;
    title: string;
    description: string;
    tech: string[];
    github: string;
    live: string;
    coverImageId: string;
    featured: boolean;
};

/** A project with its cover resolved. Null when unset or the image was deleted. */
export type ResolvedProject = Omit<Project, "coverImageId"> & { coverImage: ImageRef | null };

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
    skills: Skill[];
    projects: Project[];
    contact: ContactInfo;
};

/**
 * What the site renders: the same data with every image id resolved to a real
 * image. This is what `getSiteData()` returns — components read `heroImage.url`
 * and `heroImage.alt`, admin editors read `heroImage.id` to know the selection.
 */
export type ResolvedSiteData = Omit<SiteData, "heroImageId" | "aboutImageId" | "projects"> & {
    heroImage: ImageRef;
    aboutImage: ImageRef;
    projects: ResolvedProject[];
};

/**
 * Portraits that ship in the repo. They remain the fallback for a fresh database,
 * carrying the alt text the components used to hardcode — so the entity-rich alt
 * survives even before anything is uploaded.
 */
export const DEFAULT_HERO_IMAGE = staticImage(
    PORTRAIT.url,
    "Afif Zilani (Kazi Afif Zilani) — entrepreneur, General Manager of ZeroD Farms and Co-Founder of ZeroD, Naogaon, Bangladesh"
);
export const DEFAULT_ABOUT_IMAGE = staticImage(
    ABOUT_PORTRAIT.url,
    "Kazi Afif Zilani (AFIF ZILANI) — business owner and programmer from Naogaon, Bangladesh"
);

export const DEFAULT_SITE_DATA: SiteData = {
    name: "AFIF ZILANI",
    // The hero rotates through these: split on " · ".
    title: "Entrepreneur · General Manager, ZeroD Farms · Programmer · Co-Founder, ZeroD Umb",
    tagline:
        "I run a poultry farm, build software for Bangladeshi businesses, and grow ZeroD, the group that holds them both. Based in Naogaon, Bangladesh.",
    bio: [
        "I'm Kazi Afif Zilani, a business owner from Naogaon, Bangladesh. I co-founded ZeroD, a small group of companies that put good systems to work on real problems.",
        "As General Manager of ZeroD Farms I run a family poultry operation in Mahadebpur: five sheds, a 10,000-bird capacity, and every batch tracked from chick to sale.",
        "I'm also a programmer. Through ZeroD Agency I design and build websites and web apps for local businesses, from the database to the last pixel.",
    ],
    // Empty means "no stored selection", which resolves to the repo portraits above.
    heroImageId: "",
    aboutImageId: "",
    socialLinks: [
        { id: "1", label: "github/", href: "https://github.com/AFIF-ZILANI", icon: "github" },
        {
            id: "2",
            label: "linkedin/",
            href: "https://www.linkedin.com/in/afifzilani",
            icon: "linkedin",
        },
        {
            id: "3",
            label: "stack-overflow/",
            href: "https://stackoverflow.com/users/22881891/afif-zilani",
            icon: "stack-overflow",
        },
        {
            id: "4",
            label: "orcid/",
            href: "https://orcid.org/0009-0005-0673-3154",
            icon: "orcid",
        },
        { id: "5", label: "hashnode/", href: "https://hashnode.com/@afifzilani", icon: "hashnode" },
        { id: "6", label: "x/", href: "https://x.com/afif_zilani", icon: "twitter" },
        {
            id: "7",
            label: "bluesky/",
            href: "https://bsky.app/profile/afif-zilani.bsky.social",
            icon: "bluesky",
        },
        {
            id: "8",
            label: "reddit/",
            href: "https://www.reddit.com/user/afifzilani",
            icon: "reddit",
        },
        { id: "9", label: "email/", href: "mailto:afifzilani4566@gmail.com", icon: "email" },
        {
            id: "10",
            label: "huggingface/",
            href: "https://huggingface.co/afifzilani",
            icon: "huggingface",
        },
        { id: "11", label: "afifzilani.link/", href: "https://afifzilani.link", icon: "website" },
        {
            id: "12",
            label: "instagram/",
            href: "https://instagram.com/afif.zilani",
            icon: "instagram",
        },
        {
            id: "13",
            label: "facebook/",
            href: "https://facebook.com/AFIF.ZILANI00",
            icon: "facebook",
        },
        { id: "14", label: "threads/", href: "https://threads.com/afif.zilani", icon: "threads" },
    ],
    experiences: [
        {
            id: "2",
            company: "ZeroD Umb",
            role: "Co-Founder",
            period: "Mar 2023 — Present",
            description:
                "The umbrella that holds the ZeroD companies. I set its direction, brand, and shared infrastructure, and decide where the group goes next: software, agriculture, and social-impact work.",
            url: "https://zerod.bd",
        },
        {
            id: "1",
            company: "ZeroD Farms",
            role: "General Manager",
            period: "2022 — Present",
            description:
                "A family-run poultry farm in Mahadebpur, Naogaon. I manage daily operations, the team, feed and supply, and sales across five sheds with a 10,000-bird capacity, raising around 5,000 birds a month.",
            url: "https://farms.zerod.bd",
        },
        {
            id: "3",
            company: "ZeroD Agency",
            role: "Co-Founder & Lead Developer",
            period: "Mar 2026 — Present",
            description:
                "Websites and web apps for Bangladeshi businesses, delivered in about a week. I lead the engineering: Next.js, Go, PostgreSQL, and Redis, from architecture to deployment.",
            url: "https://agency.zerod.bd",
        },
    ],
    stats: [
        { key: "ventures", value: "3", label: "companies" },
        { key: "capacity", value: "10k", label: "bird capacity" },
        { key: "experience", value: "5+", label: "years building" },
        { key: "delivery", value: "7", label: "day site delivery" },
    ],
    // Broad capabilities, not a tool list: the homepage shows these as two cards.
    skills: [
        { id: "s1", name: "Business leadership", category: "Business", icon: "" },
        { id: "s2", name: "Operations management", category: "Business", icon: "" },
        { id: "s3", name: "Strategy and planning", category: "Business", icon: "" },
        { id: "s4", name: "Team building", category: "Business", icon: "" },
        { id: "s5", name: "Sales and partnerships", category: "Business", icon: "" },
        { id: "s6", name: "Full-stack web development", category: "Technology", icon: "" },
        { id: "s7", name: "Software architecture", category: "Technology", icon: "" },
        { id: "s8", name: "Databases and backend systems", category: "Technology", icon: "" },
        { id: "s9", name: "Cloud and deployment", category: "Technology", icon: "" },
        { id: "s10", name: "Product and UX design", category: "Technology", icon: "" },
    ],
    projects: [
        {
            id: "p1",
            title: "Takify",
            description:
                "A web application focused on streamlined workflows with a clean UI, fast navigation, and responsive design principles.",
            tech: ["React", "Next.js", "Tailwind CSS"],
            github: "",
            live: "https://takify.lovable.app/",
            coverImageId: "",
            featured: true,
        },
        {
            id: "p2",
            title: "Zvert",
            description:
                "A modular frontend platform emphasizing reusable UI components, performance optimization, and scalable interface structure.",
            tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
            github: "",
            live: "https://zverts.com/",
            coverImageId: "",
            featured: true,
        },
        {
            id: "p3",
            title: "ZeroD Foundation",
            description:
                "A multi-sector initiative platform supporting education, healthcare, agriculture, disaster response, and community development under the ZeroD ecosystem.",
            tech: ["Next.js", "React", "Tailwind CSS"],
            github: "",
            live: "https://zerod-foundation.lovable.app/#",
            coverImageId: "",
            featured: true,
        },
        {
            id: "p4",
            title: "ZeroD Portfolio",
            description:
                "A central portfolio and operations dashboard for ZeroD projects, providing a unified overview of systems, initiatives, and infrastructure.",
            tech: ["React", "Next.js", "TypeScript", "Dashboard UI", "Tailwind CSS"],
            github: "",
            live: "https://zerod.vercel.app",
            coverImageId: "",
            featured: true,
        },
    ],
    contact: {
        heading: "Get In Touch",
        email: "",
    },
};
