export const i18nConfig = {
    defaultLocale: "ja" as const,
    locales: ["ja", "en"] as const,
    localePrefixMode: "as-needed" as const,
};

export type Locale = (typeof i18nConfig.locales)[number];
