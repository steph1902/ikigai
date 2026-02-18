"use client";

import { Button } from "@ikigai/ui/button";
import { AlertTriangle } from "lucide-react";
import * as React from "react";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
                    <AlertTriangle className="mb-4 h-12 w-12 text-destructive" />
                    <h2 className="mb-2 text-xl font-semibold">エラーが発生しました</h2>
                    <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">
                        申し訳ございません。予期しないエラーが発生しました。ページを再読み込みするか、しばらくしてからもう一度お試しください。
                    </p>
                    <Button
                        onClick={() => this.setState({ hasError: false, error: null })}
                    >
                        再試行
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
