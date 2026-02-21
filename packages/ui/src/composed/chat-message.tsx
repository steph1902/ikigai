import { Bot, User } from "lucide-react";
import * as React from "react";
import { cn } from "../utils";

interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
    role: "user" | "assistant" | "system";
    content: string;
    timestamp?: string;
    isStreaming?: boolean;
}

export function ChatMessage({
    className,
    role,
    content,
    timestamp,
    isStreaming,
    ...props
}: ChatMessageProps) {
    const isUser = role === "user";

    return (
        <div
            className={cn(
                "flex w-full gap-4 p-4 transition-colors",
                isUser ? "bg-sumi-bg-primary" : "bg-sumi-bg-recessed/50",
                className,
            )}
            {...props}
        >
            <div
                className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                    isUser
                        ? "border-sumi-border bg-sumi-bg-elevated text-sumi-ink"
                        : "border-sumi-ai-border bg-sumi-ai-surface text-sumi-ai-accent",
                )}
            >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-sumi-ink">
                        {isUser ? "You" : "Ikigai Assistant"}
                    </span>
                    {timestamp && (
                        <span className="text-xs text-sumi-ink-muted">{timestamp}</span>
                    )}
                </div>
                <div className="prose prose-sm max-w-none text-sumi-ink">
                    {content}
                    {isStreaming && (
                        <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-sumi-indigo" />
                    )}
                </div>
            </div>
        </div>
    );
}
