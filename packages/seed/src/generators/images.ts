
export function getPropertyImageUrl(
    propertyId: string,
    index: number,
    type: 'exterior' | 'interior' | 'floorplan' | 'view'
): string {
    // In development: use curated Unsplash collections of Japanese apartments
    const collections: Record<string, string> = {
        exterior: '3839885',   // Japanese architecture
        interior: '1163637',   // Modern interiors
        view: '1525943',       // City views
        floorplan: '',         // Generate SVG floor plans
    };

    // Deterministic image per property+index so it's consistent
    const seed = `${propertyId}-${index}`;

    if (type === 'floorplan') {
        // For now, return a placeholder service that generates text images, 
        // or a specific floorplan placeholder if available.
        // Ideally we'd have a local generator, but for MVP let's use a reliable placeholder.
        return `https://placehold.co/600x400?text=Floor+Plan+${index}`;
    }

    // Using Unsplash Source (might be deprecated/flaky, alternatives: structure similar url)
    // Since source.unsplash.com is deprecated, let's use images.unsplash.com with specific IDs if possible, 
    // or a different placeholder service that supports keywords/collections reliably.
    // For demo consistency, we can use a set of fixed images or a different service.
    // Let's stick to the doc's suggestion but be aware of Unsplash Source deprecation.
    // Actually, let's use a robust alternative: https://loremflickr.com or similar if needed.
    // But strictly following the doc:
    // return `https://source.unsplash.com/collection/${collections[type]}/800x600?sig=${seed}`;

    // Update: source.unsplash.com IS deprecated. 
    // Let's use a reliable placeholder service with keywords for now to ensure it works.
    const keywords = {
        exterior: 'modern,apartment,building,japan',
        interior: 'living,room,modern,interior',
        view: 'city,view,tokyo',
        floorplan: 'plan'
    };

    // Using loremflickr as a fallback that works similarly
    return `https://loremflickr.com/800/600/${keywords[type]}?lock=${Math.abs(hash(seed)) % 100}`;
}

function hash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
