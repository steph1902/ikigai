import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium ring-offset-sumi-bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sumi-indigo focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary: "bg-sumi-indigo text-white hover:bg-sumi-indigo-hover",
                secondary:
                    "bg-sumi-bg-recessed text-sumi-ink border border-sumi-border hover:bg-sumi-border",
                warm: "bg-sumi-warm text-white hover:opacity-90",
                ghost: "hover:bg-sumi-bg-recessed text-sumi-ink",
                danger: "bg-sumi-danger text-white hover:opacity-90",
                link: "text-sumi-indigo underline-offset-4 hover:underline",
            },
            size: {
                sm: "h-8 px-3 text-sm",
                md: "h-10 px-4 text-base",
                lg: "h-12 px-6 text-lg",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = "Button";

export { Button, buttonVariants };
