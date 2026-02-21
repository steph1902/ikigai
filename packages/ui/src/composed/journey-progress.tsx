"use client";

import { cn } from "../utils";

/**
 * Purchase journey progress stepper.
 * Shows the buyer's position in the Japanese real estate purchase workflow.
 * Stages follow the 宅地建物取引業法 (Takken Act) transaction flow.
 */

const JOURNEY_STAGES = [
    { id: "exploring", labelJa: "情報収集", labelEn: "Exploring" },
    { id: "searching", labelJa: "物件検索", labelEn: "Searching" },
    { id: "evaluating", labelJa: "物件検討", labelEn: "Evaluating" },
    { id: "negotiating", labelJa: "交渉中", labelEn: "Negotiating" },
    { id: "contracting", labelJa: "契約手続", labelEn: "Contracting" },
    { id: "closing", labelJa: "引渡準備", labelEn: "Closing" },
    { id: "complete", labelJa: "購入完了", labelEn: "Complete" },
] as const;

type JourneyStageId = (typeof JOURNEY_STAGES)[number]["id"];

interface JourneyProgressProps {
    currentStage: JourneyStageId;
    locale?: "ja" | "en";
    className?: string;
}

export function JourneyProgress({
    currentStage,
    locale = "ja",
    className,
}: JourneyProgressProps) {
    const currentIndex = JOURNEY_STAGES.findIndex((s) => s.id === currentStage);

    return (
        <div className={cn("w-full", className)}>
            <div className="flex items-center justify-between">
                {JOURNEY_STAGES.map((stage, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const label = locale === "ja" ? stage.labelJa : stage.labelEn;

                    return (
                        <div key={stage.id} className="flex flex-col items-center flex-1">
                            {/* Connector line */}
                            <div className="flex items-center w-full">
                                {index > 0 && (
                                    <div
                                        className={cn(
                                            "h-0.5 flex-1",
                                            isCompleted || isCurrent
                                                ? "bg-[#3D5A80]"
                                                : "bg-[#E0E0E8]",
                                        )}
                                    />
                                )}
                                {/* Circle */}
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 transition-colors",
                                        isCompleted && "bg-[#2E7D5B] text-white",
                                        isCurrent && "bg-[#3D5A80] text-white ring-2 ring-[#3D5A80] ring-offset-2",
                                        !isCompleted && !isCurrent && "bg-[#F0F0F5] text-[#6B6B80]",
                                    )}
                                >
                                    {isCompleted ? "✓" : index + 1}
                                </div>
                                {index < JOURNEY_STAGES.length - 1 && (
                                    <div
                                        className={cn(
                                            "h-0.5 flex-1",
                                            isCompleted ? "bg-[#3D5A80]" : "bg-[#E0E0E8]",
                                        )}
                                    />
                                )}
                            </div>
                            {/* Label */}
                            <span
                                className={cn(
                                    "mt-2 text-xs text-center leading-tight",
                                    isCurrent ? "font-semibold text-[#1A1A2E]" : "text-[#6B6B80]",
                                )}
                            >
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
