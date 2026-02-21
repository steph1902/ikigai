"use client";

import { useChat } from "ai/react";
import { ChatMessage } from "@ikigai/ui/chat-message";
import { Button } from "@ikigai/ui/button";
import { Input } from "@ikigai/ui/input";
import { Send } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ChatPage() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } =
        useChat({
            api: "/api/chat",
            initialMessages: [
                {
                    id: "welcome",
                    role: "assistant",
                    content: "Hello! I'm Ikigai, your AI real estate assistant. I can help you find properties, schedule viewings, or answer questions about buying a home in Japan. How can I assist you today?"
                }
            ]
        });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col bg-sumi-bg-primary">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                <div className="mx-auto max-w-3xl space-y-4">
                    {messages.map((m) => (
                        <ChatMessage
                            key={m.id}
                            role={m.role as "user" | "assistant" | "system"}
                            content={m.content}
                            isStreaming={isLoading && m.role === "assistant" && m === messages[messages.length - 1]}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="border-t border-sumi-border bg-sumi-bg-elevated p-4">
                <div className="mx-auto max-w-3xl">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Ask about properties, regulations, or schedule a viewing..."
                            className="flex-1"
                        />
                        <Button type="submit" disabled={isLoading || !input.trim()}>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
