import React, { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "./dropdown-menu";
import { Input } from "./input";
import { ChevronDown, Search, Check, Loader2 } from "lucide-react";
import { cn } from "@/utils";

interface InfiniteSelectProps<T> {
    value?: string;
    onValueChange?: (value: string, item?: T) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    loadingPlaceholder?: string;
    noItemsPlaceholder?: string;
    
    search?: string;
    onSearchChange?: (search: string) => void;
    
    items: T[];
    isLoading?: boolean;
    isFetchingNextPage?: boolean;
    hasNextPage?: boolean;
    fetchNextPage?: () => void;
    
    getItemKey?: (item: T) => string;
    getItemLabel?: (item: T) => string;
    
    selectedLabel?: string;
    
    // Controlled open state
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    
    // Custom Slots
    trigger?: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    renderCustomItem?: (item: T, closeDropdown: () => void) => React.ReactNode;
    
    align?: "start" | "end" | "center";
    className?: string;
    contentClassName?: string;
    
    extraAction?: {
        id: string;
        label: string;
        icon?: React.ReactNode;
        onClick?: () => void;
    };
}

export function InfiniteSelect<T>({
    value = "",
    onValueChange,
    placeholder = "Select item...",
    searchPlaceholder = "Search...",
    loadingPlaceholder = "Loading...",
    noItemsPlaceholder = "No items found",
    search,
    onSearchChange,
    items,
    isLoading = false,
    isFetchingNextPage = false,
    hasNextPage = false,
    fetchNextPage,
    getItemKey,
    getItemLabel,
    selectedLabel,
    open,
    onOpenChange,
    trigger,
    header,
    footer,
    renderCustomItem,
    align = "start",
    className,
    contentClassName,
    extraAction,
}: InfiniteSelectProps<T>) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = open !== undefined ? open : internalOpen;
    const setIsOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (
            scrollHeight - scrollTop <= clientHeight * 1.5 &&
            hasNextPage &&
            !isFetchingNextPage &&
            fetchNextPage
        ) {
            fetchNextPage();
        }
    };

    const selectedItem = getItemKey ? items.find((item) => getItemKey(item) === value) : undefined;
    const triggerText = selectedItem && getItemLabel
        ? getItemLabel(selectedItem)
        : selectedLabel
        ? selectedLabel
        : value
        ? loadingPlaceholder
        : placeholder;

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            {trigger ? (
                trigger
            ) : (
                <DropdownMenuTrigger
                    className={cn(
                        "w-full bg-dashboard-background border border-dashboard-border justify-between text-sm text-dashboard-foreground font-normal rounded-md px-3 py-2 flex items-center h-10 select-none outline-none focus:ring-1 focus:ring-dashboard-primary/20 cursor-pointer",
                        className
                    )}
                    aria-label="Toggle select dropdown"
                >
                    <span className="truncate">{triggerText}</span>
                    <ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
                </DropdownMenuTrigger>
            )}
            <DropdownMenuContent
                align={align}
                className={cn(
                    "w-(--anchor-width) p-1.5 rounded-xl border border-dashboard-border shadow-2xl bg-dashboard-card flex flex-col z-[100]",
                    contentClassName
                )}
            >
                {header ? (
                    header
                ) : onSearchChange && search !== undefined ? (
                    <div 
                        className="flex items-center gap-2 px-2.5 py-2 border-b border-dashboard-border bg-dashboard-background/30 rounded-t-lg"
                        onKeyDown={(e) => e.stopPropagation()}
                    >
                        <Search className="w-3.5 h-3.5 text-dashboard-muted-foreground shrink-0" />
                        <Input
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="h-7 border-none bg-transparent p-0 text-xs text-dashboard-foreground placeholder:text-dashboard-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0"
                        />
                    </div>
                ) : null}

                <div
                    className="flex flex-col gap-0.5 max-h-[350px] overflow-y-auto custom-scrollbar mt-1.5"
                    onScroll={handleScroll}
                >
                    {extraAction && (
                        <DropdownMenuItem
                            onClick={() => {
                                if (extraAction.onClick) {
                                    extraAction.onClick();
                                } else if (onValueChange) {
                                    onValueChange(extraAction.id);
                                }
                                setIsOpen(false);
                            }}
                            className="flex items-center justify-between text-xs font-semibold py-2 px-2.5 rounded-md hover:bg-dashboard-secondary focus:bg-dashboard-secondary cursor-pointer"
                        >
                            <span className="flex items-center gap-2 text-dashboard-primary font-bold">
                                {extraAction.icon}
                                {extraAction.label}
                            </span>
                            {value === extraAction.id && (
                                <Check className="w-3.5 h-3.5 text-dashboard-primary" />
                            )}
                        </DropdownMenuItem>
                    )}

                    {isLoading ? (
                        <div className="p-3 text-center text-xs text-dashboard-muted-foreground">
                            {loadingPlaceholder}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="p-3 text-center text-xs text-dashboard-muted-foreground">
                            {noItemsPlaceholder}
                        </div>
                    ) : renderCustomItem ? (
                        items.map((item) => renderCustomItem(item, () => setIsOpen(false)))
                    ) : getItemKey && getItemLabel ? (
                        items.map((item) => {
                            const key = getItemKey(item);
                            const label = getItemLabel(item);
                            const isSelected = value === key;
                            return (
                                <DropdownMenuItem
                                    key={key}
                                    onClick={() => {
                                        if (onValueChange) {
                                            onValueChange(key, item);
                                        }
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center justify-between text-xs py-2 px-2.5 rounded-md hover:bg-dashboard-secondary focus:bg-dashboard-secondary cursor-pointer"
                                >
                                    <span className="truncate">{label}</span>
                                    {isSelected && (
                                        <Check className="w-3.5 h-3.5 text-dashboard-primary" />
                                    )}
                                </DropdownMenuItem>
                            );
                        })
                    ) : null}

                    {isFetchingNextPage && (
                        <div className="py-2 flex justify-center text-dashboard-muted-foreground shrink-0">
                            <Loader2 size={14} className="animate-spin" />
                        </div>
                    )}
                </div>

                {footer}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
