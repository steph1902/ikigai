import { AlertTriangle, Info, XCircle } from "lucide-react";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const bannerVariants = cva(
    "flex items-start gap-3 rounded-lg border p-4 text-sm shadow-sm",
    {
        variants: {
            type: {
                info: "border-sumi-info bg-sumi-info-bg text-sumi-info",
                warning: "border-sumi-warning bg-sumi-warning-bg text-sumi-warning",
                danger: "border-sumi-danger bg-sumi-danger-bg text-sumi-danger",
            },
        },
        defaultVariants: {
            type: "info",
        },
    },
);

interface RiskFlagBannerProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
    title: string;
    id?: string;
}

export function RiskFlagBanner({
    className,
    type,
    title,
    children,
    ...props
}: RiskFlagBannerProps) {
    const Icon = type === "danger" ? XCircle : type === "warning" ? AlertTriangle : Info;

    return (
        <div className={cn(bannerVariants({ type }), className)} {...props}>
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex-1">
                <h4 className="font-semibold leading-none tracking-tight mb-1">{title}</h4>
                <div className="opacity-90">{children}</div>
            </div>
        </div>
    );
}
