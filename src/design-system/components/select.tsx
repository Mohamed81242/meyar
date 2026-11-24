import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";

import { cn } from "@/utils";
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react";

const Select = SelectPrimitive.Root;

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
    return (
        <SelectPrimitive.Group
            data-slot="select-group"
            className={cn("scroll-my-1 p-1", className)}
            {...props}
        />
    );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
    return (
        <SelectPrimitive.Value
            data-slot="select-value"
            className={cn("flex flex-1 text-left rtl:text-right text-dashboard-foreground text-xs font-medium truncate", className)}
            {...props}
        />
    );
}

function SelectTrigger({
    className,
    size = "default",
    children,
    ...props
}: SelectPrimitive.Trigger.Props & {
    size?: "sm" | "default";
}) {
    return (
        <SelectPrimitive.Trigger
            data-slot="select-trigger"
            data-size={size}
            className={cn(
                "flex w-fit items-center justify-between gap-2 rounded-xl border border-dashboard-border bg-dashboard-card hover:bg-dashboard-secondary/50 py-2 px-3 text-xs text-dashboard-foreground font-medium whitespace-nowrap transition-colors outline-none select-none cursor-pointer focus-visible:border-dashboard-primary focus-visible:ring-1 focus-visible:ring-dashboard-primary disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-dashboard-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-7.5 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                className,
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon
                render={
                    <ChevronDownIcon className="pointer-events-none size-3.5 text-dashboard-muted-foreground transition-transform data-popup-open:rotate-180" />
                }
            />
        </SelectPrimitive.Trigger>
    );
}

function SelectContent({
    className,
    children,
    side = "bottom",
    sideOffset = 6,
    align = "start",
    alignOffset = 0,
    alignItemWithTrigger = false,
    ...props
}: SelectPrimitive.Popup.Props &
    Pick<
        SelectPrimitive.Positioner.Props,
        "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
    >) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Positioner
                side={side}
                sideOffset={sideOffset}
                align={align}
                alignOffset={alignOffset}
                alignItemWithTrigger={alignItemWithTrigger}
                className="isolate z-[100]"
            >
                <SelectPrimitive.Popup
                    data-slot="select-content"
                    data-align-trigger={alignItemWithTrigger}
                    className={cn(
                        "relative isolate z-[100] max-h-(--available-height) w-(--anchor-width) min-w-40 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-xl border border-dashboard-border bg-dashboard-card p-1.5 text-dashboard-foreground shadow-2xl duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
                        className,
                    )}
                    {...props}
                >
                    <SelectScrollUpButton />
                    <SelectPrimitive.List className="space-y-0.5">{children}</SelectPrimitive.List>
                    <SelectScrollDownButton />
                </SelectPrimitive.Popup>
            </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
    );
}

function SelectLabel({
    className,
    ...props
}: SelectPrimitive.GroupLabel.Props) {
    return (
        <SelectPrimitive.GroupLabel
            data-slot="select-label"
            className={cn(
                "px-2 py-1 text-[11px] font-semibold text-dashboard-muted-foreground",
                className,
            )}
            {...props}
        />
    );
}

function SelectItem({
    className,
    children,
    ...props
}: SelectPrimitive.Item.Props) {
    return (
        <SelectPrimitive.Item
            data-slot="select-item"
            className={cn(
                "relative flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg py-2 px-2.5 text-xs text-dashboard-foreground font-medium outline-hidden select-none data-highlighted:bg-dashboard-secondary data-highlighted:text-dashboard-foreground focus:bg-dashboard-secondary focus:text-dashboard-foreground data-selected:text-dashboard-primary data-selected:font-semibold data-disabled:pointer-events-none data-disabled:opacity-50 transition-colors",
                className,
            )}
            {...props}
        >
            <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
                {children}
            </SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator
                render={
                    <span className="pointer-events-none flex size-3.5 items-center justify-center text-dashboard-primary shrink-0" />
                }
            >
                <CheckIcon className="pointer-events-none size-3.5" />
            </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
    );
}

function SelectSeparator({
    className,
    ...props
}: SelectPrimitive.Separator.Props) {
    return (
        <SelectPrimitive.Separator
            data-slot="select-separator"
            className={cn(
                "pointer-events-none -mx-1 my-1 h-px bg-dashboard-border",
                className,
            )}
            {...props}
        />
    );
}

function SelectScrollUpButton({
    className,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
    return (
        <SelectPrimitive.ScrollUpArrow
            data-slot="select-scroll-up-button"
            className={cn(
                "top-0 z-10 flex w-full cursor-default items-center justify-center bg-dashboard-card py-1 text-dashboard-muted-foreground [&_svg]:size-3.5",
                className,
            )}
            {...props}
        >
            <ChevronUpIcon />
        </SelectPrimitive.ScrollUpArrow>
    );
}

function SelectScrollDownButton({
    className,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
    return (
        <SelectPrimitive.ScrollDownArrow
            data-slot="select-scroll-down-button"
            className={cn(
                "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-dashboard-card py-1 text-dashboard-muted-foreground [&_svg]:size-3.5",
                className,
            )}
            {...props}
        >
            <ChevronDownIcon />
        </SelectPrimitive.ScrollDownArrow>
    );
}

export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
};
