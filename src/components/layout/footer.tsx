import { Mail } from "lucide-react";
import { FaXTwitter, FaGithub, FaLinkedin } from "react-icons/fa6";
import { DEFAULT_SITE_DATA } from "@/lib/site-data";

export function Footer() {
    const { socialLinks } = DEFAULT_SITE_DATA;

    return (
        <footer className="border-t border-border bg-card py-8 mt-20">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
                <div className="text-muted-foreground font-mono text-sm mb-4 md:mb-0">
                    © {new Date().getFullYear()} AFIF ZILANI. All rights reserved.
                </div>
                <div className="flex items-center gap-6">
                    <a
                        href={socialLinks.find((link) => link.icon === "github")?.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                    >
                        <FaGithub size={20} />
                    </a>
                    <a
                        href={socialLinks.find((link) => link.icon === "linkedin")?.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                    >
                        <FaLinkedin size={20} />
                    </a>
                    <a
                        href={socialLinks.find((link) => link.icon === "twitter")?.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                    >
                        <FaXTwitter size={20} />
                    </a>
                    <a
                        href={socialLinks.find((link) => link.icon === "email")?.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                    >
                        <Mail size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
