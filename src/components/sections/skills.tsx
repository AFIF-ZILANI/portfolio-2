"use client";
import { motion } from "framer-motion";
import {
    SiReact,
    SiTypescript,
    SiNodedotjs,
    SiPython,
    SiPostgresql,
    SiDocker,
    SiGit,
    SiTailwindcss,
    SiNextdotjs,
    SiLinux,
    SiHono,
    SiPrisma,
    SiRust,
    SiGo,
    SiRedis,
    SiMongodb,
    SiJavascript,
    SiKotlin,
    SiC,
    SiCplusplus,
    SiGithub,
    SiSqlite,
    SiDrizzle,
    SiExpress,
    SiBun,
} from "react-icons/si";

const skills = [
    // Languages
    { id: "s1", name: "TypeScript", category: "Languages", icon: SiTypescript },
    { id: "s2", name: "JavaScript", category: "Languages", icon: SiJavascript },
    { id: "s3", name: "Python", category: "Languages", icon: SiPython },
    { id: "s4", name: "Go", category: "Languages", icon: SiGo },
    { id: "s5", name: "Rust", category: "Languages", icon: SiRust },
    { id: "s6", name: "Kotlin", category: "Languages", icon: SiKotlin },
    { id: "s7", name: "C", category: "Languages", icon: SiC },
    { id: "s8", name: "C++", category: "Languages", icon: SiCplusplus },

    // Web Development
    { id: "s9", name: "React", category: "WebDev", icon: SiReact },
    { id: "s10", name: "Next.js", category: "WebDev", icon: SiNextdotjs },
    { id: "s11", name: "Tailwind CSS", category: "WebDev", icon: SiTailwindcss },
    { id: "s12", name: "Node.js", category: "WebDev", icon: SiNodedotjs },
    { id: "s13", name: "Hono", category: "WebDev", icon: SiHono },
    { id: "s14", name: "Express.js", category: "WebDev", icon: SiExpress },
    { id: "s15", name: "Bun.js", category: "WebDev", icon: SiBun },

    // DevOps
    { id: "s16", name: "Docker", category: "DevOps", icon: SiDocker },
    { id: "s17", name: "Linux", category: "DevOps", icon: SiLinux },
    { id: "s18", name: "Git", category: "DevOps", icon: SiGit },
    { id: "s19", name: "Git Hub", category: "DevOps", icon: SiGithub },

    // Database
    { id: "s20", name: "PostgreSQL", category: "Database", icon: SiPostgresql },
    { id: "s21", name: "MongoDB", category: "Database", icon: SiMongodb },
    { id: "s22", name: "SQLite", category: "Database", icon: SiSqlite },
    { id: "s23", name: "Redis", category: "Database", icon: SiRedis },
    { id: "s24", name: "Drizzle ORM", category: "Database", icon: SiDrizzle },
    { id: "s25", name: "Prisma", category: "Database", icon: SiPrisma },
];

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

export function Skills() {
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
                                                    <skill.icon className="text-3xl text-muted-foreground group-hover:text-primary transition-colors mb-3" />

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
