"use client";

import { motion } from "framer-motion";
import { ChevronRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { DEFAULT_SITE_DATA as data } from "@/lib/site-data";

export function Hero() {
    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section
            id="hero"
            className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
        >
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

            {/* Animated Code Particles */}
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-primary text-xs font-mono whitespace-nowrap"
                        initial={{
                            top: "-10%",
                            left: `${Math.random() * 100}%`,
                            opacity: 0,
                        }}
                        animate={{
                            top: "110%", // Animates safely from top to bottom of the container
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5,
                        }}
                    >
                        {Math.random().toString(36).substring(2, 10)}
                    </motion.div>
                ))}
            </div>

            <div className="container px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-2xl"
                    >
                        <div className="flex items-center gap-2 text-primary mb-6">
                            <Terminal size={20} />
                            <span className="font-mono text-sm uppercase tracking-wider">
                                System ready_
                            </span>
                        </div>

                        <motion.h1
                            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-foreground"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {data.name}
                            <br />
                            <span className="text-muted-foreground">{data.title}</span>
                        </motion.h1>

                        <motion.p
                            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {data.tagline}
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Button
                                size="lg"
                                className="bg-primary text-primary-foreground hover:bg-primary/90 group font-bold font-mono tracking-wide rounded-none border border-primary"
                                onClick={() => scrollTo("projects")}
                                data-testid="button-hero-projects"
                            >
                                /view_projects
                                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="group font-mono tracking-wide rounded-none border-muted-foreground/30 hover:border-primary hover:text-primary transition-colors"
                                onClick={() => scrollTo("contact")}
                                data-testid="button-hero-contact"
                            >
                                /contact_me
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Profile Photo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="relative shrink-0"
                    >
                        {/* Outer glow ring */}
                        <motion.div
                            className="absolute -inset-2 rounded-full opacity-60"
                            style={{
                                background:
                                    "conic-gradient(from 0deg, hsl(142 71% 45%), transparent, hsl(142 71% 45%))",
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Photo container */}
                        <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-2 border-primary bg-card">
                            <Image
                                src={data.heroImage}
                                alt="Afif Zilani (Kazi Afif Zilani) — Full-Stack Developer and Co-Founder of ZeroD, Naogaon, Bangladesh"
                                fill
                                priority
                                className="w-full h-full object-cover object-top"
                                data-testid="img-profile-hero"
                            />
                            {/* Green scanline overlay */}
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.08)_2px,rgba(0,0,0,0.08)_4px)] pointer-events-none" />
                        </div>
                        {/* Terminal label below photo */}
                        <motion.div
                            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-xs text-primary border border-primary/40 px-3 py-1 bg-background"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                        >
                            afif@dev:~$
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
