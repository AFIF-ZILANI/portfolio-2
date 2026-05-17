"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

type LineType =
    | "prompt"
    | "user"
    | "output"
    | "success"
    | "error"
    | "warning"
    | "loading"
    | "blank";

type HistoryLine = {
    type: LineType;
    text: string;
};

type Step = "name" | "email" | "message" | "confirm" | "loading" | "success";

const INITIAL_HISTORY: HistoryLine[] = [
    { type: "output", text: "Initializing secure channel..." },
    { type: "success", text: "Connection established — afifzilani@dev ready." },
    { type: "blank", text: "" },
    { type: "output", text: "  To send a message, complete the prompts below." },
    { type: "output", text: "  Confirm step accepts Y / Enter (yes) or N (no)." },
    { type: "blank", text: "" },
];

const PROMPT_TEXT: Record<Step, string> = {
    name: "afif@dev:contact$ Enter your name:",
    email: "afif@dev:contact$ Enter your email:",
    message: "afif@dev:contact$ Enter your message:",
    confirm: "afif@dev:contact$ Send message? [Y/n]:",
    loading: "",
    success: "",
};

function lineColor(type: LineType): string {
    switch (type) {
        case "prompt":
            return "text-primary";
        case "user":
            return "text-foreground";
        case "success":
            return "text-green-400";
        case "error":
            return "text-red-400";
        case "warning":
            return "text-yellow-400";
        case "loading":
            return "text-blue-400";
        case "blank":
            return "";
        default:
            return "text-muted-foreground";
    }
}

function SpinnerChar() {
    const frames = ["|", "/", "-", "\\"];
    const [f, setF] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setF((p) => (p + 1) % 4), 100);
        return () => clearInterval(t);
    }, []);
    return (
        <span className="inline-block w-3 text-yellow-400 font-bold select-none">{frames[f]}</span>
    );
}

function BlinkingCursor() {
    return (
        <motion.span
            className="inline-block w-2 h-[1.1em] bg-primary align-middle ml-0.5"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
        />
    );
}

