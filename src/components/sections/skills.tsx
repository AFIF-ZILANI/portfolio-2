"use client";
import { motion } from "framer-motion";
import type { Skill } from "@/lib/site-data";
import { SkillIcon } from "@/lib/icons";

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
};

export function Skills({ skills }: { skills: Skill[] }) {
    const categories = Array.from(new Set(skills.map((s) => s.category)));

    return (
        <section id="skills" className="py-24">
            <div className="container mx-auto px-6 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold mb-12 flex items-center gap-2">
                        <span className="text-primary">02.</span> Skills
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {categories.map((cat) => {
                            const catSkills = skills.filter((s) => s.category === cat);
                            return (
                                <div key={cat} className="flex flex-col">
                                    <h3 className="text-xl font-mono mb-6 text-muted-foreground border-b border-border pb-2">
                                        {cat}
                                    </h3>
                                    <motion.div
                                        className="grid grid-cols-2 gap-4"
                                        variants={containerVariants}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ once: true }}
                                    >
                                        {catSkills.map((skill) => {
                                            return (
                                                <motion.div
                                                    key={skill.id}
                                                    variants={itemVariants}
                                                    className="group flex flex-col items-center justify-center p-4 bg-card border border-border hover:border-primary transition-all duration-300"
                                                >
                                                    <SkillIcon
                                                        name={skill.icon}
                                                        size={30}
                                                        className="text-muted-foreground group-hover:text-primary transition-colors mb-3"
                                                    />

                                                    <span className="text-xs font-mono font-medium text-center">
                                                        {skill.name}
                                                    </span>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
