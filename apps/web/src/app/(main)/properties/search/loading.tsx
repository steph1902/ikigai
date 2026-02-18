export default function SearchLoading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Search bar skeleton */}
            <div className="sticky top-14 z-40 border-b bg-background/95 backdrop-blur">
                <div className="container mx-auto flex items-center gap-3 px-4 py-3">
                    <div className="h-10 flex-1 animate-pulse rounded-lg bg-muted" />
                    <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
                    <div className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="mb-4 h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={`skeleton-${i}`} className="animate-pulse rounded-xl border bg-card">
                            <div className="aspect-[4/3] rounded-t-xl bg-muted" />
                            <div className="space-y-3 p-4">
                                <div className="h-4 w-3/4 rounded bg-muted" />
                                <div className="h-3 w-1/2 rounded bg-muted" />
                                <div className="flex gap-3">
                                    <div className="h-3 w-16 rounded bg-muted" />
                                    <div className="h-3 w-16 rounded bg-muted" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
