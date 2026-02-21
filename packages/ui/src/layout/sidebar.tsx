import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../utils";

const sidebarVariants = cva(
    "relative flex h-screen flex-col border-r border-sumi-border bg-sumi-bg-primary transition-all duration-300",
    {
        variants: {
            collapsed: {
                true: "w-16",
                false: "w-64",
            },
        },
        defaultVariants: {
            collapsed: false,
        },
    },
);

export interface SidebarProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> { }

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
    ({ className, collapsed, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(sidebarVariants({ collapsed }), className)}
                {...props}
            />
        );
    },
);
Sidebar.displayName = "Sidebar";

export { Sidebar, sidebarVariants };