export function Contact() {
    const [step, setStep] = useState<Step>("name");
    const [history, setHistory] = useState<HistoryLine[]>(INITIAL_HISTORY);
    const [input, setInput] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [dots, setDots] = useState("");

    const inputRef = useRef<HTMLInputElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);

    // scroll to bottom whenever history changes
    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [history, dots]);

    // focus input on step change
    useEffect(() => {
        if (step !== "loading" && step !== "success") {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [step]);

    // loading dots animation
    useEffect(() => {
        if (step !== "loading") {
            setDots("");
            return;
        }
        const t = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 350);
        return () => clearInterval(t);
    }, [step]);

    const push = useCallback((...lines: HistoryLine[]) => {
        setHistory((h) => [...h, ...lines]);
    }, []);

    const reset = useCallback(() => {
        setStep("name");
        setName("");
        setEmail("");
        setInput("");
        setHistory(INITIAL_HISTORY);
    }, []);

    const runSend = useCallback(
        async (n: string, e: string, m: string) => {
            setStep("loading");

            const phases: Array<{ text: string; ms: number }> = [
                { text: "Encrypting payload...", ms: 0 },
                { text: "Establishing secure tunnel...", ms: 900 },
                { text: "Transmitting data packet...", ms: 1800 },
                { text: "Awaiting server confirmation...", ms: 2700 },
            ];

            const sendPromise = fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: n, email: e, message: m }),
            }).then((r) => r.json() as Promise<{ ok: boolean; error?: string }>);

            for (const phase of phases) {
                await new Promise<void>((r) => setTimeout(r, phase.ms));
                push({ type: "loading", text: phase.text });
            }

            const result = await Promise.race([
                sendPromise,
                new Promise<{ ok: boolean }>((_, reject) =>
                    setTimeout(() => reject(new Error("timeout")), 10000)
                ),
            ]).catch(() => ({ ok: false as const }));

            const ok = result.ok;

            push({ type: "blank", text: "" });

            if (ok) {
                push(
                    { type: "success", text: "✓  Message transmitted successfully!" },
                    { type: "output", text: `   Sent by: ${n} <${e}>` },
                    { type: "blank", text: "" },
                    { type: "output", text: "   I'll respond as soon as possible." },
                    { type: "blank", text: "" },
                    { type: "warning", text: "   Terminal resetting in 5 seconds..." }
                );
                setStep("success");
                setTimeout(reset, 5000);
            } else {
                push(
                    { type: "error", text: "✗  Transmission failed. Please try again." },
                    { type: "blank", text: "" }
                );
                setStep("name");
            }
        },
        [push, reset]
    );

    const submit = useCallback(() => {
        const val = input.trim();
        if (!val && step !== "confirm") return;

        const displayVal = step === "confirm" ? val || "Y" : val;

        // echo the prompt + user value into history
        push(
            { type: "prompt", text: PROMPT_TEXT[step] },
            { type: "user", text: `> ${displayVal}` }
        );
        setInput("");

        switch (step) {
            case "name": {
                setName(val);
                setStep("email");
                break;
            }
            case "email": {
                const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
                if (!valid) {
                    push({ type: "error", text: "✗  Invalid email address. Please try again." });
                    setStep("email");
                    return;
                }
                setEmail(val);
                setStep("message");
                break;
            }
            case "message": {
                push(
                    { type: "blank", text: "" },
                    { type: "output", text: "  ┌─ Review ──────────────────────────────" },
                    { type: "output", text: `  │  name    : ${name}` },
                    { type: "output", text: `  │  email   : ${email}` },
                    { type: "output", text: `  │  message : ${val}` },
                    { type: "output", text: "  └────────────────────────────────────────" },
                    { type: "blank", text: "" }
                );
                setStep("confirm");
                // store message for send
                // we pass name/email into runSend later, message captured in closure
                // store as a ref via a local var trick
                (window as unknown as { _contactMsg: string })._contactMsg = val;
                break;
            }
            case "confirm": {
                const ans = (val || "y").toLowerCase();
                if (ans === "y" || ans === "yes") {
                    const msg = (window as unknown as { _contactMsg: string })._contactMsg || "";
                    runSend(name, email, msg);
                } else {
                    push(
                        { type: "warning", text: "  Aborted. Session cleared." },
                        { type: "blank", text: "" }
                    );
                    setTimeout(reset, 1500);
                }
                break;
            }
        }
    }, [input, step, name, email, push, runSend, reset]);

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") submit();
    };

    const interactive = step !== "loading" && step !== "success";

    return (
        <section id="contact" className="py-24 mb-12">
            <div className="container mx-auto px-6 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        <span className="text-primary">05.</span> Get In Touch
                    </h2>
                    <p className="text-muted-foreground font-mono text-sm mb-8">
                        # Type directly in the terminal below.
                    </p>

                    {/* Terminal window */}
                    <div className="bg-background border border-border rounded-sm shadow-2xl overflow-hidden">
                        {/* Title bar */}
                        <div className="flex items-center gap-1.5 bg-card border-b border-border px-3 py-2 select-none">
                            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                            <span className="ml-3 font-mono text-xs text-muted-foreground tracking-wide">
                                bash — afif@dev — contact_form
                            </span>
                            {step === "loading" && (
                                <span className="ml-auto font-mono text-xs text-yellow-400 flex items-center gap-1">
                                    <SpinnerChar /> transmitting
                                </span>
                            )}
                            {step === "success" && (
                                <span className="ml-auto font-mono text-xs text-green-400">
                                    ● success — resetting
                                </span>
                            )}
                        </div>

                        {/* Body */}
                        <div
                            ref={bodyRef}
                            className="p-5 font-mono text-sm min-h-[380px] max-h-[520px] overflow-y-auto overflow-x-hidden space-y-[3px] cursor-text"
                            onClick={() => inputRef.current?.focus()}
                        >
                            {history.map((line, i) => (
                                <div
                                    key={i}
                                    className={`leading-relaxed whitespace-pre-wrap wrap-break-word ${lineColor(line.type)}`}
                                >
                                    {line.type === "loading" ? (
                                        <span className="flex items-center gap-2">
                                            <SpinnerChar />
                                            <span>{line.text}</span>
                                        </span>
                                    ) : (
                                        line.text
                                    )}
                                </div>
                            ))}

                            {/* Loading last-line pulse */}
                            {step === "loading" && (
                                <div className="flex items-center gap-2 text-yellow-400 mt-1">
                                    <SpinnerChar />
                                    <span>Processing{dots}</span>
                                </div>
                            )}

                            {/* Active input line */}
                            {interactive && (
                                <div className="mt-1">
                                    <div className="text-primary">{PROMPT_TEXT[step]}</div>
                                    {/* Invisible input captures keys; visible span + cursor render text */}
                                    <div className="relative flex items-center mt-[2px]">
                                        <span className="text-muted-foreground select-none">
                                            &gt;&nbsp;
                                        </span>
                                        {/* Rendered text + cursor, visually inline */}
                                        <span className="text-foreground">{input}</span>
                                        <BlinkingCursor />
                                        {/* Hidden real input — position absolute so it doesn't affect layout */}
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={handleKey}
                                            className="absolute inset-0 opacity-0 w-full bg-transparent outline-none border-none font-mono text-sm"
                                            autoComplete="off"
                                            autoCorrect="off"
                                            autoCapitalize="off"
                                            spellCheck={false}
                                            data-testid={`input-terminal-${step}`}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-border bg-card px-4 py-1.5 flex justify-between font-mono text-xs text-muted-foreground select-none">
                            <span>
                                {step === "loading" || step === "success"
                                    ? "Please wait..."
                                    : "Press Enter to submit"}
                            </span>
                            <span>
                                {step === "confirm"
                                    ? "Y or Enter → send  |  N → cancel"
                                    : step === "loading"
                                      ? "Encrypting & transmitting..."
                                      : step === "success"
                                        ? "Resetting in 5s..."
                                        : `step: ${step}`}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
