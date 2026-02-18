import { BadgeCheck, MapPin, Maximize, Ruler } from "lucide-react";
import * as React from "react";
import { Button } from "../primitives/button";
import { cn } from "@/utils";

interface PropertyCardProps extends React.HTMLAttributes<HTMLDivElement> {
    listing: {
        id: string;
        name: string;
        price: string;
        location: string;
        size: string;
        layout: string;
        imageUrl: string;
        tags?: string[];
        matchScore?: number;
    };
}

export function PropertyCard({
    className,
    listing,
    ...props
}: PropertyCardProps) {
    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-xl border border-sumi-border bg-sumi-bg-elevated transition-all hover:border-sumi-indigo/50 hover:shadow-lg",
                className,
            )}
            {...props}
        >
            <div className="aspect-[4/3] w-full overflow-hidden bg-sumi-bg-recessed">
                <img
                    src={listing.imageUrl}
                    alt={listing.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {listing.matchScore && (
                    <div className="absolute right-3 top-3 rounded-full bg-sumi-ink/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {listing.matchScore}% Match
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                    <div>
                        <h3 className="line-clamp-1 font-semibold text-sumi-ink">
                            {listing.name}
                        </h3>
                        <div className="mt-1 flex items-center text-sm text-sumi-ink-muted">
                            <MapPin className="mr-1 h-3.5 w-3.5" />
                            <span className="line-clamp-1">{listing.location}</span>
                        </div>
                    </div>
                    <p className="text-lg font-bold text-sumi-indigo">{listing.price}</p>
                </div>

                <div className="mb-4 flex items-center space-x-4 text-sm text-sumi-ink-muted">
                    <div className="flex items-center">
                        <Maximize className="mr-1.5 h-4 w-4" />
                        {listing.layout}
                    </div>
                    <div className="flex items-center">
                        <Ruler className="mr-1.5 h-4 w-4" />
                        {listing.size}
                    </div>
                </div>

                {listing.tags && listing.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {listing.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center rounded-md bg-sumi-bg-recessed px-2 py-1 text-xs font-medium text-sumi-ink"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex gap-2">
                    <Button variant="primary" className="flex-1">
                        View Details
                    </Button>
                    <Button variant="ghost" size="icon">
                        <BadgeCheck className="h-5 w-5 text-sumi-indigo" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
