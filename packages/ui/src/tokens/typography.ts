export const typography = {
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
        xs: ["0.694rem", { lineHeight: "1.1rem" }], // 11.1px
        sm: ["0.833rem", { lineHeight: "1.25rem" }], // 13.3px
        base: ["1rem", { lineHeight: "1.7" }], // 16px - Japanese optimized leading
        lg: ["1.2rem", { lineHeight: "1.75rem" }], // 19.2px
        xl: ["1.44rem", { lineHeight: "1.75rem" }], // 23px
        "2xl": ["1.728rem", { lineHeight: "2rem" }], // 27.6px
        "3xl": ["2.074rem", { lineHeight: "2.25rem" }], // 33.2px
        "4xl": ["2.488rem", { lineHeight: "2.5rem" }], // 39.8px
    },
    letterSpacing: {
        tight: "-0.01em",
        normal: "0.02em", // Japanese optimized tracking
    },
} as const;
