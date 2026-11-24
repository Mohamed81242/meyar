import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "@/utils";

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
    return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
    return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverPortal({ ...props }: PopoverPrimitive.Portal.Props) {
    return <PopoverPrimitive.Portal data-slot="popover-portal" {...props} />;
}

function PopoverPositioner({ className, ...props }: PopoverPrimitive.Positioner.Props) {
    return <PopoverPrimitive.Positioner data-slot="popover-positioner" className={cn("z-[99999]", className)} {...props} />;
}

function PopoverContent({
    className,
    align = "center",
    side = "bottom",
    sideOffset = 4,
    ...props
}: PopoverPrimitive.Popup.Props & { align?: any; side?: any; sideOffset?: number }) {
    return (
        <PopoverPortal>
            <PopoverPositioner align={align} side={side} sideOffset={sideOffset}>
                <PopoverPrimitive.Popup
                    data-slot="popover-content"
                    className={cn(
                        "z-[99999] w-auto rounded-xl bg-dashboard-card p-2 text-dashboard-foreground shadow-2xl border border-dashboard-border backdrop-blur-md outline-none duration-100 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                        className
                    )}
                    {...props}
                />
            </PopoverPositioner>
        </PopoverPortal>
    );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverPortal, PopoverPositioner };
