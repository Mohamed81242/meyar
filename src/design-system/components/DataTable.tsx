import { cn } from "@/utils";
import { Building2, ChevronDown, ChevronRight } from "lucide-react";
import * as React from "react";
import { ContextMenuAdvanced } from "./context menu core/contextMenuAdvanced";
import type { FilterMetadata, FilterValue } from "./filter/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./table";

export interface DataTableColumn<T> {
    /** Unique identifier for the column */
    id: string;
    /** Header label or custom render function */
    header: React.ReactNode | ((props: { data: T[] }) => React.ReactNode);
    /** Key on item to render text directly if cell renderer is not provided */
    accessorKey?: keyof T;
    /** Custom cell renderer function */
    cell?: (item: T, index: number) => React.ReactNode;
    /** Visual style variant for column */
    variant?: "default" | "muted" | "actions";
    /** Optional class name for header cell */
    headerClassName?: string;
    /** Optional class name for data cell */
    cellClassName?: string;
    /** Text alignment for table head and cell */
    align?: "left" | "center" | "right";
    /** Custom inline width for column */
    width?: string | number;
}

export type ColumnDef<T> = DataTableColumn<T>;

export interface DataTableProps<T> {
    /** Data array to display */
    data: T[];
    /** Column definitions */
    columns: DataTableColumn<T>[];
    /** Function or key to group items by */
    groupBy?: keyof T | ((item: T) => string);
    /** Custom group header renderer */
    renderGroupHeader?: (
        groupName: string,
        items: T[],
        isCollapsed: boolean,
        toggleCollapse: () => void,
    ) => React.ReactNode;
    /** Optional label description for group */
    groupLabel?: string;
    /** Function to extract unique key for each row */
    getRowKey?: (item: T, index: number) => string | number;
    /** Object property key to extract unique key for each row */
    rowKey?: keyof T;
    /** Row click callback */
    onRowClick?: (item: T, index: number) => void;
    /** Custom context menu content generator per row */
    renderContextMenu?: (item: T, index: number) => React.ReactNode;
    /** Context menu overlay class name */
    contextMenuClassName?: string;
    /** Custom empty state when data is empty */
    emptyState?: React.ReactNode;
    /** Loading state flag */
    isLoading?: boolean;
    /** Loading state custom fallback component */
    loadingState?: React.ReactNode;
    /** View mode: list or grid */
    view?: "list" | "grid";
    defaultView?: "list" | "grid";
    hideViewToggle?: boolean;
    gridView?: React.ReactNode;
    renderGridItem?: (item: T, index: number) => React.ReactNode;
    gridClassName?: string;
    filters?: { label: string; value: string; count?: number }[];
    selectedFilter?: string;
    onFilterChange?: (filter: string) => void;
    advancedFilterMetadata?: FilterMetadata<any>;
    onAdvancedFilterApply?: (filters: FilterValue<any>[]) => void;
    showSearch?: boolean;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    /** Outer wrapper container class name */
    className?: string;
    /** Container wrapper class name */
    containerClassName?: string;
    /** Toolbar / top wrapper class name */
    wrapperClassName?: string;
    /** Table element class name */
    tableClassName?: string;
    /** Table header class name */
    headerClassName?: string;
    /** Table header row class name */
    headerRowClassName?: string;
    /** Table body class name */
    bodyClassName?: string;
    /** Table row class name or evaluator function */
    rowClassName?: string | ((item: T, index: number) => string);
}

