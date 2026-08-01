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

/** `icon` is a react-icons/si export name; see SKILL_ICONS in src/lib/icons.tsx. */
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
    "/afifzilani-profile.webp",
    "Afif Zilani (Kazi Afif Zilani) — Full-Stack Developer and Co-Founder of ZeroD, Naogaon, Bangladesh"
);
export const DEFAULT_ABOUT_IMAGE = staticImage(
    "/afifzilani-about.webp",
    "Kazi Afif Zilani (AFIF ZILANI) — Entrepreneur and Full-Stack Developer from Naogaon, Bangladesh"
);

export const DEFAULT_SITE_DATA: SiteData = {
    name: "AFIF ZILANI",
    title: "Full-Stack Developer.",
    tagline:
        "I engineer high-performance systems and build precise, scalable digital experiences. Obsessed with clean code, elegant architecture, and shipping products that work flawlessly.",
    bio: [
        "Passionate engineer who thrives at the intersection of",
        "backend logic and polished UIs. Started with automation",
        "scripts, evolved into architecting scalable systems.",
        "Building accessible, human-centered products and",
        "exploring distributed systems + modern web architecture.",
        "Open to work — let's build something great.",
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
            id: "1",
            company: "ZeroD Farms",
            role: "Co-Founder & CEO",
            period: "2022 — Present",
            description:
                "Co-founded and managing ZeroD Farms with a focus on sustainable poultry farming, operational management, and long-term business growth. Overseeing daily farm operations, workforce coordination, supply management, and business expansion strategies.",
        },
        {
            id: "2",
            company: "ZeroD Umb",
            role: "Co-Founder",
            period: "Mar 4, 2023 — Present",
            description:
                "Building the foundation and long-term vision of the ZeroD ecosystem. Working on business planning, branding, digital infrastructure, and future technology-driven initiatives across multiple sectors including software, AI, and social impact projects.",
        },
        {
            id: "3",
            company: "ZeroD Agencies",
            role: "Co-Founder & Full-Stack Developer",
            period: "Mar 28, 2026 — Present",
            description:
                "Developing scalable websites and web applications for clients using React, Next.js, Golang, PostgreSQL, Tailwind CSS, and Redis. Handling frontend architecture, backend APIs, authentication systems, database design, deployment pipelines, and overall product engineering.",
        },
    ],
    stats: [
        { key: "experience", value: "5+", label: "years" },
        { key: "projects", value: "40+", label: "shipped" },
        { key: "stack", value: "15+", label: "technologies" },
        { key: "commits", value: "1k+", label: "contributions" },
    ],
    // Mirrors the list that was hardcoded in skills.tsx, with icons as react-icons
    // export names so they can be edited and stored.
    skills: [
        { id: "s1", name: "TypeScript", category: "Languages", icon: "SiTypescript" },
        { id: "s2", name: "JavaScript", category: "Languages", icon: "SiJavascript" },
        { id: "s3", name: "Python", category: "Languages", icon: "SiPython" },
        { id: "s4", name: "Go", category: "Languages", icon: "SiGo" },
        { id: "s5", name: "Rust", category: "Languages", icon: "SiRust" },
        { id: "s6", name: "Kotlin", category: "Languages", icon: "SiKotlin" },
        { id: "s7", name: "C", category: "Languages", icon: "SiC" },
        { id: "s8", name: "C++", category: "Languages", icon: "SiCplusplus" },
        { id: "s9", name: "React", category: "WebDev", icon: "SiReact" },
        { id: "s10", name: "Next.js", category: "WebDev", icon: "SiNextdotjs" },
        { id: "s11", name: "Tailwind CSS", category: "WebDev", icon: "SiTailwindcss" },
        { id: "s12", name: "Node.js", category: "WebDev", icon: "SiNodedotjs" },
        { id: "s13", name: "Hono", category: "WebDev", icon: "SiHono" },
        { id: "s14", name: "Express.js", category: "WebDev", icon: "SiExpress" },
        { id: "s15", name: "Bun.js", category: "WebDev", icon: "SiBun" },
        { id: "s16", name: "Docker", category: "DevOps", icon: "SiDocker" },
        { id: "s17", name: "Linux", category: "DevOps", icon: "SiLinux" },
        { id: "s18", name: "Git", category: "DevOps", icon: "SiGit" },
        { id: "s19", name: "Git Hub", category: "DevOps", icon: "SiGithub" },
        { id: "s20", name: "PostgreSQL", category: "Database", icon: "SiPostgresql" },
        { id: "s21", name: "MongoDB", category: "Database", icon: "SiMongodb" },
        { id: "s22", name: "SQLite", category: "Database", icon: "SiSqlite" },
        { id: "s23", name: "Redis", category: "Database", icon: "SiRedis" },
        { id: "s24", name: "Drizzle ORM", category: "Database", icon: "SiDrizzle" },
        { id: "s25", name: "Prisma", category: "Database", icon: "SiPrisma" },
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
