import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils";
import Tooltip from "./Tooltip";

const buttonVariants = cva(
    "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-dashboard-ring focus-visible:ring-3 focus-visible:ring-dashboard-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-dashboard-destructive aria-invalid:ring-3 aria-invalid:ring-dashboard-destructive/20 dark:aria-invalid:border-dashboard-destructive/50 dark:aria-invalid:ring-dashboard-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
    {
        variants: {
            variant: {
                default:
                    "bg-dashboard-primary text-white! hover:bg-dashboard-primary/90 shadow-sm",
                outline:
                    "border-dashboard-border bg-transparent text-dashboard-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground aria-expanded:bg-dashboard-secondary aria-expanded:text-dashboard-foreground",
                secondary:
                    "bg-dashboard-secondary text-dashboard-secondary-foreground hover:bg-dashboard-secondary/80 aria-expanded:bg-dashboard-secondary aria-expanded:text-dashboard-secondary-foreground",
                ghost: "text-dashboard-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground aria-expanded:bg-dashboard-secondary aria-expanded:text-dashboard-foreground",
                destructive:
                    "bg-dashboard-destructive/10 text-dashboard-destructive hover:bg-dashboard-destructive/20 focus-visible:border-dashboard-destructive/40 focus-visible:ring-dashboard-destructive/20",
                link: "text-dashboard-primary underline-offset-4 hover:underline",
            },
            size: {
                default:
                    "h-9 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
                xs: "h-8 gap-1.5 rounded-lg px-3 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
                sm: "h-9 gap-1.5 rounded-lg px-4 text-sm in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-4",
                lg: "h-14 gap-2.5 px-8 text-base has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6 [&_svg:not([class*='size-'])]:size-5",
                icon: "size-11",
                "icon-xs":
                    "size-8 rounded-lg in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-4",
                "icon-sm":
                    "size-9 rounded-lg in-data-[slot=button-group]:rounded-lg",
                "icon-lg": "size-14",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

function Button({
    className,
    variant = "default",
    size = "default",
    asChild, // Destructure but don't use since we don't have Slot
    tooltip,
    tooltipPlacement = "top",
    tooltipDelay,
    ...props
}: ButtonPrimitive.Props &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
        tooltip?: React.ReactNode;
        tooltipPlacement?: "top" | "bottom" | "left" | "right";
        tooltipDelay?: number;
    }) {
    const button = (
        <ButtonPrimitive
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );

    if (tooltip) {
        const isFullWidth = typeof className === "string" && className.includes("w-full");
        return (
            <Tooltip
                content={tooltip}
                placement={tooltipPlacement}
                delay={tooltipDelay}
                parentClassName={isFullWidth ? "w-full" : undefined}
            >
                {button}
            </Tooltip>
        );
    }

    return button;
}

export { Button, buttonVariants };