export function DataTable<T>({
    data,
    columns,
    groupBy,
    renderGroupHeader,
    groupLabel,
    getRowKey,
    rowKey,
    onRowClick,
    renderContextMenu,
    contextMenuClassName = "w-56 bg-dashboard-popover border border-dashboard-border p-1.5 rounded-xl shadow-2xl z-50",
    emptyState,
    isLoading = false,
    view,
    defaultView,
    hideViewToggle,
    gridView,
    renderGridItem,
    gridClassName,
    filters,
    selectedFilter,
    onFilterChange,
    advancedFilterMetadata,
    onAdvancedFilterApply,
    showSearch,
    searchValue,
    onSearchChange,
    searchPlaceholder,
    className,
    containerClassName,
    wrapperClassName,
    tableClassName,
    headerClassName,
    headerRowClassName,
    bodyClassName,
    rowClassName = "border-b border-dashboard-border/50 hover:bg-dashboard-secondary/30 transition-colors group",
}: DataTableProps<T>) {
    const extractKey = (item: T, index: number): string | number => {
        if (getRowKey) return getRowKey(item, index);
        if (rowKey && item[rowKey] !== undefined) return String(item[rowKey]);
        if (typeof item === "object" && item !== null && "id" in item) {
            return String((item as any).id);
        }
        return index;
    };

    const getAlignmentClass = (align?: "left" | "center" | "right") => {
        switch (align) {
            case "center":
                return "text-center";
            case "right":
                return "text-end";
            case "left":
                return "text-start";
            default:
                return "text-start";
        }
    };

    const renderHeaderCell = (col: DataTableColumn<T>) => {
        if (typeof col.header === "function") {
            return col.header({ data });
        }
        return col.header;
    };

    const renderCellContent = (
        col: DataTableColumn<T>,
        item: T,
        index: number,
    ) => {
        if (col.cell) {
            return col.cell(item, index);
        }
        if (col.accessorKey !== undefined) {
            const val = item[col.accessorKey];
            return val !== undefined && val !== null ? String(val) : null;
        }
        return null;
    };

    const renderRow = (item: T, index: number) => {
        const key = extractKey(item, index);
        const computedRowClassName =
            typeof rowClassName === "function"
                ? rowClassName(item, index)
                : rowClassName;

        const rowElement = (
            <TableRow
                key={key}
                onClick={onRowClick ? () => onRowClick(item, index) : undefined}
                className={cn(
                    onRowClick && "cursor-pointer",
                    renderContextMenu && "cursor-context-menu",
                    computedRowClassName,
                )}
            >
                {columns.map((col) => {
                    const isMuted = col.variant === "muted";
                    return (
                        <TableCell
                            key={col.id}
                            className={cn(
                                "py-3.5",
                                isMuted &&
                                    "text-xs text-dashboard-muted-foreground",
                                getAlignmentClass(col.align),
                                col.cellClassName,
                            )}
                        >
                            {renderCellContent(col, item, index)}
                        </TableCell>
                    );
                })}
            </TableRow>
        );

        if (renderContextMenu) {
            const menuContent = renderContextMenu(item, index);
            if (menuContent) {
                return (
                    <ContextMenuAdvanced
                        key={key}
                        menuContent={menuContent}
                        className={contextMenuClassName}
                    >
                        {rowElement}
                    </ContextMenuAdvanced>
                );
            }
        }

        return rowElement;
    };

    // Grouping calculations
    const groupedItems = React.useMemo(() => {
        if (!groupBy) return null;
        const map = new Map<string, T[]>();
        data.forEach((item) => {
            const groupKey =
                typeof groupBy === "function"
                    ? groupBy(item)
                    : String(item[groupBy] ?? "Unassigned");
            if (!map.has(groupKey)) {
                map.set(groupKey, []);
            }
            map.get(groupKey)!.push(item);
        });
        return Array.from(map.entries()).map(([groupName, items]) => ({
            groupName,
            items,
        }));
    }, [data, groupBy]);

    const [collapsedGroups, setCollapsedGroups] = React.useState<
        Record<string, boolean>
    >({});

    const toggleGroup = (groupName: string) => {
        setCollapsedGroups((prev) => ({
            ...prev,
            [groupName]: !prev[groupName],
        }));
    };

    if (groupedItems && groupedItems.length > 0) {
        return (
            <div className="space-y-4">
                {groupedItems.map(({ groupName, items }) => {
                    const isCollapsed = !!collapsedGroups[groupName];
                    return (
                        <div
                            key={groupName}
                            className="border border-dashboard-border rounded-2xl bg-dashboard-card overflow-hidden"
                        >
                            {renderGroupHeader ? (
                                renderGroupHeader(
                                    groupName,
                                    items,
                                    isCollapsed,
                                    () => toggleGroup(groupName),
                                )
                            ) : (
                                <div
                                    className="bg-dashboard-secondary/60 hover:bg-dashboard-secondary border-b border-dashboard-border p-4 flex items-center justify-between cursor-pointer select-none transition-colors"
                                    onClick={() => toggleGroup(groupName)}
                                >
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            className="h-7 w-7 rounded-lg flex items-center justify-center text-dashboard-muted-foreground hover:text-dashboard-foreground hover:bg-dashboard-card transition-colors cursor-pointer"
                                        >
                                            {isCollapsed ? (
                                                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </button>
                                        <div className="h-8 w-8 rounded-lg bg-dashboard-primary/10 text-dashboard-primary flex items-center justify-center">
                                            <Building2 className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-sm text-dashboard-foreground block">
                                                {groupName}
                                            </span>
                                            {groupLabel && (
                                                <span className="text-[11px] text-dashboard-muted-foreground">
                                                    {groupLabel}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-dashboard-card border border-dashboard-border text-dashboard-muted-foreground ml-2">
                                            {items.length}{" "}
                                            {items.length === 1
                                                ? "item"
                                                : "items"}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {!isCollapsed && (
                                <div className="p-4 bg-dashboard-background/40">
                                    {view === "grid" && renderGridItem ? (
                                        <div
                                            className={cn(
                                                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                                                gridClassName,
                                            )}
                                        >
                                            {items.map((item, idx) =>
                                                renderGridItem(item, idx),
                                            )}
                                        </div>
                                    ) : (
                                        <div className={cn("overflow-x-auto", containerClassName ?? "border-0 rounded-none")}>
                                            <table
                                                className={cn(
                                                    "w-full caption-bottom text-sm",
                                                    tableClassName,
                                                )}
                                            >
                                                <TableHeader
                                                    className={cn(
                                                        "bg-dashboard-secondary/30",
                                                        headerClassName,
                                                    )}
                                                >
                                                    <TableRow
                                                        className={cn(
                                                            "border-b border-dashboard-border/60 hover:bg-transparent",
                                                            headerRowClassName,
                                                        )}
                                                    >
                                                        {columns.map((col) => {
                                                            const isActions =
                                                                col.id ===
                                                                    "actions" ||
                                                                col.variant ===
                                                                    "actions";
                                                            return (
                                                                <TableHead
                                                                    key={col.id}
                                                                    className={cn(
                                                                        "text-dashboard-muted-foreground font-semibold text-xs py-3 px-4",
                                                                        isActions &&
                                                                            "w-12 py-3 px-4",
                                                                        getAlignmentClass(
                                                                            col.align,
                                                                        ),
                                                                        col.headerClassName,
                                                                    )}
                                                                    style={
                                                                        col.width
                                                                            ? {
                                                                                  width: col.width,
                                                                              }
                                                                            : undefined
                                                                    }
                                                                >
                                                                    {renderHeaderCell(
                                                                        col,
                                                                    )}
                                                                </TableHead>
                                                            );
                                                        })}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody
                                                    className={bodyClassName}
                                                >
                                                    {items.map((item, index) =>
                                                        renderRow(item, index),
                                                    )}
                                                </TableBody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <Table
            view={view}
            defaultView={defaultView}
            hideViewToggle={hideViewToggle}
            gridView={gridView}
            data={data}
            renderGridItem={renderGridItem}
            gridClassName={gridClassName}
            filters={filters}
            selectedFilter={selectedFilter}
            onFilterChange={onFilterChange}
            advancedFilterMetadata={advancedFilterMetadata}
            onAdvancedFilterApply={onAdvancedFilterApply}
            showSearch={showSearch}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            searchPlaceholder={searchPlaceholder}
            isLoading={isLoading}
            className={tableClassName}
            wrapperClassName={wrapperClassName}
            containerClassName={
                containerClassName ??
                "border-0 rounded-none shadow-none bg-transparent"
            }
        >
            <TableHeader
                className={cn("bg-dashboard-secondary/30", headerClassName)}
            >
                <TableRow
                    className={cn(
                        "border-b border-dashboard-border/60 hover:bg-transparent",
                        headerRowClassName,
                    )}
                >
                    {columns.map((col) => {
                        const isActions =
                            col.id === "actions" || col.variant === "actions";
                        return (
                            <TableHead
                                key={col.id}
                                className={cn(
                                    "text-dashboard-muted-foreground font-semibold text-xs py-3 px-4",
                                    isActions && "w-12 py-3 px-4",
                                    getAlignmentClass(col.align),
                                    col.headerClassName,
                                )}
                                style={
                                    col.width ? { width: col.width } : undefined
                                }
                            >
                                {renderHeaderCell(col)}
                            </TableHead>
                        );
                    })}
                </TableRow>
            </TableHeader>
            <TableBody className={bodyClassName}>
                {data.length === 0 ? (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            className="h-36 text-center text-dashboard-muted-foreground text-xs"
                        >
                            {emptyState || "No data available"}
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((item, index) => renderRow(item, index))
                )}
            </TableBody>
        </Table>
    );
}

// ============================================================================
// Standard Reusable Cell Components
// ============================================================================

/** Reusable user/entity avatar cell component */
export interface EntityAvatarCellProps {
    name: string;
    image?: string | null;
    subtitle?: string;
    className?: string;
}

export function EntityAvatarCell({
    name,
    image,
    subtitle,
    className,
}: EntityAvatarCellProps) {
    const getAvatarColor = (str: string) => {
        const colors = [
            "bg-[#F1EEFF] text-[#7C5CFF] border-[#7C5CFF]/20",
            "bg-[#FFEBE8] text-[#FF6152] border-[#FF6152]/20",
            "bg-[#E7FBF2] text-[#20C979] border-[#20C979]/20",
            "bg-[#FFF4E1] text-[#F5A623] border-[#F5A623]/20",
            "bg-[#EBF3FF] text-[#3B82F6] border-[#3B82F6]/20",
        ];
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className={cn("flex items-center gap-3", className)}>
            {image ? (
                <div className="w-9 h-9 rounded-full border border-dashboard-border overflow-hidden shrink-0">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <div
                    className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border shrink-0 shadow-2xs",
                        getAvatarColor(name || "?"),
                    )}
                >
                    {name ? name.slice(0, 2) : "?"}
                </div>
            )}
            <div className="flex flex-col text-left rtl:text-right">
                <span className="text-sm font-bold text-dashboard-foreground leading-tight">
                    {name}
                </span>
                {subtitle && (
                    <span className="text-[11px] font-normal text-dashboard-muted-foreground mt-0.5">
                        {subtitle}
                    </span>
                )}
            </div>
        </div>
    );
}

/** Reusable status badge cell component */
export interface StatusBadgeCellProps {
    status: string;
    variantMap?: Record<
        string,
        "success" | "warning" | "danger" | "info" | "default"
    >;
    className?: string;
}

export function StatusBadgeCell({
    status,
    variantMap,
    className,
}: StatusBadgeCellProps) {
    const getBadgeStyle = (statusStr: string) => {
        const customVariant = variantMap?.[statusStr];
        const lower = statusStr.toLowerCase();

        if (
            customVariant === "success" ||
            lower === "active" ||
            lower === "completed" ||
            lower === "success" ||
            lower === "موثق"
        ) {
            return "bg-[#E7FBF2] text-[#20C979] border-[#20C979]/30";
        }
        if (
            customVariant === "warning" ||
            lower === "pending" ||
            lower === "in progress" ||
            lower === "warning" ||
            lower === "قيد المراجعة"
        ) {
            return "bg-[#FFF4E1] text-[#F5A623] border-[#F5A623]/30";
        }
        if (
            customVariant === "danger" ||
            lower === "inactive" ||
            lower === "failed" ||
            lower === "error" ||
            lower === "موقوف"
        ) {
            return "bg-[#FDEBEB] text-[#EF4444] border-[#EF4444]/30";
        }
        if (
            customVariant === "info" ||
            lower === "info" ||
            lower === "new" ||
            lower === "جديد"
        ) {
            return "bg-[#F1EEFF] text-[#7C5CFF] border-[#7C5CFF]/30";
        }
        return "bg-dashboard-secondary text-dashboard-foreground border-dashboard-border";
    };

    return (
        <span
            className={cn(
                "text-[11px] font-extrabold px-3.5 py-1 rounded-full border inline-block tracking-tight",
                getBadgeStyle(status),
                className,
            )}
        >
            {status}
        </span>
    );
}

/** Reusable text badge cell component */
export interface BadgeCellProps {
    label: string;
    className?: string;
}

export function BadgeCell({ label, className }: BadgeCellProps) {
    return (
        <span
            className={cn(
                "text-xs text-dashboard-foreground font-medium bg-dashboard-background px-2.5 py-1 rounded border border-dashboard-border inline-block",
                className,
            )}
        >
            {label}
        </span>
    );
}
