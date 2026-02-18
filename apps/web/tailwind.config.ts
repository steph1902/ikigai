import type { Config } from "tailwindcss";
import { sumiPreset } from "@ikigai/ui/tailwind.config";

const config: Config = {
    presets: [sumiPreset],
    content: [
        "./src/**/*.{ts,tsx,mdx}",
        "../../packages/ui/src/**/*.{ts,tsx}", // Important to scan UI package
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};

export default config;
