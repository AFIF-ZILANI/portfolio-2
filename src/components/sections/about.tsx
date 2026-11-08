"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeading } from "@/components/layout/section-heading";
import { SocialIconGlyph } from "@/lib/icons";
import type { ResolvedSiteData } from "@/lib/site-data";

const EASE = [0.22, 1, 0.36, 1] as const;

export function About({ data }: { data: ResolvedSiteData }) {
    const photo = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: photo, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

    // Older records store the bio as short wrapped lines (it was a terminal);
    // newer ones as paragraphs. Join short lines so both read as prose.
    const paragraphs = data.bio.every((l) => l.length < 70) ? [data.bio.join(" ")] : data.bio;

    return (
        <section id="about" className="py-24 md:py-32 border-t border-border">
            <div className="container mx-auto px-6 max-w-6xl">
                <SectionHeading
                    eyebrow="About"
                    title="Building businesses, and the systems that run them."
                />

                <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-12 md:gap-16 items-start">
                    <div
                        ref={photo}
                        className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-card"
                    >
                        <motion.div className="absolute inset-[-10%]" style={{ y }}>
                            <Image
                                src={data.aboutImage.url}
                                alt={data.aboutImage.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, 480px"
                                className="object-cover"
                                data-testid="img-profile-about"
                            />
                        </motion.div>
                    </div>

                    <div>
                        <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
                            {paragraphs.map((p, i) => (
                                <motion.p
                                    key={i}
                                    className={
                                        i === 0
                                            ? "text-foreground text-xl md:text-2xl leading-snug"
                                            : ""
                                    }
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                                >
                                    {p}
                                </motion.p>
                            ))}
                        </div>

                        <ul className="mt-10 flex flex-wrap gap-2">
                            {data.socialLinks.map((link) => (
                                <li key={link.id}>
                                    <a
                                        href={link.href}
                                        target={
                                            link.href.startsWith("mailto:") ? undefined : "_blank"
                                        }
                                        rel={
                                            link.href.startsWith("mailto:")
                                                ? undefined
                                                : "noopener noreferrer"
                                        }
                                        className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                                        data-testid={`link-about-${link.label.replace("/", "")}`}
                                    >
                                        <SocialIconGlyph name={link.icon} size={13} />
                                        {link.label.replace(/\/$/, "")}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
