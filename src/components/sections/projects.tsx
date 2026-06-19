"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import Image from "next/image";
import { DEFAULT_SITE_DATA as data } from "@/lib/site-data";

export function Projects() {
    const featured = data.projects.filter((p) => p.featured);

    return (
        <section id="projects" className="py-24 bg-card/30 border-y border-border">
            <div className="container mx-auto px-6 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold mb-16 flex items-center gap-2">
                        <span className="text-primary">03.</span> Featured Projects
                    </h2>

                    <div className="space-y-24">
                        {featured.map((project, i) => (
                            <div
                                key={project.id}
                                className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
                            >
                                <motion.div
                                    className="w-full md:w-3/5 relative group cursor-pointer"
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10 duration-500" />
                                    {project.coverImage ? (
                                        <div className="relative w-full aspect-video">
                                            <Image
                                                src={project.coverImage}
                                                alt={`${project.title} — project by Afif Zilani`}
                                                fill
                                                className="object-cover border border-border group-hover:border-primary/50 transition-colors"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full aspect-video border border-border group-hover:border-primary/50 transition-colors bg-card flex items-center justify-center">
                                            <span className="font-mono text-muted-foreground text-sm">
                                                {project.title.toLowerCase().replace(/\s+/g, "_")}
                                                .png
                                            </span>
                                        </div>
                                    )}
                                </motion.div>

                                <motion.div
                                    className={`w-full md:w-2/5 flex flex-col ${i % 2 !== 0 ? "md:items-start md:text-left" : "md:items-end md:text-right"}`}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <span className="font-mono text-primary text-sm mb-2">
                                        Featured Project
                                    </span>
                                    <h3 className="text-2xl font-bold mb-4">{project.title}</h3>

                                    <div className="bg-background border border-border p-6 mb-6 relative z-20 hover:border-primary/50 transition-colors">
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>

                                    <ul
                                        className={`flex flex-wrap gap-3 font-mono text-xs text-muted-foreground mb-6 ${i % 2 !== 0 ? "justify-start" : "justify-end"}`}
                                    >
                                        {project.tech.map((tech, j) => (
                                            <li key={j} className="text-primary">
                                                {tech}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex gap-4">
                                        {project.github && (
                                            <a
                                                href={project.github}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                <Github size={20} />
                                            </a>
                                        )}
                                        {project.live && (
                                            <a
                                                href={project.live}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                <ExternalLink size={20} />
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
