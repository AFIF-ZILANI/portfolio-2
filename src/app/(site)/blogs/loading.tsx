/**
 * Shown while the blog index streams. Previously a navigation to /blogs left the
 * previous page on screen with no feedback until the server responded.
 * Skeletons match the real card grid so nothing jumps when content arrives.
 */
export default function Loading() {
    return (
        <main className="pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-6xl space-y-12">
                <header className="space-y-4">
                    <div className="h-10 w-40 bg-card animate-pulse" />
                    <div className="h-4 w-80 max-w-full bg-card animate-pulse" />
                </header>

                <div className="h-9 w-full max-w-md bg-card animate-pulse" />

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="border border-border">
                            <div className="aspect-video bg-card animate-pulse" />
                            <div className="p-5 space-y-3">
                                <div className="h-5 w-3/4 bg-card animate-pulse" />
                                <div className="h-3 w-full bg-card animate-pulse" />
                                <div className="h-3 w-5/6 bg-card animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
