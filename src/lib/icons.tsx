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
import { SiBluesky, SiHashnode, SiHuggingface, SiOrcid, SiStackoverflow } from "react-icons/si";
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
