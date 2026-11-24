import { Button } from "@/design-system/components/button";
import { ContextMenuAdvanced } from "@/design-system/components/context menu core/contextMenuAdvanced";
import type { TableActionItem } from "@/design-system/components/TableActions";
import { RowActionsDropdown } from "@/design-system/components/TableActions";
import { useContextMenuActions } from "@/design-system/hooks/useContextMenuActions";
import { cn } from "@/utils";
import { Edit, Trash } from "lucide-react";
import * as React from "react";

export interface DataCardProperty {
    label: string;
    value: React.ReactNode;
}

export interface DataCardProps<T = any> {
    /** Item entity bound to this card */
    item?: T;
    /** Action items array for context menu and action dropdown */
    actions?: TableActionItem<T>[];
    /** Custom right-click context menu renderer override */
    renderContextMenu?: (item: T) => React.ReactNode;
    /** Card title */
    title?: React.ReactNode;
    /** Subtitle or secondary header label */
    subtitle?: React.ReactNode;
    /** Badge text or component rendered in the top right */
    badge?: React.ReactNode;
    /** Custom style classes for badge container */
    badgeClassName?: string;
    /** Description text */
    description?: React.ReactNode;
    /** Key-Value property grid list */
    properties?: DataCardProperty[];
    /** Custom main content rendered inside card */
    children?: React.ReactNode;
    /** Footer metadata (e.g., counters, status indicators) */
    footer?: React.ReactNode;
    /** Variant style for card container border/background emphasis */
    badgeVariantStyle?: string;
    /** Click handler for the card */
    onClick?: (item?: T) => void;
    /** Quick edit action handler */
    onEdit?: (item?: T) => void;
    /** Quick delete action handler */
    onDelete?: (item?: T) => void;
    /** Show action dropdown icon at top right */
    showActionDropdown?: boolean;
    /** Additional container CSS classes */
    className?: string;
}

export function DataCard<T = any>({
    item,
    actions,
    renderContextMenu: customRenderContextMenu,
    title,
    subtitle,
    badge,
    badgeClassName,
    description,
    properties,
    children,
    footer,
    badgeVariantStyle,
    onClick,
    onEdit,
    onDelete,
    showActionDropdown,
    className,
}: DataCardProps<T>) {
    const { renderContextMenu } = useContextMenuActions(actions);
    const menuContent = item
        ? customRenderContextMenu
            ? customRenderContextMenu(item)
            : renderContextMenu(item)
        : null;

    const cardContent = (
        <div
            onClick={() => onClick?.(item)}
            className={cn(
                "bg-dashboard-card border border-dashboard-border rounded-[20px] p-5 hover:border-dashboard-primary/40 transition-all duration-200 cursor-pointer group shadow-sm flex flex-col justify-between relative",
                badgeVariantStyle,
                className,
            )}
        >
            <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                        {title && (
                            <h3 className="text-sm font-bold text-dashboard-foreground group-hover:text-dashboard-primary transition-colors line-clamp-1">
                                {title}
                            </h3>
                        )}
                        {subtitle && (
                            <p className="text-xs text-dashboard-muted-foreground line-clamp-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {badge && (
                            <span
                                className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0",
                                    badgeClassName || badgeVariantStyle,
                                )}
                            >
                                {badge}
                            </span>
                        )}
                        {showActionDropdown && item && actions && (
                            <div onClick={(e) => e.stopPropagation()}>
                                <RowActionsDropdown
                                    item={item}
                                    actions={actions}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {description && (
                    <p className="text-xs text-dashboard-muted-foreground line-clamp-2">
                        {description}
                    </p>
                )}

                {properties && properties.length > 0 && (
                    <div
                        className={cn(
                            "grid gap-2 pt-2 border-t border-dashboard-border/60 text-xs",
                            properties.length === 1
                                ? "grid-cols-1"
                                : "grid-cols-2",
                        )}
                    >
                        {properties.map((prop, idx) => (
                            <div key={idx}>
                                <span className="text-[10px] font-semibold text-dashboard-muted-foreground block  tracking-wider">
                                    {prop.label}
                                </span>
                                <span className="font-semibold text-dashboard-foreground truncate block capitalize">
                                    {prop.value ?? "-"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {children}

                {footer && <div>{footer}</div>}
            </div>

            {(onEdit || onDelete) && (
                <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-dashboard-border/40">
                    {onEdit && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(item);
                            }}
                            className="h-8 text-xs px-3 rounded-full border-dashboard-border hover:bg-dashboard-secondary cursor-pointer"
                        >
                            <Edit size={12} className="mr-1" /> Edit
                        </Button>
                    )}
                    {onDelete && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(item);
                            }}
                            className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-full transition-colors cursor-pointer"
                            aria-label="Delete item"
                        >
                            <Trash size={14} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    if (menuContent) {
        return (
            <ContextMenuAdvanced menuContent={menuContent}>
                {cardContent}
            </ContextMenuAdvanced>
        );
    }

    return cardContent;
}
