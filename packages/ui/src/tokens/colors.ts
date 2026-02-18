export const colors = {
    sumi: {
        ink: {
            DEFAULT: "#1A1A2E", // Primary text, headers
            light: "#2D2D44",   // Secondary text
            muted: "#6B6B80",   // Tertiary text
        },
        indigo: {
            DEFAULT: "#3D5A80", // Primary action
            hover: "#2C4A6E",
            light: "#E8EEF4",
            50: "#F4F7FA",
        },
        warm: {
            DEFAULT: "#C17F59", // Secondary CTA
            light: "#F5EDE6",
        },
        success: {
            DEFAULT: "#2E7D5B",
            bg: "#E6F4ED",
        },
        warning: {
            DEFAULT: "#B8860B",
            bg: "#FFF8E1",
        },
        danger: {
            DEFAULT: "#C0392B",
            bg: "#FDEDED",
        },
        info: {
            DEFAULT: "#3D5A80",
            bg: "#E8EEF4",
        },
        bg: {
            primary: "#FAFAFA",
            elevated: "#FFFFFF",
            recessed: "#F0F0F5",
        },
        border: {
            DEFAULT: "#E0E0E8",
            strong: "#C8C8D4",
        },
        divider: "#ECECF0",
        ai: {
            surface: "#F6F4FF",
            accent: "#7C6DAF",
            border: "#E2DCF5",
        },
    },
} as const;
