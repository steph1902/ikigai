import * as React from "react";
import { cn } from "@/utils";

export interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {
    fullWidth?: boolean;
}

const PageShell = React.forwardRef<HTMLDivElement, PageShellProps>(
    ({ className, fullWidth = false, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex min-h-screen flex-col bg-sumi-bg-primary",
                    !fullWidth && "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
                    className,
                )}
                {...props}
            />
        );
    },
);
PageShell.displayName = "PageShell";

export { PageShell };
