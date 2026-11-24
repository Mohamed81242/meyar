import { MoreHorizontal } from "lucide-react";
import * as React from "react";
import {
    ContextMenuAdvancedItem,
    ContextMenuAdvancedSeparator,
    ContextMenuAdvancedSub,
} from "./context menu core/contextMenuAdvanced";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./dropdown-menu";

export interface TableActionItem<T> {
    id: string;
    label: React.ReactNode | ((item: T) => React.ReactNode);
    icon?: React.ComponentType<{ size?: number; className?: string }>;
    variant?: "default" | "destructive";
    onClick: (item: T) => void;
    /** Sub-actions for nested copy menu */
    subActions?: {
        label: string;
        getValue: (item: T) => string;
    }[];
    /** Hide action condition */
    hidden?: (item: T) => boolean;
    /** Separator line after this action */
    separator?: boolean;
}

export interface RowActionsDropdownProps<T> {
    item: T;
    actions: TableActionItem<T>[];
}

export function renderContextMenuItems<T>(
    item: T,
    actions: TableActionItem<T>[],
): React.ReactNode {
    return (
        <>
            {actions.map((action, index) => {
                if (action.hidden && action.hidden(item)) return null;

                const IconComponent = action.icon;
                const labelText =
                    typeof action.label === "function"
                        ? action.label(item)
                        : action.label;

                if (action.subActions && action.subActions.length > 0) {
                    return (
                        <React.Fragment key={action.id || index}>
                            <ContextMenuAdvancedSub
                                icon={IconComponent}
                                label={labelText}
                            >
                                {action.subActions.map((sub, sIdx) => (
                                    <ContextMenuAdvancedItem
                                        key={sIdx}
                                        onClick={() => {
                                            const val = sub.getValue(item);
                                            if (val) {
                                                navigator.clipboard.writeText(
                                                    val,
                                                );
                                            }
                                        }}
                                    >
                                        {sub.label}
                                    </ContextMenuAdvancedItem>
                                ))}
                            </ContextMenuAdvancedSub>
                            {action.separator && (
                                <ContextMenuAdvancedSeparator className="bg-dashboard-border" />
                            )}
                        </React.Fragment>
                    );
                }

                return (
                    <React.Fragment key={action.id || index}>
                        <ContextMenuAdvancedItem
                            icon={IconComponent}
                            variant={action.variant}
                            onClick={() => action.onClick(item)}
                            className={
                                action.variant === "destructive"
                                    ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    : undefined
                            }
                        >
                            {labelText}
                        </ContextMenuAdvancedItem>
                        {action.separator && (
                            <ContextMenuAdvancedSeparator className="bg-dashboard-border" />
                        )}
                    </React.Fragment>
                );
            })}
        </>
    );
}

export function RowActionsDropdown<T>({
    item,
    actions,
}: RowActionsDropdownProps<T>) {
    const visibleActions = actions.filter((a) => !a.hidden || !a.hidden(item));
    if (visibleActions.length === 0) return null;

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
                <DropdownMenuTrigger className="p-1 rounded hover:bg-dashboard-secondary transition-colors outline-none cursor-pointer">
                    <MoreHorizontal
                        size={16}
                        className="text-dashboard-muted-foreground"
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="bg-dashboard-card border border-dashboard-border p-1 w-36 shadow-lg rounded-lg"
                >
                    {visibleActions.map((action, index) => {
                        const IconComponent = action.icon;
                        const labelText =
                            typeof action.label === "function"
                                ? action.label(item)
                                : action.label;

                        if (action.subActions && action.subActions.length > 0) {
                            return (
                                <React.Fragment key={action.id || index}>
                                    {action.subActions.map((sub, sIdx) => (
                                        <DropdownMenuItem
                                            key={sIdx}
                                            onClick={() => {
                                                const val = sub.getValue(item);
                                                if (val) {
                                                    navigator.clipboard.writeText(
                                                        val,
                                                    );
                                                }
                                            }}
                                            className="gap-2 px-3 py-2 cursor-pointer rounded-md transition-colors"
                                        >
                                            <span className="text-xs font-medium">
                                                {sub.label}
                                            </span>
                                        </DropdownMenuItem>
                                    ))}
                                </React.Fragment>
                            );
                        }

                        return (
                            <DropdownMenuItem
                                key={action.id || index}
                                onClick={() => action.onClick(item)}
                                className={
                                    action.variant === "destructive"
                                        ? "text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2 px-3 py-2 cursor-pointer rounded-md transition-colors"
                                        : "gap-2 px-3 py-2 cursor-pointer rounded-md transition-colors"
                                }
                            >
                                {IconComponent && <IconComponent size={14} />}
                                <span className="text-xs font-medium">
                                    {labelText}
                                </span>
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
