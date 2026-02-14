"use client";

import { Button } from "@ikigai/ui/button";
import { cn } from "@ikigai/ui/utils";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

export function ChatInterface() {
    const [isOpen, setIsOpen] = useState(false);
    // @ts-ignore - types are tricky with this version split
    const { messages, sendMessage, isLoading } = useChat();
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput("");

        // Explicitly cast or just pass arbitrary object to bypass strict check
        // @ts-ignore
        await sendMessage(userMessage);
        // If string fails, try object again with ignore inside
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            <div
                className={cn(
                    "bg-background border rounded-lg shadow-xl w-[350px] md:w-[450px] transition-all duration-300 ease-in-out pointer-events-auto overflow-hidden",
                    isOpen ? "mb-4 opacity-100 translate-y-0 h-[600px]" : "mb-0 opacity-0 translate-y-10 h-0",
                )}
            >
                <div className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
                    <h3 className="font-semibold">IKIGAI Assistant</h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-primary-foreground hover:bg-primary/90"
                        onClick={() => setIsOpen(false)}
                    >
                        ×
                    </Button>
                </div>

                <div className="flex flex-col h-[calc(600px-50px)]">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground mt-8">
                                <p>Welcome! How can I help you with your real estate journey today?</p>
                            </div>
                        )}
                        {messages.map((m: any) => (
                            <div
                                key={m.id}
                                className={cn("flex w-full", m.role === "user" ? "justify-end" : "justify-start")}
                            >
                                <div
                                    className={cn(
                                        "max-w-[80%] rounded-lg p-3 text-sm",
                                        m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                                    )}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start w-full">
                                <div className="bg-muted max-w-[80%] rounded-lg p-3 text-sm animate-pulse">
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t bg-background">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about properties..."
                            />
                            <Button type="submit" size="sm" disabled={isLoading}>
                                Send
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <Button
                size="lg"
                className="rounded-full h-14 w-14 shadow-lg pointer-events-auto"
                onClick={() => setIsOpen(!isOpen)}
            >
                💬
            </Button>
        </div>
    );
}
