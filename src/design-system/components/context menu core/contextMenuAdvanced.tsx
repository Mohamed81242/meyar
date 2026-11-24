import * as React from "react";
import { useTranslation } from "react-i18next";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuPortal,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "./context-menu";

const useIsRTL = () => {
    const { i18n } = useTranslation();
    return i18n.language === "ar";
};

// ─── 1. Reusable Advanced Components ──────────────────────────────────────────

export interface ContextMenuAdvancedProps {
    /** The element that triggers the context menu on right-click */
    children: React.ReactNode;
    /** The content of the context menu (items, submenus, separators) */
    menuContent: React.ReactNode;
    /** Optional class name for the menu content container (e.g. to set width) */
    className?: string;
}

/**
 * A wrapper component that sets up the Context Menu Root, Trigger, and Content container.
 */
export function ContextMenuAdvanced({
    children,
    menuContent,
    className = "w-fit min-w-32",
}: ContextMenuAdvancedProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent className={className}>
                {menuContent}
            </ContextMenuContent>
        </ContextMenu>
    );
}

export interface ContextMenuAdvancedItemProps extends React.ComponentPropsWithoutRef<
    typeof ContextMenuItem
> {
    /** Optional Lucide icon component to display on the left */
    icon?: React.ElementType;
    /** Optional keyboard shortcut string to display on the right */
    shortcut?: string;
    /** Variation of the item (e.g., "destructive" for delete actions) */
    variant?: "default" | "destructive";
}

/**
 * A standard context menu item that automatically handles Icon and Shortcut placement.
 */
export const ContextMenuAdvancedItem = React.forwardRef<
    React.ElementRef<typeof ContextMenuItem>,
    ContextMenuAdvancedItemProps
>(({ icon: Icon, shortcut, variant, children, ...props }, ref) => {
    const isRTL = useIsRTL();
    return (
        <ContextMenuItem ref={ref} variant={variant} {...props}>
            {Icon && <Icon className={isRTL ? "ml-2" : "mr-2"} />}
            {children}
            {shortcut && (
                <ContextMenuShortcut className={isRTL ? "ml-2" : "mr-2"}>
                    {shortcut}
                </ContextMenuShortcut>
            )}
        </ContextMenuItem>
    );
});
ContextMenuAdvancedItem.displayName = "ContextMenuAdvancedItem";

export interface ContextMenuAdvancedSubProps {
    /** Optional Lucide icon component to display on the left of the trigger */
    icon?: React.ElementType;
    /** The label for the sub-menu trigger */
    label: React.ReactNode;
    /** Optional keyboard shortcut string to display on the right of the trigger */
    shortcut?: string;
    /** The content of the sub-menu */
    children: React.ReactNode;
    /** Optional class name for the sub-menu content container (e.g. to set width) */
    contentClassName?: string;
}

/**
 * A nested sub-menu component that automatically handles the Sub Root, Trigger, and Content container.
 */
export function ContextMenuAdvancedSub({
    icon: Icon,
    label,
    shortcut,
    children,
    contentClassName = "w-fit min-w-32",
}: ContextMenuAdvancedSubProps) {
    const isRTL = useIsRTL();
    return (
        <ContextMenuSub>
            <ContextMenuSubTrigger>
                {Icon && <Icon className={isRTL ? "ml-2" : "mr-2"} />}
                {label}
                {shortcut && (
                    <ContextMenuShortcut className={isRTL ? "ml-2" : "mr-2"}>
                        {shortcut}
                    </ContextMenuShortcut>
                )}
            </ContextMenuSubTrigger>
            <ContextMenuPortal>
                <ContextMenuSubContent className={contentClassName}>
                    {children}
                </ContextMenuSubContent>
            </ContextMenuPortal>
        </ContextMenuSub>
    );
}

/**
 * Expose the separator directly for convenience
 */
export const ContextMenuAdvancedSeparator = ContextMenuSeparator;
