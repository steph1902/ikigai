/**
 * Japanese real estate formatting utilities.
 * Handles 万円/億円 pricing, ㎡/坪 area, 築年数, station access, and dates.
 */

const MAN = 10_000;
const OKU = 100_000_000;
const TSUBO_RATIO = 3.30579;

/**
 * Format price in Japanese conventions (万円 / 億円).
 * Example: 72,800,000 → "7,280万円", 120,000,000 → "1億2,000万円"
 */
export function formatPrice(yen: number): string {
    if (yen >= OKU) {
        const okuPart = Math.floor(yen / OKU);
        const manRemainder = Math.floor((yen % OKU) / MAN);

        if (manRemainder === 0) {
            return `${okuPart}億円`;
        }
        return `${okuPart}億${manRemainder.toLocaleString("ja-JP")}万円`;
    }

    const manValue = Math.floor(yen / MAN);
    return `${manValue.toLocaleString("ja-JP")}万円`;
}

/**
 * Format price as a short label for charts/badges.
 * Example: 72,800,000 → "7,280万"
 */
export function formatPriceShort(yen: number): string {
    if (yen >= OKU) {
        const okuPart = Math.floor(yen / OKU);
        const manRemainder = Math.floor((yen % OKU) / MAN);
        if (manRemainder === 0) return `${okuPart}億`;
        return `${okuPart}億${manRemainder.toLocaleString("ja-JP")}万`;
    }
    return `${Math.floor(yen / MAN).toLocaleString("ja-JP")}万`;
}

/**
 * Format area in square meters, optionally with tsubo conversion.
 * Example: 65.5 → "65.50㎡（19.81坪）"
 */
export function formatArea(sqm: number, showTsubo = true): string {
    const formatted = `${sqm.toFixed(2)}㎡`;
    if (!showTsubo) return formatted;

    const tsubo = (sqm / TSUBO_RATIO).toFixed(2);
    return `${formatted}（${tsubo}坪）`;
}

/**
 * Format building age in Japanese convention.
 * 0 → "新築", 15 → "築15年"
 */
export function formatBuildingAge(years: number): string {
    if (years === 0) return "新築";
    return `築${years}年`;
}

/**
 * Format station access information.
 * Example: "恵比寿", "JR山手線", 5 → "JR山手線「恵比寿」駅 徒歩5分"
 */
export function formatStationAccess(
    station: string,
    line: string,
    walkMinutes: number,
): string {
    return `${line}「${station}」駅 徒歩${walkMinutes}分`;
}

/**
 * Format station access as a short string.
 * Example: "恵比寿駅 徒歩5分"
 */
export function formatStationAccessShort(
    station: string,
    walkMinutes: number,
): string {
    return `${station}駅 徒歩${walkMinutes}分`;
}

/**
 * Format date in Japanese conventions.
 * 'western' → "2024年3月15日"
 * 'imperial' → "令和6年3月15日"
 * 'short' → "2024/03/15"
 */
export function formatDate(
    date: Date,
    format: "western" | "imperial" | "short" = "western",
): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    switch (format) {
        case "imperial":
            return `${toImperialYear(year)}${month}月${day}日`;
        case "short":
            return `${year}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`;
        case "western":
        default:
            return `${year}年${month}月${day}日`;
    }
}

function toImperialYear(westernYear: number): string {
    if (westernYear >= 2019) return `令和${westernYear - 2018}年`;
    if (westernYear >= 1989) return `平成${westernYear - 1988}年`;
    if (westernYear >= 1926) return `昭和${westernYear - 1925}年`;
    return `${westernYear}年`;
}

/**
 * Format monthly costs breakdown.
 */
export function formatMonthlyCosts(costs: {
    managementFee: number;
    repairReserveFund: number;
    parkingFee?: number | null;
}): { label: string; amount: string }[] {
    const items = [
        {
            label: "管理費",
            amount: `${costs.managementFee.toLocaleString("ja-JP")}円/月`,
        },
        {
            label: "修繕積立金",
            amount: `${costs.repairReserveFund.toLocaleString("ja-JP")}円/月`,
        },
    ];

    if (costs.parkingFee) {
        items.push({
            label: "駐車場",
            amount: `${costs.parkingFee.toLocaleString("ja-JP")}円/月`,
        });
    }

    const total =
        costs.managementFee +
        costs.repairReserveFund +
        (costs.parkingFee ?? 0);
    items.push({
        label: "月額合計",
        amount: `${total.toLocaleString("ja-JP")}円/月`,
    });

    return items;
}

/**
 * Format earthquake standard label with visual indicator.
 */
export function formatEarthquakeStandard(
    standard: "old" | "new" | "grade1" | "grade2" | "grade3" | "unknown",
): { label: string; variant: "safe" | "warning" | "unknown" } {
    switch (standard) {
        case "new":
            return { label: "新耐震", variant: "safe" };
        case "grade1":
            return { label: "耐震等級1", variant: "safe" };
        case "grade2":
            return { label: "耐震等級2", variant: "safe" };
        case "grade3":
            return { label: "耐震等級3", variant: "safe" };
        case "old":
            return { label: "旧耐震", variant: "warning" };
        case "unknown":
        default:
            return { label: "不明", variant: "unknown" };
    }
}

/**
 * Format floor plan with Japanese conventions.
 * Example: "3LDK" (already standard), but can add "S" suffix for service room
 */
export function formatFloorInfo(
    floorLevel: number | null,
    totalFloors: number | null,
): string {
    if (floorLevel == null || totalFloors == null) return "";
    return `${floorLevel}階/${totalFloors}階建`;
}

/**
 * Format building structure type.
 */
export function formatStructure(
    structure: "rc" | "src" | "steel" | "wood" | "light_steel" | "other",
): string {
    const map: Record<string, string> = {
        rc: "RC造",
        src: "SRC造",
        steel: "鉄骨造",
        wood: "木造",
        light_steel: "軽量鉄骨造",
        other: "その他",
    };
    return map[structure] ?? "その他";
}
