import { describe, expect, it } from "vitest";
import {
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
} from "../formatters/japanese";

describe("formatPrice", () => {
    it("formats prices under 1億 in 万円", () => {
        expect(formatPrice(50_000_000)).toBe("5,000万円");
        expect(formatPrice(72_800_000)).toBe("7,280万円");
    });

    it("formats prices at 1億 exactly", () => {
        expect(formatPrice(100_000_000)).toBe("1億円");
    });

    it("formats prices over 1億 with 億 and 万", () => {
        expect(formatPrice(120_000_000)).toBe("1億2,000万円");
        expect(formatPrice(250_500_000)).toBe("2億5,050万円");
    });

    it("formats small prices", () => {
        expect(formatPrice(10_000)).toBe("1万円");
        expect(formatPrice(100_000)).toBe("10万円");
    });
});

describe("formatPriceShort", () => {
    it("returns short labels", () => {
        expect(formatPriceShort(50_000_000)).toBe("5,000万");
        expect(formatPriceShort(100_000_000)).toBe("1億");
        expect(formatPriceShort(120_000_000)).toBe("1億2,000万");
    });
});

describe("formatArea", () => {
    it("formats with tsubo by default", () => {
        expect(formatArea(65.5)).toBe("65.50㎡（19.81坪）");
    });

    it("formats without tsubo when disabled", () => {
        expect(formatArea(65.5, false)).toBe("65.50㎡");
    });
});

describe("formatBuildingAge", () => {
    it("returns 新築 for 0 years", () => {
        expect(formatBuildingAge(0)).toBe("新築");
    });

    it("formats age in years", () => {
        expect(formatBuildingAge(15)).toBe("築15年");
        expect(formatBuildingAge(1)).toBe("築1年");
    });
});

describe("formatStationAccess", () => {
    it("formats full station access", () => {
        expect(formatStationAccess("恵比寿", "JR山手線", 5)).toBe(
            "JR山手線「恵比寿」駅 徒歩5分",
        );
    });
});

describe("formatStationAccessShort", () => {
    it("formats short station access", () => {
        expect(formatStationAccessShort("渋谷", 3)).toBe("渋谷駅 徒歩3分");
    });
});

describe("formatDate", () => {
    const testDate = new Date(2024, 2, 15); // March 15, 2024

    it("formats in western style by default", () => {
        expect(formatDate(testDate)).toBe("2024年3月15日");
    });

    it("formats in imperial style", () => {
        expect(formatDate(testDate, "imperial")).toBe("令和6年3月15日");
    });

    it("formats in short style", () => {
        expect(formatDate(testDate, "short")).toBe("2024/03/15");
    });

    it("handles Heisei era", () => {
        const heiseiDate = new Date(2018, 0, 1);
        expect(formatDate(heiseiDate, "imperial")).toBe("平成30年1月1日");
    });
});

describe("formatMonthlyCosts", () => {
    it("returns costs with total", () => {
        const result = formatMonthlyCosts({
            managementFee: 15000,
            repairReserveFund: 10000,
        });
        expect(result).toHaveLength(3);
        expect(result[0]?.label).toBe("管理費");
        expect(result[2]?.label).toBe("月額合計");
        expect(result[2]?.amount).toBe("25,000円/月");
    });

    it("includes parking when provided", () => {
        const result = formatMonthlyCosts({
            managementFee: 15000,
            repairReserveFund: 10000,
            parkingFee: 20000,
        });
        expect(result).toHaveLength(4);
        expect(result[3]?.amount).toBe("45,000円/月");
    });
});

describe("formatEarthquakeStandard", () => {
    it("returns safe for new standard", () => {
        const result = formatEarthquakeStandard("new");
        expect(result.label).toBe("新耐震");
        expect(result.variant).toBe("safe");
    });

    it("returns warning for old standard", () => {
        const result = formatEarthquakeStandard("old");
        expect(result.label).toBe("旧耐震");
        expect(result.variant).toBe("warning");
    });
});

describe("formatFloorInfo", () => {
    it("formats floor info", () => {
        expect(formatFloorInfo(12, 25)).toBe("12階/25階建");
    });

    it("returns empty for null values", () => {
        expect(formatFloorInfo(null, null)).toBe("");
    });
});

describe("formatStructure", () => {
    it("formats structure types", () => {
        expect(formatStructure("rc")).toBe("RC造");
        expect(formatStructure("wood")).toBe("木造");
        expect(formatStructure("src")).toBe("SRC造");
    });
});
