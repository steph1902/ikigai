import type { Config } from "tailwindcss";

// SUMI Design System tokens inlined for cross-package compatibility
const colors = {
    sumi: {
        ink: {
            DEFAULT: "#1A1A2E",
            light: "#2D2D44",
            muted: "#6B6B80",
        },
        indigo: {
            DEFAULT: "#3D5A80",
            hover: "#2C4A6E",
            light: "#E8EEF4",
            50: "#F4F7FA",
        },
        warm: {
            DEFAULT: "#C17F59",
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

export const sumiPreset = {
    content: [],
    theme: {
        extend: {
            colors,
            spacing: {
                1: "0.25rem",
                2: "0.5rem",
                3: "0.75rem",
                4: "1rem",
                5: "1.25rem",
                6: "1.5rem",
                8: "2rem",
                10: "2.5rem",
                12: "3rem",
                16: "4rem",
                20: "5rem",
                24: "6rem",
            },
            screens: {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px",
                "2xl": "1536px",
            },
            fontFamily: {
                sans: [
                    "Noto Sans JP",
                    "Inter",
                    "Hiragino Kaku Gothic ProN",
                    "Yu Gothic",
                    "Meiryo",
                    "system-ui",
                    "sans-serif",
                ],
                mono: [
                    "JetBrains Mono",
                    "Source Han Code JP",
                    "Noto Sans Mono CJK JP",
                    "Consolas",
                    "monospace",
                ],
                latin: ["Inter", "Noto Sans JP", "system-ui", "sans-serif"],
            },
            fontSize: {
                xs: ["0.694rem", { lineHeight: "1.1rem" }],
                sm: ["0.833rem", { lineHeight: "1.25rem" }],
                base: ["1rem", { lineHeight: "1.7" }],
                lg: ["1.2rem", { lineHeight: "1.75rem" }],
                xl: ["1.44rem", { lineHeight: "1.75rem" }],
                "2xl": ["1.728rem", { lineHeight: "2rem" }],
                "3xl": ["2.074rem", { lineHeight: "2.25rem" }],
                "4xl": ["2.488rem", { lineHeight: "2.5rem" }],
            },
            letterSpacing: {
                tight: "-0.01em",
                normal: "0.02em",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
