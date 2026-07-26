"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    Briefcase,
    ExternalLink,
    FileText,
    FolderGit2,
    Layers,
    Mail,
    Share2,
    User,
    Wrench,
} from "lucide-react";

const GROUPS = [
    {
        label: "Blog",
        items: [
            { href: "/admin/blogs", label: "Posts", icon: FileText },
            { href: "/admin/series", label: "Series", icon: Layers },
        ],
    },
    {
        label: "Site content",
        items: [
            { href: "/admin/site/profile", label: "Profile & bio", icon: User },
            { href: "/admin/site/social", label: "Social links", icon: Share2 },
            { href: "/admin/site/skills", label: "Skills", icon: Wrench },
            { href: "/admin/site/projects", label: "Projects", icon: FolderGit2 },
            { href: "/admin/site/experience", label: "Experience", icon: Briefcase },
            { href: "/admin/site/stats", label: "Stats", icon: BarChart3 },
            { href: "/admin/site/contact", label: "Contact", icon: Mail },
        ],
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <nav className="font-mono text-sm space-y-6">
            {GROUPS.map((group) => (
                <div key={group.label}>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-2 px-3">
                        {group.label}
                    </p>
                    <ul className="space-y-0.5">
                        {group.items.map(({ href, label, icon: Icon }) => {
                            const active = pathname === href || pathname.startsWith(`${href}/`);
                            return (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        aria-current={active ? "page" : undefined}
                                        className={`flex items-center gap-2.5 px-3 py-2 border-l-2 transition-colors ${
                                            active
                                                ? "border-primary text-primary bg-primary/5"
                                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                                        }`}
                                    >
                                        <Icon size={15} />
                                        {label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}

            <div className="pt-2 border-t border-border">
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                >
                    <ExternalLink size={15} />
                    View site
                </a>
            </div>
        </nav>
    );
}
