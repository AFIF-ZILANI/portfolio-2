import Link from "next/link";

type Part = { slug: string; title: string; seriesOrder: number | null };

/** "Part 2 of 5" box listing the other published parts of a series. */
export function SeriesNav({
    seriesTitle,
    description,
    parts,
    currentSlug,
}: {
    seriesTitle: string;
    description: string | null;
    parts: Part[];
    currentSlug: string;
}) {
    if (parts.length < 2) return null;

    const index = parts.findIndex((p) => p.slug === currentSlug);

    return (
        <nav
            aria-label={`${seriesTitle} series navigation`}
            className="border border-border bg-card p-6 space-y-4"
        >
            <div>
                <p className="text-xs text-primary uppercase tracking-wider">
                    {index >= 0 ? `Part ${index + 1} of ${parts.length}` : "Series"}
                </p>
                <p className="font-bold mt-1">{seriesTitle}</p>
                {description && (
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                )}
            </div>

            <ol className="space-y-1 text-sm">
                {parts.map((p, i) => {
                    const current = p.slug === currentSlug;
                    return (
                        <li key={p.slug} className="flex gap-3">
                            <span className="text-muted-foreground shrink-0">
                                {String(i + 1).padStart(2, "0")}.
                            </span>
                            {current ? (
                                <span aria-current="page" className="text-primary">
                                    {p.title}
                                </span>
                            ) : (
                                <Link
                                    href={`/blogs/${p.slug}`}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {p.title}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
