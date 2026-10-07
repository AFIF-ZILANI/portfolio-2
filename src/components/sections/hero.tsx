import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import type { ResolvedSiteData } from "@/lib/site-data";

/**
 * A server component: plain anchors and CSS, no client JavaScript. The old hero
 * shipped framer-motion, random "code particles" and a spinning ring — all
 * decoration that delayed the LCP image and said "developer", not "farm".
 */
export function Hero({ data }: { data: ResolvedSiteData }) {
    return (
        <section
            id="hero"
            aria-labelledby="hero-heading"
            className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28"
        >
            {/* Soft field-and-sun wash; purely decorative. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_85%_10%,hsl(var(--highlight)/0.14),transparent_70%),radial-gradient(50%_60%_at_0%_100%,hsl(var(--primary)/0.10),transparent_70%)]"
            />

            <div className="container mx-auto px-6 max-w-6xl">
                <div className="grid md:grid-cols-[1.25fr_1fr] items-center gap-12 md:gap-16">
                    <div>
                        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
                            <MapPin size={14} className="text-primary" aria-hidden />
                            Naogaon, Bangladesh
                        </p>

                        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                            {data.title}
                        </p>
                        <h1
                            id="hero-heading"
                            className="mt-3 text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.02]"
                        >
                            {data.name}
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                            {data.tagline}
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row gap-3">
                            <a
                                href="#zerod-farm"
                                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                About ZeroD Farm
                                <ArrowRight
                                    size={18}
                                    aria-hidden
                                    className="transition-transform group-hover:translate-x-0.5"
                                />
                            </a>
                            <a
                                href="#contact"
                                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 font-medium transition-colors hover:border-primary hover:text-primary"
                            >
                                Get in touch
                            </a>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-sm md:max-w-none">
                        <div
                            aria-hidden
                            className="absolute -inset-3 rounded-[2rem] bg-secondary rotate-2"
                        />
                        <div className="relative aspect-4/5 overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-xl">
                            <Image
                                src={data.heroImage.url}
                                alt={data.heroImage.alt}
                                fill
                                priority
                                sizes="(max-width: 768px) 384px, 460px"
                                className="object-cover object-top"
                            />
                        </div>
                        <div className="absolute -bottom-5 left-5 right-5 sm:left-auto sm:right-6 sm:w-auto rounded-2xl border border-border bg-card/95 backdrop-blur px-4 py-3 shadow-lg">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">
                                Running
                            </p>
                            <p className="font-display text-lg font-semibold">ZeroD Farm</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
