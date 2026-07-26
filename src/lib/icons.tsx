import type { ComponentType } from "react";
import { Globe, Mail } from "lucide-react";
import {
    FaDiscord,
    FaFacebook,
    FaGithub,
    FaInstagram,
    FaLinkedin,
    FaReddit,
    FaThreads,
    FaXTwitter,
} from "react-icons/fa6";
import {
    SiBun,
    SiC,
    SiCplusplus,
    SiDocker,
    SiDrizzle,
    SiExpress,
    SiFastapi,
    SiGit,
    SiGithub,
    SiGithubactions,
    SiGnubash,
    SiGo,
    SiGraphql,
    SiHashnode,
    SiHono,
    SiHuggingface,
    SiJavascript,
    SiKotlin,
    SiKubernetes,
    SiLinux,
    SiMongodb,
    SiMysql,
    SiNestjs,
    SiNextdotjs,
    SiNginx,
    SiNodedotjs,
    SiOrcid,
    SiPostgresql,
    SiPrisma,
    SiPython,
    SiReact,
    SiRedis,
    SiRust,
    SiSqlite,
    SiStackoverflow,
    SiSupabase,
    SiSvelte,
    SiSwift,
    SiTailwindcss,
    SiTypescript,
    SiVercel,
    SiVite,
    SiVuedotjs,
    SiBluesky,
} from "react-icons/si";
import type { SocialIcon } from "@/lib/site-data";

type IconComponent = ComponentType<{ size?: number; className?: string }>;

/** Maps SocialLink.icon to a component. Every SocialIcon key must appear here. */
export const SOCIAL_ICONS: Record<SocialIcon, IconComponent> = {
    github: FaGithub,
    linkedin: FaLinkedin,
    twitter: FaXTwitter,
    email: Mail,
    discord: FaDiscord,
    bluesky: SiBluesky,
    instagram: FaInstagram,
    threads: FaThreads,
    orcid: SiOrcid,
    "stack-overflow": SiStackoverflow,
    reddit: FaReddit,
    facebook: FaFacebook,
    hashnode: SiHashnode,
    website: Globe,
    huggingface: SiHuggingface,
};

export const SOCIAL_ICON_KEYS = Object.keys(SOCIAL_ICONS) as SocialIcon[];

/**
 * Curated skill icons, keyed by their react-icons/si export name.
 *
 * ponytail: an explicit map rather than a dynamic lookup over all of react-icons.
 * A dynamic import would pull thousands of icons into the bundle and typos would
 * fail silently. Adding one here is a single line.
 */
export const SKILL_ICONS: Record<string, IconComponent> = {
    // Languages
    SiTypescript,
    SiJavascript,
    SiPython,
    SiGo,
    SiRust,
    SiKotlin,
    SiSwift,
    SiC,
    SiCplusplus,
    SiGnubash,
    // Web
    SiReact,
    SiNextdotjs,
    SiVuedotjs,
    SiSvelte,
    SiTailwindcss,
    SiNodedotjs,
    SiHono,
    SiExpress,
    SiNestjs,
    SiFastapi,
    SiBun,
    SiVite,
    SiGraphql,
    // DevOps
    SiDocker,
    SiKubernetes,
    SiLinux,
    SiNginx,
    SiGit,
    SiGithub,
    SiGithubactions,
    SiVercel,
    // Data
    SiPostgresql,
    SiMysql,
    SiMongodb,
    SiSqlite,
    SiRedis,
    SiPrisma,
    SiDrizzle,
    SiSupabase,
};

export const SKILL_ICON_NAMES = Object.keys(SKILL_ICONS).sort();

/** Renders a skill icon, or nothing if the stored name isn't in the map. */
export function SkillIcon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
    const Icon = SKILL_ICONS[name];
    return Icon ? <Icon size={size} className={className} /> : null;
}

/** Renders a social icon, or nothing if the stored key isn't in the map. */
export function SocialIconGlyph({
    name,
    size = 20,
    className,
}: {
    name: string;
    size?: number;
    className?: string;
}) {
    const Icon = SOCIAL_ICONS[name as SocialIcon];
    return Icon ? <Icon size={size} className={className} /> : null;
}
