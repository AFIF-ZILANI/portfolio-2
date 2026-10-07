import { ArrowRight, HeartPulse, Handshake, Sprout, Truck } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import type { Experience } from "@/lib/site-data";

/**
 * The reason the site exists: ZeroD Farm.
 *
 * The copy here is code, not admin content, because it's the positioning of the
 * whole page rather than a list that changes. Keep it to things that are true of
 * the farm today — specific numbers (flock size, batches, buyers) belong in the
 * Stats editor once they're real.
 */
const PRINCIPLES = [
    {
        icon: HeartPulse,
        title: "Healthy flocks first",
        body: "Biosecurity, clean housing and vaccination on schedule. A healthy flock is the whole business, so it gets attention before anything else.",
    },
    {
        icon: Truck,
        title: "Dependable supply",
        body: "Batches are planned ahead so buyers know what they're getting and when, instead of guessing.",
    },
    {
        icon: Handshake,
        title: "Straight dealing",
        body: "Clear prices, suppliers paid on time, and honest answers when something goes wrong.",
    },
    {
        icon: Sprout,
        title: "Growing carefully",
        body: "Capacity grows only as fast as operations can stay disciplined. Slow and sound beats fast and fragile.",
    },
];

const AUDIENCES = [
    {
        title: "Buyers",
        body: "Wholesalers, retailers, restaurants and caterers looking for a steady poultry supply.",
    },
    {
        title: "Suppliers",
        body: "Feed, day-old chicks, veterinary medicine and farm equipment.",
    },
    {
        title: "Partners & investors",
        body: "People who want to build long-term agribusiness in northern Bangladesh.",
    },
];

export function Farm({ experiences }: { experiences: Experience[] }) {
    return (
        <section id="zerod-farm" aria-labelledby="farm-heading" className="py-20 md:py-28">
            <div className="container mx-auto px-6 max-w-6xl">
                <SectionHeading
                    id="farm-heading"
                    eyebrow="ZeroD Farm"
                    title="A poultry farm in Naogaon, run with discipline"
                    intro="ZeroD Farm is the one business I work on. Founded in 2022 in Naogaon, Rajshahi Division, it's built on a simple idea: run the farm properly every day and the results follow."
                />

                <ul className="grid sm:grid-cols-2 gap-5">
                    {PRINCIPLES.map(({ icon: Icon, title, body }) => (
                        <li
                            key={title}
                            className="rounded-2xl border border-border bg-card p-6 md:p-8"
                        >
                            <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
                                <Icon size={22} aria-hidden />
                            </span>
                            <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                            <p className="mt-2 text-muted-foreground leading-relaxed">{body}</p>
                        </li>
                    ))}
                </ul>

                <div className="mt-16 grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start">
                    {experiences.length > 0 && (
                        <div>
                            <h3 className="text-2xl font-semibold">My role</h3>
                            <ol className="mt-6 space-y-8 border-l-2 border-secondary pl-6">
                                {experiences.map((exp) => (
                                    <li key={exp.id} className="relative">
                                        <span
                                            aria-hidden
                                            className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-4 border-background bg-highlight"
                                        />
                                        <p className="text-sm font-medium text-primary">
                                            {exp.period}
                                        </p>
                                        <p className="mt-1 text-lg font-semibold">
                                            {exp.role}, {exp.company}
                                        </p>
                                        <p className="mt-2 text-muted-foreground leading-relaxed">
                                            {exp.description}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    <div className="rounded-[1.75rem] bg-primary p-8 md:p-10 text-primary-foreground dark:bg-secondary dark:text-secondary-foreground dark:border dark:border-border">
                        <h3 className="text-2xl md:text-3xl font-semibold">Work with the farm</h3>
                        <ul className="mt-6 space-y-5">
                            {AUDIENCES.map((a) => (
                                <li key={a.title}>
                                    <p className="font-semibold">{a.title}</p>
                                    <p className="mt-1 opacity-85 leading-relaxed">{a.body}</p>
                                </li>
                            ))}
                        </ul>
                        <a
                            href="#contact"
                            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-6 py-3 font-medium text-primary dark:bg-primary dark:text-primary-foreground transition-opacity hover:opacity-90"
                        >
                            Start a conversation
                            <ArrowRight
                                size={18}
                                aria-hidden
                                className="transition-transform group-hover:translate-x-0.5"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
