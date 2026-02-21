import { cn } from "../utils";

/**
 * Station access badge.
 * Displays station name, rail line, and walk time in Japanese real estate format.
 * Format: {LINE}「{STATION}」駅 徒歩{N}分
 */
interface StationBadgeProps {
    stationName: string;
    lineName: string;
    walkMinutes: number;
    className?: string;
}

export function StationBadge({
    stationName,
    lineName,
    walkMinutes,
    className,
}: StationBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 text-sm",
                className,
            )}
        >
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[#3D5A80] shrink-0"
            >
                <path d="M4 17V9a8 8 0 0 1 16 0v8" />
                <path d="M4 17h16" />
                <path d="M8 21l-2-4" />
                <path d="M16 21l2-4" />
                <circle cx="9" cy="13" r="1" />
                <circle cx="15" cy="13" r="1" />
            </svg>
            <span className="text-[#6B6B80]">{lineName}</span>
            <span className="font-medium text-[#1A1A2E]">「{stationName}」駅</span>
            <span className="text-[#3D5A80] font-medium">
                徒歩{walkMinutes}分
            </span>
        </span>
    );
}
