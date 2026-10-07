import type { ReactNode } from "react";

/**
 * The heading for a homepage section: a short eyebrow, the h2, and an optional
 * one-line intro. `action` sits on the right of the eyebrow row, e.g. "All posts →".
 */
export function SectionHeading({
    eyebrow,
    title,
    intro,
    action,
    id,
}: {
    eyebrow: string;
    title: string;
    intro?: string;
    action?: ReactNode;
    /** id for the h2, so the section can be aria-labelledby it. */
    id?: string;
}) {
    return (
        <div className="mb-10 md:mb-14 max-w-3xl">
            <div className="flex items-center justify-between gap-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    <span aria-hidden className="h-2 w-2 rounded-full bg-highlight" />
                    {eyebrow}
                </p>
                {action}
            </div>
            <h2 id={id} className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight">
                {title}
            </h2>
            {intro && <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{intro}</p>}
        </div>
    );
}
