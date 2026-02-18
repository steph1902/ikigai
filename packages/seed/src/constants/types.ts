export const BUILDING_TYPES = [
    {
        type: "mansion",
        label: "マンション",
        floors: { min: 3, max: 40 },
        units: { min: 20, max: 300 },
    },
    {
        type: "apartment",
        label: "アパート",
        floors: { min: 2, max: 3 },
        units: { min: 4, max: 12 },
    },
    { type: "kodate", label: "一戸建て", floors: { min: 2, max: 3 }, units: { min: 1, max: 1 } },
] as const;

export const LAYOUT_TYPES = [
    { layout: "1R", rooms: 1, minSqm: 15, maxSqm: 25, targetDemo: "single" },
    { layout: "1K", rooms: 1, minSqm: 20, maxSqm: 30, targetDemo: "single" },
    { layout: "1DK", rooms: 1, minSqm: 25, maxSqm: 35, targetDemo: "couple" },
    { layout: "1LDK", rooms: 1, minSqm: 35, maxSqm: 50, targetDemo: "couple" },
    { layout: "2LDK", rooms: 2, minSqm: 50, maxSqm: 70, targetDemo: "family_small" },
    { layout: "3LDK", rooms: 3, minSqm: 70, maxSqm: 90, targetDemo: "family_large" },
] as const;
