export { i18nConfig } from "./config";
export type { Locale } from "./config";
export {
    formatPrice,
    formatPriceShort,
    formatArea,
    formatBuildingAge,
    formatStationAccess,
    formatStationAccessShort,
    formatDate,
    formatMonthlyCosts,
    formatEarthquakeStandard,
    formatFloorInfo,
    formatStructure,
} from "./formatters/japanese";
export { default as ja } from "./messages/ja";
export { default as en } from "./messages/en";
