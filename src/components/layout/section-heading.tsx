import type { ReactNode } from "react";

/**
 * The heading for a homepage section.
 *
 * The site's own vernacular is a shell — the admin says `$ ls posts`, the contact
 * form says `afif@dev:contact$`. This extends that to the public page: each
 * section is labelled by the path it would live at, and the extension says what
 * kind of thing it is (`.md` prose, `.json` data, `.log` history, `/` a
 * directory). That encodes something true about the content, which arbitrary
 * `01. / 02. / 03.` numbering never did — the sections are not a sequence, and
 * nothing breaks if their order changes.
 *
 * The rule runs from the path to the right edge, so the label sits *in* the
 * structure rather than floating above it.
 */
export function SectionHeading({
    path,
    title,
    action,
}: {
    /** Where this section would live on disk, e.g. `~/about.md`. */
    path: string;
    title: string;
    /** Optional trailing link, e.g. "all posts →". */
    action?: ReactNode;
}) {
    return (
        <div className="mb-12">
            <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-primary shrink-0">{path}</span>
                <span aria-hidden className="h-px flex-1 bg-border" />
                {action}
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
        </div>
    );
}
