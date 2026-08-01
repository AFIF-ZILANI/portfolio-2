"use client";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/layout/section-heading";
import type { Skill } from "@/lib/site-data";
import { SkillIcon } from "@/lib/icons";

const rowVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const chipVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

/**
 * Skills as one row per category rather than a grid of equal columns.
 *
 * The three-column version sized every column to the tallest, so a category with
 * four entries sat beside a gap the height of a category with eight. Rows size to
 * their own content, so the layout holds however lopsided the categories are —
 * which matters because this list is edited at /admin/site/skills and nobody is
 * going to rebalance it by hand.
 *
 * Denser too: the whole stack reads in one screen instead of four, which is the
 * actual job of this section.
 */
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
                    <SectionHeading path="~/skills.json" title="Skills" />

                    <dl className="divide-y divide-border border-y border-border">
                        {categories.map((cat) => {
                            const catSkills = skills.filter((s) => s.category === cat);
                            return (
                                <div
                                    key={cat}
                                    className="grid sm:grid-cols-[9rem_1fr] gap-x-8 gap-y-3 py-6"
                                >
                                    <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground pt-1.5">
                                        {cat}
                                        <span className="text-primary/60 ml-2">
                                            {catSkills.length}
                                        </span>
                                    </dt>

                                    <motion.dd
                                        className="flex flex-wrap gap-2"
                                        variants={rowVariants}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ once: true }}
                                    >
                                        {catSkills.map((skill) => (
                                            <motion.span
                                                key={skill.id}
                                                variants={chipVariants}
                                                className="group inline-flex items-center gap-2 border border-border bg-card px-3 py-1.5 hover:border-primary transition-colors"
                                            >
                                                <SkillIcon
                                                    name={skill.icon}
                                                    size={16}
                                                    className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                                                />
                                                <span className="font-mono text-xs">
                                                    {skill.name}
                                                </span>
                                            </motion.span>
                                        ))}
                                    </motion.dd>
                                </div>
                            );
                        })}
                    </dl>
                </motion.div>
            </div>
        </section>
    );
}
