"use client";

import { JOURNEY_STAGES, STAGE_INFO, getJourneyContext } from "@ikigai/domain/journey";
import type { JourneyStage } from "@ikigai/domain/journey";
import { Button } from "@ikigai/ui/button";
import {
    Check,
    ChevronRight,
    Clock,
    Eye,
    FileCheck,
    FileText,
    Key,
    Landmark,
    Search,
} from "lucide-react";
import { useState } from "react";

const STAGE_ICONS: Record<JourneyStage, React.ElementType> = {
    search: Search,
    viewing: Eye,
    offer: FileText,
    contract: FileCheck,
    loan: Landmark,
    closing: Key,
};

export default function JourneyPage() {
    const [currentStage, setCurrentStage] = useState<JourneyStage>("search");
    const journey = getJourneyContext(currentStage);

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto max-w-4xl px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">購入の進捗管理</h1>
                    <p className="mt-1 text-muted-foreground">
                        不動産購入の各ステージを確認し、次のステップを把握しましょう
                    </p>
                </div>

                {/* Progress bar */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">全体の進捗</span>
                        <span className="text-sm text-muted-foreground">{journey.progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                            className="h-2 rounded-full bg-accent transition-all duration-500"
                            style={{ width: `${journey.progress}%` }}
                        />
                    </div>
                </div>

                {/* Stage stepper */}
                <div className="mb-10 space-y-0">
                    {JOURNEY_STAGES.map((stage, index) => {
                        const info = STAGE_INFO[stage];
                        const Icon = STAGE_ICONS[stage];
                        const isCompleted = info.order < journey.current.order;
                        const isCurrent = stage === currentStage;
                        const isUpcoming = info.order > journey.current.order;

                        return (
                            <div key={stage}>
                                <button
                                    type="button"
                                    onClick={() => setCurrentStage(stage)}
                                    className={`flex w-full items-start gap-4 rounded-xl p-4 text-left transition-all ${isCurrent
                                            ? "bg-accent/10 border border-accent/30 shadow-sm"
                                            : "hover:bg-secondary/50"
                                        }`}
                                >
                                    {/* Step indicator */}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${isCompleted
                                                    ? "border-accent bg-accent text-white"
                                                    : isCurrent
                                                        ? "border-accent bg-accent/10 text-accent"
                                                        : "border-muted-foreground/30 text-muted-foreground/50"
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <Check className="h-5 w-5" />
                                            ) : (
                                                <Icon className="h-5 w-5" />
                                            )}
                                        </div>
                                        {index < JOURNEY_STAGES.length - 1 && (
                                            <div
                                                className={`mt-1 h-8 w-0.5 ${isCompleted ? "bg-accent" : "bg-muted-foreground/20"
                                                    }`}
                                            />
                                        )}
                                    </div>

                                    {/* Stage content */}
                                    <div className="flex-1 pb-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className={`font-semibold ${isUpcoming ? "text-muted-foreground" : ""}`}>
                                                {info.labelJa}
                                            </h3>
                                            {isCompleted && (
                                                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                                                    完了
                                                </span>
                                            )}
                                            {isCurrent && (
                                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                    進行中
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-0.5 text-sm text-muted-foreground">
                                            {info.descriptionJa}
                                        </p>
                                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span>目安: {info.estimatedDurationJa}</span>
                                        </div>
                                    </div>

                                    <ChevronRight
                                        className={`mt-1 h-5 w-5 shrink-0 ${isCurrent ? "text-accent" : "text-muted-foreground/30"
                                            }`}
                                    />
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Current stage detail */}
                <div className="rounded-xl border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        現在のステージ: {journey.current.labelJa}
                    </h2>
                    <p className="mb-4 text-sm text-muted-foreground">
                        {journey.current.descriptionJa}
                    </p>

                    {journey.current.requiredDocumentsJa.length > 0 && (
                        <div className="mb-4">
                            <h3 className="mb-2 text-sm font-medium">必要書類</h3>
                            <ul className="space-y-1">
                                {journey.current.requiredDocumentsJa.map((doc: string) => (
                                    <li key={doc} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                                        {doc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {journey.upcoming.length > 0 && (
                        <div className="mt-4 rounded-lg bg-secondary/50 p-4">
                            <h3 className="mb-2 text-sm font-medium">次のステップ</h3>
                            <p className="text-sm text-muted-foreground">
                                {journey.upcoming[0]?.labelJa}: {journey.upcoming[0]?.descriptionJa}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
