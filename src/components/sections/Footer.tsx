import React from "react";
import { Separator } from "../ui/separator";
import { FaXTwitter, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary-foreground text-primary h-auto py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Brand & Description */}
                <div>
                    <h2 className="text-2xl font-bold mb-2">ZeroD</h2>
                    <p className="text-sm text-muted-foreground">
                        Building impactful web experiences with modern technologies and thoughtful
                        design.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
                    <ul className="space-y-1">
                        <li>
                            <a href="/about" className="hover:underline">
                                About Us
                            </a>
                        </li>
                        <li>
                            <a href="/projects" className="hover:underline">
                                Projects
                            </a>
                        </li>
                        <li>
                            <a href="/blog" className="hover:underline">
                                Blog
                            </a>
                        </li>
                        <li>
                            <a href="/contact" className="hover:underline">
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Social & Contact */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Connect with Us</h3>
                    <div className="flex space-x-4 mb-4 text-xl">
                        <a
                            href="https://twitter.com/afif_zilani"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="X/Twitter"
                        >
                            <FaXTwitter className="hover:text-accent" />
                        </a>
                        <a
                            href="https://instagram.com/afif_zilani"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Instagram"
                        >
                            <FaInstagram className="hover:text-accent" />
                        </a>
                        <a
                            href="https://linkedin.com/in/afifzilani"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn"
                        >
                            <FaLinkedin className="hover:text-accent" />
                        </a>
                        <a
                            href="https://github.com/afifzilani"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub"
                        >
                            <FaGithub className="hover:text-accent" />
                        </a>
                        <a
                            href="https://facebook.com/afifzilani"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Facebook"
                        >
                            <FaFacebook className="hover:text-accent" />
                        </a>
                    </div>
                    <p className="text-sm flex items-center">
                        <IoIosMail className="mr-2" />
                        <a href="mailto:afifzilani4566@gmail.com" className="hover:underline">
                            afifzilani4566@gmail.com
                        </a>
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <Separator />
                <p className="text-center text-xs text-muted-foreground mt-4">
                    &copy; {currentYear} AFIF ZILANI. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
