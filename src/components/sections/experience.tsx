"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/layout/section-heading";
import type { Experience as ExperienceItem } from "@/lib/site-data";

export function Experience({ experiences }: { experiences: ExperienceItem[] }) {

    return (
        <section id="experience" className="py-24">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                >
                    <SectionHeading path="~/experience.log" title="Experience" />

                    <div className="space-y-12 border-l border-border/50 ml-4 pl-8 relative">
                        {experiences.map((exp, i) => (
                            <motion.div
                                key={i}
                                className="relative"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <span className="absolute -left-[41px] top-1 h-3 w-3 rounded-full bg-primary border-4 border-background box-content"></span>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                                    <h3 className="text-xl font-bold text-foreground">
                                        {exp.role}{" "}
                                        <span className="text-primary font-normal">
                                            @ {exp.company}
                                        </span>
                                    </h3>
                                    <span className="text-sm font-mono text-muted-foreground whitespace-nowrap">
                                        {exp.period}
                                    </span>
                                </div>

                                <p className="text-muted-foreground leading-relaxed">
                                    {exp.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
