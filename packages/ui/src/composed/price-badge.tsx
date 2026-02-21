import { cn } from "../utils";

/**
 * AI price prediction badge.
 * Displays the predicted price with confidence interval and visual indicator.
 * Uses the --sumi-ai-* color palette to distinguish AI-generated content.
 */
interface PriceBadgeProps {
    predictedPrice: number;
    listingPrice: number;
    confidenceLower?: number;
    confidenceUpper?: number;
    locale?: "ja" | "en";
    className?: string;
}

function formatPriceJa(yen: number): string {
    const man = Math.floor(yen / 10000);
    if (man >= 10000) {
        const oku = Math.floor(man / 10000);
        const remainingMan = man % 10000;
        if (remainingMan === 0) return `${oku}億円`;
        return `${oku}億${remainingMan.toLocaleString("ja-JP")}万円`;
    }
    return `${man.toLocaleString("ja-JP")}万円`;
}

export function PriceBadge({
    predictedPrice,
    listingPrice,
    confidenceLower,
    confidenceUpper,
    locale = "ja",
    className,
}: PriceBadgeProps) {
    const diff = ((listingPrice - predictedPrice) / predictedPrice) * 100;
    const isOverpriced = diff > 5;
    const isUnderpriced = diff < -5;
    const isFair = !isOverpriced && !isUnderpriced;

    const label = isOverpriced
        ? locale === "ja" ? "割高" : "Above estimate"
        : isUnderpriced
            ? locale === "ja" ? "割安" : "Below estimate"
            : locale === "ja" ? "適正価格" : "Fair price";

    return (
        <div
            className={cn(
                "rounded-lg border p-3",
                "bg-[#F6F4FF] border-[#E2DCF5]",
                className,
            )}
        >
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-[#7C6DAF] font-medium">
                    {locale === "ja" ? "AI推定価格" : "AI Estimate"}
                </span>
                <span
                    className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full font-medium",
                        isFair && "bg-[#E6F4ED] text-[#2E7D5B]",
                        isOverpriced && "bg-[#FFF8E1] text-[#B8860B]",
                        isUnderpriced && "bg-[#E6F4ED] text-[#2E7D5B]",
                    )}
                >
                    {label}
                </span>
            </div>
            <div className="text-lg font-bold text-[#1A1A2E]">
                {formatPriceJa(predictedPrice)}
            </div>
            {confidenceLower !== undefined && confidenceUpper !== undefined && (
                <div className="text-xs text-[#6B6B80] mt-0.5">
                    {formatPriceJa(confidenceLower)} 〜 {formatPriceJa(confidenceUpper)}
                </div>
            )}
            <div className="text-xs text-[#6B6B80] mt-1 italic">
                {locale === "ja"
                    ? "※ AIによる参考推定値です"
                    : "※ AI estimate, not an appraisal"}
            </div>
        </div>
    );
}
