import Link from "next/link";

/**
 * Server-rendered and instant. The old page was a client component that typed out
 * a fake `curl` session over ~6 seconds before showing any way out, and linked to
 * sections (#projects, #skills) that no longer exist.
 */
export default function NotFound() {
    return (
        <main className="min-h-screen grid place-items-center px-6 py-24 bg-background">
            <div className="max-w-lg text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    404
                </p>
                <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
                    This page doesn&apos;t exist
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    The link may be old or mistyped. Here&apos;s where you can go instead.
                </p>
                <nav
                    aria-label="Helpful links"
                    className="mt-10 flex flex-wrap justify-center gap-3"
                >
                    <Link
                        href="/"
                        className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Home
                    </Link>
                    {[
                        { href: "/#zerod-farm", label: "ZeroD Farm" },
                        { href: "/blogs", label: "Writing" },
                        { href: "/#contact", label: "Contact" },
                    ].map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="rounded-full border border-border px-6 py-3 font-medium hover:border-primary hover:text-primary transition-colors"
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </main>
    );
}
