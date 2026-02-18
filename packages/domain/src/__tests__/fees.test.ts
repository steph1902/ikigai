import { describe, expect, it } from "vitest";
import { calculateBrokerageFee, calculatePurchaseCosts } from "../rules/fees";

describe("calculateBrokerageFee", () => {
    it("returns zero for zero or negative price", () => {
        expect(calculateBrokerageFee(0).totalFee).toBe(0);
        expect(calculateBrokerageFee(-100).totalFee).toBe(0);
    });

    it("calculates 5% for prices under ¥2M", () => {
        const result = calculateBrokerageFee(1_000_000);
        expect(result.feeBeforeTax).toBe(50_000);
        expect(result.tax).toBe(5_000);
        expect(result.totalFee).toBe(55_000);
        expect(result.method).toBe("tiered");
    });

    it("uses tiered calculation for ¥2M-¥4M", () => {
        const result = calculateBrokerageFee(3_000_000);
        // 2M×5% + 1M×4% = 100k + 40k = 140k
        expect(result.feeBeforeTax).toBe(140_000);
        expect(result.method).toBe("tiered");
    });

    it("uses simplified formula for prices over ¥4M", () => {
        const result = calculateBrokerageFee(50_000_000);
        // 50M×3% + 60k = 1,560,000
        expect(result.feeBeforeTax).toBe(1_560_000);
        expect(result.tax).toBe(156_000);
        expect(result.totalFee).toBe(1_716_000);
        expect(result.method).toBe("simplified");
    });

    it("handles typical Tokyo apartment price", () => {
        const result = calculateBrokerageFee(72_800_000);
        // 72.8M×3% + 60k = 2,244,000 + 60,000 = 2,244,000
        expect(result.feeBeforeTax).toBe(2_244_000);
        expect(result.totalFee).toBe(2_468_400);
    });
});

describe("calculatePurchaseCosts", () => {
    it("returns all cost components", () => {
        const result = calculatePurchaseCosts(50_000_000);
        expect(result.brokerageFee).toBeGreaterThan(0);
        expect(result.registrationTax).toBeGreaterThan(0);
        expect(result.stampDuty).toBeGreaterThan(0);
        expect(result.acquisitionTax).toBeGreaterThan(0);
        expect(result.totalCosts).toBe(
            result.brokerageFee +
            result.registrationTax +
            result.stampDuty +
            result.acquisitionTax,
        );
        expect(result.totalWithProperty).toBe(50_000_000 + result.totalCosts);
    });

    it("stamp duty scales with price", () => {
        const low = calculatePurchaseCosts(5_000_000);
        const high = calculatePurchaseCosts(100_000_000);
        expect(high.stampDuty).toBeGreaterThan(low.stampDuty);
    });
});
