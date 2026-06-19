"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { DEFAULT_SITE_DATA as data } from "@/lib/site-data";

function TerminalTitleBar({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-1.5 bg-card border-b border-border px-3 py-2 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">{label}</span>
        </div>
    );
}

function TerminalLine({
    line,
    visible,
}: {
    line: {
        prompt?: string;
        cmd?: string;
        output?: string;
        color?: string;
        delay: number;
        cursor?: boolean;
    };
    visible: boolean;
}) {
    if (!visible) return null;
    if (line.prompt) {
        return (
            <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-primary">{line.prompt}</span>
                <span className="text-foreground">{line.cmd}</span>
                {line.cursor && (
                    <motion.span
                        className="inline-block w-2 h-4 bg-primary"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                    />
                )}
            </div>
        );
    }
    return <div className={`font-mono text-sm pl-4 ${line.color}`}>{line.output}</div>;
}

export function About() {
    const [visibleLines, setVisibleLines] = useState<number[]>([]);
    const [hasStarted, setHasStarted] = useState(false);

    type TerminalLineData =
        | {
              prompt: string;
              cmd: string;
              delay: number;
              cursor?: boolean;
              output?: undefined;
              color?: undefined;
          }
        | {
              output: string;
              color: string;
              delay: number;
              prompt?: undefined;
              cmd?: undefined;
              cursor?: undefined;
          };

    const bioLines = useMemo((): TerminalLineData[] => {
        const lines: TerminalLineData[] = [
            { prompt: "afif@dev:~$", cmd: "whoami", delay: 0 },
            {
                output: `${data.name} — ${data.title.replace(".", "")}`,
                color: "text-primary",
                delay: 300,
            },
            { prompt: "afif@dev:~$", cmd: "cat bio.txt", delay: 700 },
        ];

        data.bio.forEach((line, i) => {
            lines.push({ output: line, color: "text-muted-foreground", delay: 1000 + i * 150 });
        });

        const lastDelay = 1000 + data.bio.length * 150 + 300;
        lines.push({ prompt: "afif@dev:~$", cmd: "", delay: lastDelay, cursor: true });

        return lines;
    }, []);

    const startAnimation = () => {
        if (hasStarted) return;
        setHasStarted(true);
        bioLines.forEach((line, i) => {
            setTimeout(() => setVisibleLines((prev) => [...prev, i]), line.delay);
        });
    };

    return (
        <section id="about" className="py-24 bg-card/30 border-y border-border">
            <div className="container mx-auto px-6 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    onViewportEnter={startAnimation}
                >
                    <h2 className="text-3xl font-bold mb-10 flex items-center gap-2">
                        <span className="text-primary">01.</span> About
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        {/* ── Left: Photo + Stats ─────────────────────────── */}
                        <motion.div
                            className="flex flex-col gap-6"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Photo wrapped in terminal chrome */}
                            <div className="relative group border border-border rounded-sm overflow-hidden">
                                <TerminalTitleBar label="afif_zilani.webp — Preview" />
                                <div className="relative w-full aspect-5/4 overflow-hidden">
                                    <Image
                                        src={data.aboutImage}
                                        alt="Kazi Afif Zilani (AFIF ZILANI) — Entrepreneur and Full-Stack Developer from Naogaon, Bangladesh"
                                        fill
                                        className="object-cover object-bottom grayscale group-hover:grayscale-0 transition-all duration-700"
                                        data-testid="img-profile-about"
                                    />
                                    {/* Subtle scanlines */}
                                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)] pointer-events-none" />
                                    {/* Bottom label */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border px-3 py-1.5 font-mono text-xs flex justify-between items-center">
                                        <span className="text-primary">
                                            {data.name.toLowerCase().replace(" ", "_")}.webp
                                        </span>
                                        <span className="text-muted-foreground">1024×1024</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats: env-var syntax */}
                            <div className="bg-background border border-border rounded-sm font-mono text-sm p-4 space-y-2">
                                <div className="text-muted-foreground text-xs mb-3 border-b border-border pb-2">
                                    # environment variables
                                </div>
                                {data.stats.map((s, i) => (
                                    <motion.div
                                        key={s.key}
                                        className="flex items-center gap-2 flex-wrap"
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: i * 0.1 }}
                                    >
                                        <span className="text-blue-600 dark:text-blue-400">
                                            export
                                        </span>
                                        <span className="text-amber-600 dark:text-yellow-300 uppercase">
                                            {s.key}
                                        </span>
                                        <span className="text-muted-foreground">=</span>
                                        <span className="text-primary font-bold">
                                            &quot;{s.value}&quot;
                                        </span>
                                        <span className="text-muted-foreground text-xs">
                                            {s.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* ── Right: Terminal bio + links ─────────────────── */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex flex-col gap-4"
                        >
                            {/* Terminal bio */}
                            <div className="bg-background border border-border rounded-sm overflow-hidden flex flex-col">
                                <TerminalTitleBar label="bash — afif@dev" />
                                <div className="p-4 space-y-1.5 min-h-[320px]">
                                    {bioLines.map((line, i) => (
                                        <TerminalLine
                                            key={i}
                                            line={line}
                                            visible={visibleLines.includes(i)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Links: ls -la style */}
                            <div className="bg-background border border-border rounded-sm p-4 font-mono text-sm">
                                <div className="text-muted-foreground text-xs mb-3 border-b border-border pb-2">
                                    afif@dev:~$ ls -la ./links
                                </div>
                                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                    {data.socialLinks.map((link) => (
                                        <a
                                            key={link.id}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 dark:text-blue-400 hover:underline transition-all flex items-center gap-1.5"
                                            data-testid={`link-about-${link.label.replace("/", "")}`}
                                        >
                                            <span className="text-muted-foreground text-xs select-none">
                                                drwxr
                                            </span>
                                            <span>{link.label}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
