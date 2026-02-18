import type { Config } from "tailwindcss";
import { colors } from "./src/tokens/colors";
import { spacing, breakpoints } from "./src/tokens/spacing";
import { typography } from "./src/tokens/typography";

export const sumiPreset = {
    content: [],
    theme: {
        extend: {
            colors: colors,
            spacing: spacing,
            screens: breakpoints,
            fontFamily: typography.fontFamily,
            fontSize: typography.fontSize,
            letterSpacing: typography.letterSpacing,
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
