"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { CONTACT_TOPICS } from "@/lib/contact";

type Status =
    | { kind: "idle" }
    | { kind: "sending" }
    | { kind: "sent" }
    | { kind: "error"; message: string };

const field =
    "w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20";
const label = "block text-sm font-medium mb-2";

/**
 * A plain form. The old one was a fake terminal: one invisible input, typed answers
 * one prompt at a time, a [Y/n] confirm step, and a fake "encrypting payload"
 * delay. Unusable for anyone who isn't a developer — which is everyone a farm
 * needs to hear from — and invisible to autofill and password managers.
 */
export function Contact({ heading, email }: { heading: string; email: string | null }) {
    const [status, setStatus] = useState<Status>({ kind: "idle" });

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const body = Object.fromEntries(new FormData(form));
        setStatus({ kind: "sending" });
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
            if (!res.ok || !json.ok) {
                setStatus({
                    kind: "error",
                    message: json.error ?? "Your message couldn't be sent. Please try again.",
                });
                return;
            }
            form.reset();
            setStatus({ kind: "sent" });
        } catch {
            setStatus({
                kind: "error",
                message: "Network error. Please check your connection and try again.",
            });
        }
    }

    return (
        <section
            id="contact"
            aria-labelledby="contact-heading"
            className="py-20 md:py-28 bg-card border-t border-border"
        >
            <div className="container mx-auto px-6 max-w-6xl grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16">
                <div>
                    <SectionHeading
                        id="contact-heading"
                        eyebrow="Contact"
                        title={heading}
                        intro="Buying, supplying or partnering — tell me what you need and I'll reply personally."
                    />
                    {email && (
                        <a
                            href={`mailto:${email}`}
                            className="inline-flex items-center gap-2 text-primary font-medium hover:underline underline-offset-4"
                        >
                            <Mail size={18} aria-hidden />
                            {email}
                        </a>
                    )}
                </div>

                {status.kind === "sent" ? (
                    <div
                        role="status"
                        className="rounded-[1.75rem] border border-border bg-background p-8 md:p-10 flex flex-col items-start gap-4"
                    >
                        <CheckCircle2 size={36} className="text-primary" aria-hidden />
                        <h3 className="text-2xl font-semibold">Message sent</h3>
                        <p className="text-muted-foreground">
                            Thanks for reaching out. I&apos;ll get back to you as soon as I can.
                        </p>
                        <button
                            type="button"
                            onClick={() => setStatus({ kind: "idle" })}
                            className="text-sm font-medium text-primary hover:underline underline-offset-4"
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form
                        onSubmit={onSubmit}
                        className="rounded-[1.75rem] border border-border bg-background p-6 md:p-10 grid sm:grid-cols-2 gap-5"
                    >
                        <div>
                            <label htmlFor="c-name" className={label}>
                                Name
                            </label>
                            <input
                                id="c-name"
                                name="name"
                                required
                                maxLength={100}
                                autoComplete="name"
                                className={field}
                            />
                        </div>
                        <div>
                            <label htmlFor="c-email" className={label}>
                                Email
                            </label>
                            <input
                                id="c-email"
                                name="email"
                                type="email"
                                required
                                maxLength={200}
                                autoComplete="email"
                                className={field}
                            />
                        </div>
                        <div>
                            <label htmlFor="c-phone" className={label}>
                                Phone{" "}
                                <span className="text-muted-foreground font-normal">
                                    (optional)
                                </span>
                            </label>
                            <input
                                id="c-phone"
                                name="phone"
                                type="tel"
                                maxLength={30}
                                autoComplete="tel"
                                placeholder="+880"
                                className={field}
                            />
                        </div>
                        <div>
                            <label htmlFor="c-topic" className={label}>
                                I&apos;m interested in
                            </label>
                            <select
                                id="c-topic"
                                name="topic"
                                defaultValue={CONTACT_TOPICS[0].value}
                                className={field}
                            >
                                {CONTACT_TOPICS.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="c-message" className={label}>
                                Message
                            </label>
                            <textarea
                                id="c-message"
                                name="message"
                                required
                                minLength={10}
                                maxLength={5000}
                                rows={5}
                                className={`${field} resize-y`}
                            />
                        </div>
                        {/* Honeypot: hidden from people and assistive tech, filled in by bots. */}
                        <div
                            aria-hidden
                            className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
                        >
                            <label htmlFor="c-company">Company</label>
                            <input id="c-company" name="company" tabIndex={-1} autoComplete="off" />
                        </div>

                        <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4">
                            <button
                                type="submit"
                                disabled={status.kind === "sending"}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                            >
                                {status.kind === "sending" && (
                                    <Loader2 size={18} className="animate-spin" aria-hidden />
                                )}
                                {status.kind === "sending" ? "Sending…" : "Send message"}
                            </button>
                            <p role="alert" aria-live="polite" className="text-sm text-destructive">
                                {status.kind === "error" ? status.message : ""}
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}
