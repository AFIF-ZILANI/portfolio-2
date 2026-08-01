"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/layout/section-heading";
import { Github, ExternalLink } from "lucide-react";
import Image from "next/image";
import type { ResolvedProject } from "@/lib/site-data";

/**
 * Featured work as a two-column grid of cards.
 *
 * Three things the alternating full-width rows were doing wrong:
 *
 * Every card was labelled "Featured Project", under a heading that already says
 * Featured Projects. A label carried by every item distinguishes none of them.
 *
 * Odd rows right-aligned their prose, which gives body copy a ragged left edge —
 * the edge a reader returns to on every line.
 *
 * A `bg-primary/20` wash sat over each screenshot. Those screenshots are the
 * evidence the work exists; tinting them green hid the one thing this section is
 * for.
 *
 * The grid also costs one screen instead of four, and reuses the card language
 * that posts and events already share.
 */
export function Projects({ projects }: { projects: ResolvedProject[] }) {
    const featured = projects.filter((p) => p.featured);

    return (
        <section id="projects" className="py-24 bg-card/30 border-y border-border">
            <div className="container mx-auto px-6 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                >
                    <SectionHeading path="~/projects/" title="Featured Projects" />

                    <div className="grid md:grid-cols-2 gap-6">
                        {featured.map((project, i) => (
                            <motion.article
                                key={project.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.4, delay: Math.min(i, 3) * 0.08 }}
                                className="group flex flex-col bg-background border border-border hover:border-primary transition-colors duration-300"
                            >
                                <div className="relative w-full aspect-video bg-muted overflow-hidden border-b border-border">
                                    {project.coverImage ? (
                                        <Image
                                            src={project.coverImage.url}
                                            alt={
                                                project.coverImage.alt ||
                                                `${project.title} — project by Afif Zilani`
                                            }
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover object-top"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 grid place-items-center font-mono text-sm text-muted-foreground">
                                            {project.title.toLowerCase().replace(/\s+/g, "_")}.png
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex flex-col gap-4 flex-1">
                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                        {project.title}
                                    </h3>

                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {project.description}
                                    </p>

                                    {project.tech.length > 0 && (
                                        <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-primary mt-auto">
                                            {project.tech.map((tech) => (
                                                <li key={tech}>{tech}</li>
                                            ))}
                                        </ul>
                                    )}

                                    {(project.live || project.github) && (
                                        <div className="flex gap-5 border-t border-border">
                                            {/* Named rather than bare icons: the two links go to
                                                different places, and an icon alone does not say
                                                which. */}
                                            {project.live && (
                                                <a
                                                    href={project.live}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 pt-3"
                                                >
                                                    <ExternalLink size={14} />
                                                    live site
                                                    <span className="sr-only">
                                                        {" "}
                                                        for {project.title}
                                                    </span>
                                                </a>
                                            )}
                                            {project.github && (
                                                <a
                                                    href={project.github}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 pt-3"
                                                >
                                                    <Github size={14} />
                                                    source
                                                    <span className="sr-only">
                                                        {" "}
                                                        for {project.title}
                                                    </span>
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
