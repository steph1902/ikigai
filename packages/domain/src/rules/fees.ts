/**
 * Japanese Real Estate Brokerage Fee Calculator.
 *
 * Calculates legal maximum brokerage (仲介手数料) per the
 * Building Lots and Buildings Transaction Business Act (宅建業法).
 *
 * Tiered formula:
 * - Up to ¥2,000,000: 5% + tax
 * - ¥2,000,001 to ¥4,000,000: 4% + tax
 * - Over ¥4,000,000: 3% + tax (simplified: price × 3% + 60,000 + tax)
 */

const TAX_RATE = 0.10; // 消費税 10%

interface BrokerageResult {
    /** Fee before tax in yen */
    feeBeforeTax: number;
    /** Tax amount in yen */
    tax: number;
    /** Total fee including tax in yen */
    totalFee: number;
    /** Calculation method used */
    method: "tiered" | "simplified";
}

/**
 * Calculate the legal maximum brokerage fee.
 * For prices over ¥4M, uses the simplified formula: price × 3% + 60,000.
 */
export function calculateBrokerageFee(price: number): BrokerageResult {
    if (price <= 0) {
        return { feeBeforeTax: 0, tax: 0, totalFee: 0, method: "tiered" };
    }

    let feeBeforeTax: number;
    let method: "tiered" | "simplified";

    if (price > 4_000_000) {
        // Simplified formula (equivalent to tiered but faster)
        feeBeforeTax = price * 0.03 + 60_000;
        method = "simplified";
    } else if (price > 2_000_000) {
        // Tiered: first 2M at 5% + remainder at 4%
        feeBeforeTax = 2_000_000 * 0.05 + (price - 2_000_000) * 0.04;
        method = "tiered";
    } else {
        // 5% for entire amount
        feeBeforeTax = price * 0.05;
        method = "tiered";
    }

    const tax = Math.floor(feeBeforeTax * TAX_RATE);
    const totalFee = Math.floor(feeBeforeTax) + tax;

    return {
        feeBeforeTax: Math.floor(feeBeforeTax),
        tax,
        totalFee,
        method,
    };
}

/**
 * Calculate estimated total purchase costs for a property.
 */
export function calculatePurchaseCosts(price: number): {
    brokerageFee: number;
    registrationTax: number;
    stampDuty: number;
    acquisitionTax: number;
    totalCosts: number;
    totalWithProperty: number;
} {
    const brokerage = calculateBrokerageFee(price);

    // Registration tax: ~2% of assessed value (assessed ≈ 70% of market)
    const registrationTax = Math.floor(price * 0.7 * 0.02);

    // Stamp duty based on contract amount
    const stampDuty = getStampDuty(price);

    // Real estate acquisition tax: ~3% of assessed value
    const acquisitionTax = Math.floor(price * 0.7 * 0.03);

    const totalCosts =
        brokerage.totalFee + registrationTax + stampDuty + acquisitionTax;

    return {
        brokerageFee: brokerage.totalFee,
        registrationTax,
        stampDuty,
        acquisitionTax,
        totalCosts,
        totalWithProperty: price + totalCosts,
    };
}

/**
 * Get stamp duty (印紙税) based on contract price.
 */
function getStampDuty(price: number): number {
    if (price <= 1_000_000) return 500;
    if (price <= 5_000_000) return 1_000;
    if (price <= 10_000_000) return 5_000;
    if (price <= 50_000_000) return 10_000;
    if (price <= 100_000_000) return 30_000;
    if (price <= 500_000_000) return 60_000;
    return 160_000;
}
