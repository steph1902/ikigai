import { RiskFlagBanner } from "@ikigai/ui/src/composed/risk-flag-banner";
import { Button } from "@ikigai/ui/src/primitives/button";
import {
    MapPin,
    Ruler,
    Maximize,
    Train,
    Building2,
    Calendar,
    AlertCircle,
} from "lucide-react";

export default function PropertyDetailPage({
    params,
}: {
    params: { id: string };
}) {
    // Mock data - In production this would fetch from API
    const property = {
        id: params.id,
        name: "Park Court Akasaka Hinokicho The Tower",
        price: "¥280,000,000",
        location: "9-4-1 Akasaka, Minato-ku, Tokyo",
        size: "85.42m²",
        layout: "2LDK",
        imageUrl:
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop",
        yearBuilt: 2018,
        nearestStation: "Roppongi Station (6 min walk)",
        description:
            "A masterpiece of modern architecture aimed at creating a new landmark in Akasaka. Features include a sky lounge, fitness center, and 24-hour concierge service. This unit offers a panoramic view of Tokyo Tower and Midtown Garden.",
        features: [
            "24h Managed",
            "Auto-lock",
            "Delivery Box",
            "Pet Allowed",
            "Corner Room",
            "High Floor",
        ],
        riskFactors: [
            {
                type: "info" as const,
                title: "Active Management Association",
                description:
                    "Regular major repair works are planned for 2030. Reserve fund is healthy.",
            },
            {
                type: "warning" as const,
                title: "Hazard Map Notice",
                description:
                    "Located in a potential liquefaction zone. Reinforced foundation confirmed.",
            },
        ],
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Images & Key Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-sumi-bg-recessed relative">
                        {/* Placeholder for VR/Image Viewer */}
                        <img
                            src={property.imageUrl}
                            alt={property.name}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-4 right-4">
                            <Button variant="secondary" size="sm">
                                View 3D Tour
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold text-sumi-ink">{property.name}</h1>
                        <div className="flex items-center text-sumi-ink-muted">
                            <MapPin className="mr-2 h-4 w-4" />
                            {property.location}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-sumi-bg-elevated p-4 rounded-lg border border-sumi-border">
                            <div className="flex items-center text-sm text-sumi-ink-muted mb-1">
                                <Maximize className="mr-2 h-4 w-4" />
                                Layout
                            </div>
                            <div className="font-semibold">{property.layout}</div>
                        </div>
                        <div className="bg-sumi-bg-elevated p-4 rounded-lg border border-sumi-border">
                            <div className="flex items-center text-sm text-sumi-ink-muted mb-1">
                                <Ruler className="mr-2 h-4 w-4" />
                                Size
                            </div>
                            <div className="font-semibold">{property.size}</div>
                        </div>
                        <div className="bg-sumi-bg-elevated p-4 rounded-lg border border-sumi-border">
                            <div className="flex items-center text-sm text-sumi-ink-muted mb-1">
                                <Calendar className="mr-2 h-4 w-4" />
                                Built
                            </div>
                            <div className="font-semibold">{property.yearBuilt}</div>
                        </div>
                        <div className="bg-sumi-bg-elevated p-4 rounded-lg border border-sumi-border">
                            <div className="flex items-center text-sm text-sumi-ink-muted mb-1">
                                <Building2 className="mr-2 h-4 w-4" />
                                Type
                            </div>
                            <div className="font-semibold">Mansion</div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3">Description</h2>
                        <p className="text-sumi-ink-muted leading-relaxed">
                            {property.description}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3">Compliance & Risks</h2>
                        <div className="space-y-3">
                            {property.riskFactors.map((risk, index) => (
                                <RiskFlagBanner
                                    key={index}
                                    type={risk.type}
                                    title={risk.title}
                                >
                                    {risk.description}
                                </RiskFlagBanner>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: CTA & Agent */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 space-y-6">
                        <div className="bg-sumi-bg-elevated p-6 rounded-xl border border-sumi-border shadow-sm">
                            <div className="mb-6">
                                <p className="text-sm text-sumi-ink-muted">Asking Price</p>
                                <p className="text-3xl font-bold text-sumi-indigo">
                                    {property.price}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <Button className="w-full" size="lg">
                                    Request Viewing
                                </Button>
                                <Button variant="secondary" className="w-full" size="lg">
                                    Ask AI Assistant
                                </Button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-sumi-border">
                                <div className="flex items-start gap-2 text-xs text-sumi-ink-muted">
                                    <AlertCircle className="h-4 w-4 text-sumi-warinng shrink-0" />
                                    <p>
                                        This property is subject to urban planning designation.
                                        Detailed explanation of important matters (IT Jusetsu) required before contract.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
