"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const ROUTES = [
    { path: "/", label: "home/" },
    { path: "/#about", label: "about/" },
    { path: "/#contact", label: "contact/" },
    { path: "/#projects", label: "projects/" },
    { path: "/#skills", label: "skills/" },
    { path: "/#experience", label: "experience/" },
];

// Embed path into the line string so the renderer can extract it without fragile regex
const encodeRouteLine = (label: string, path: string) => `drwxr  ${label}||${path}`;

export default function NotFound() {
    const [terminalLines, setTerminalLines] = useState<string[]>([]);
    const [showError, setShowError] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);
    const [currentUrl, setCurrentUrl] = useState("");

    useEffect(() => {
        setCurrentUrl(window.location.pathname);
    }, []);

    useEffect(() => {
        if (!currentUrl) return;

        const timeouts: ReturnType<typeof setTimeout>[] = [];
        let spinnerInterval: ReturnType<typeof setInterval> | null = null;

        const schedule = (fn: () => void, delay: number) => {
            const t = setTimeout(fn, delay);
            timeouts.push(t);
        };

        const addLine = (text: string, delay: number) =>
            schedule(() => setTerminalLines((prev) => [...prev, text]), delay);

        addLine(
            `afif@dev:~$ curl -X GET "https://afifzilani.com${currentUrl}" -H "User-Agent: Mozilla/5.0" -H "Accept: text/html,application/json;q=0.9,*/*;q=0.8"`,
            300
        );
        addLine(
            `--compressed --location --max-redirs 10 --connect-timeout 10 --max-time 30 --retry 3 --retry-delay 2 --verbose`,
            300
        );

        addLine("Resolving DNS...", 1100);
        addLine("Connecting to server...", 2000);

        // Bug fix: spinner must start AFTER the empty line is added (2800ms),
        // not immediately. It also needs to add its own line first, then update it.
        schedule(() => {
            const spinners = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
            let idx = 0;

            setTerminalLines((prev) => [...prev, `Processing ${spinners[idx]}`]);

            spinnerInterval = setInterval(() => {
                idx++;
                if (idx >= spinners.length) {
                    clearInterval(spinnerInterval!);
                    spinnerInterval = null;
                    return;
                }
                setTerminalLines((prev) => {
                    const next = [...prev];
                    next[next.length - 1] = `Processing ${spinners[idx]}`;
                    return next;
                });
            }, 150);
        }, 2550); // slightly after 2800ms so empty line is committed first

        schedule(() => {
            setTerminalLines((prev) => [
                ...prev,
                "error: 404 not found",
                `message: page "${currentUrl}" doesn't exist in our codebase`,
            ]);
        }, 4000);

        schedule(() => {
            setTerminalLines((prev) => [...prev, "afif@dev:~$ ls available-navigations.route"]);
        }, 4600);

        ROUTES.forEach((route, i) => {
            addLine(encodeRouteLine(route.label, route.path), 5000 + i * 100);
        });

        schedule(() => setShowError(true), 5700);

        // Bug fix: clean up all timeouts and the interval on unmount
        return () => {
            timeouts.forEach(clearTimeout);
            if (spinnerInterval) clearInterval(spinnerInterval);
        };
    }, [currentUrl]);

    useEffect(() => {
        const interval = setInterval(() => setCursorVisible((prev) => !prev), 530);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground font-mono flex flex-col p-4 md:p-8">
            {/* Header */}
            <div className="mb-8 md:mb-12">
                <Link
                    href="/"
                    className="text-primary hover:opacity-80 transition-opacity text-sm md:text-base"
                >
                    → afif@dev
                </Link>
            </div>

            {/* Full Terminal */}
            <div className="flex-1 border border-border bg-card overflow-hidden flex flex-col mb-8">
                {/* Terminal Header */}
                <div className="bg-muted px-4 py-2 flex items-center gap-2 border-b border-border">
                    <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">bash — afif@dev</span>
                </div>

                {/* Terminal Content */}
                <div className="flex-1 p-6 overflow-auto">
                    <div className="space-y-1 text-sm">
                        {terminalLines.map((line, idx) => {
                            const isRoute = line.startsWith("drwxr");

                            if (isRoute) {
                                // Bug fix: path is embedded in the string, no fragile regex needed
                                const [display, path] = line.replace("drwxr  ", "").split("||");
                                return (
                                    <div key={idx} className="whitespace-pre-wrap wrap-break-word">
                                        <Link
                                            href={path}
                                            className="text-muted-foreground transition-colors group"
                                        >
                                            <span>drwxr </span>
                                            <span className="text-primary group-hover:font-bold hover:underline">
                                                {display}
                                            </span>
                                        </Link>
                                    </div>
                                );
                            }

                            return (
                                <div key={idx} className="whitespace-pre-wrap wrap-break-word">
                                    {line.startsWith("error:") || line.startsWith("message:") ? (
                                        <span className="text-red-500">{line}</span>
                                    ) : line.startsWith("Processing") ? (
                                        <span className="text-primary">{line}</span>
                                    ) : line.includes("$") || line.includes("-") ? (
                                        <span className="text-primary">{line}</span>
                                    ) : line === "" ? (
                                        <span>&nbsp;</span>
                                    ) : (
                                        <span className="text-muted-foreground">{line}</span>
                                    )}
                                </div>
                            );
                        })}
                        {!showError && (
                            <div className="text-primary inline-block">
                                {cursorVisible ? "▌" : " "}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0);   }
                }
                .animate-in {
                    animation: fadeIn 0.5s ease-out;
                }
            `}</style>
        </div>
    );
}
