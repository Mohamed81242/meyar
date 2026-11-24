import { PaginatedData } from "@/shared/api";
import { useLanguage } from "@/shared/hooks";
import { cn } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Filter,
    Search,
    SortDesc,
} from "lucide-react";
import * as React from "react";
import LoadingState from "./LoadingState";
import { Button, buttonVariants } from "./button";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
} from "./context menu core/context-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "./dropdown-menu";
import { AdvancedFilters } from "./filter/AdvancedFilters";
import type { FilterMetadata, FilterValue } from "./filter/types";
import { Input } from "./input";

interface TableProps extends Omit<React.ComponentProps<"table">, "data"> {
    isLoading?: boolean;
    view?: "list" | "grid";
    defaultView?: "list" | "grid";
    hideViewToggle?: boolean;
    gridView?: React.ReactNode;
    toolbarContent?: React.ReactNode;
    showSearch?: boolean;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    filters?: { label: string; value: string; count?: number }[];
    selectedFilter?: string;
    onFilterChange?: (filter: string) => void;
    advancedFilterMetadata?: FilterMetadata<any>;
    onAdvancedFilterApply?: (filters: FilterValue<any>[]) => void;
    containerClassName?: string;
    wrapperClassName?: string;

    // Grid Props
    data?: any[];
    renderGridItem?: (item: any, index: number) => React.ReactNode;
    gridClassName?: string;
}

function Table({
    className,
    view: controlledView,
    defaultView = "list",
    hideViewToggle,
    gridView,
    toolbarContent,
    showSearch,
    searchValue,
    onSearchChange,
    searchPlaceholder,
    filters,
    selectedFilter,
    onFilterChange,
    advancedFilterMetadata,
    onAdvancedFilterApply,
    data,
    renderGridItem,
    isLoading,
    gridClassName = "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4",
    containerClassName,
    wrapperClassName,
    ...props
}: TableProps) {
    const [internalView, setInternalView] = React.useState<"list" | "grid">(
        defaultView,
    );
    const view = controlledView ?? internalView;
    const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] =
        React.useState(false);
    const [advancedFilters, setAdvancedFilters] = React.useState<
        FilterValue<any>[]
    >([]);

    const isGrid = view === "grid" && (gridView || (data && renderGridItem));
    const hasToolbar =
        toolbarContent ||
        isGrid ||
        showSearch ||
        (filters && filters.length > 0);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingState />
            </div>
        );
    }
    return (
        <div className={cn("w-full", hasToolbar && "flex flex-col gap-6", wrapperClassName)}>
            {hasToolbar && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Left side: View Mode & Search */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {!hideViewToggle &&
                            (gridView || (data && renderGridItem)) && (
                                <div className="flex items-center bg-dashboard-secondary/40 p-0.5 rounded-lg border border-dashboard-border">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            "h-7 px-2.5 text-xs rounded-md",
                                            !isGrid &&
                                                "bg-dashboard-card text-dashboard-foreground shadow-xs font-semibold",
                                        )}
                                        onClick={() => setInternalView("list")}
                                    >
                                        List
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            "h-7 px-2.5 text-xs rounded-md",
                                            isGrid &&
                                                "bg-dashboard-card text-dashboard-foreground shadow-xs font-semibold",
                                        )}
                                        onClick={() => setInternalView("grid")}
                                    >
                                        Grid
                                    </Button>
                                </div>
                            )}

                        {showSearch && (
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dashboard-muted-foreground" />
                                <Input
                                    value={searchValue}
                                    onChange={(e) =>
                                        onSearchChange?.(e.target.value)
                                    }
                                    placeholder={
                                        searchPlaceholder || "Search..."
                                    }
                                    className="pl-8 h-8 text-xs bg-dashboard-secondary/20 border-dashboard-border"
                                />
                            </div>
                        )}
                    </div>

                    {/* Right side: Filters & Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {filters && filters.length > 0 && (
                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashboard-border bg-dashboard-secondary/30 hover:bg-dashboard-secondary/50 text-dashboard-foreground transition-colors cursor-pointer outline-none">
                                        <Filter className="w-3.5 h-3.5 text-dashboard-muted-foreground" />
                                        <span className="text-dashboard-primary font-medium text-sm">
                                            Filter:{" "}
                                            <span className="font-bold text-dashboard-foreground ml-1">
                                                {filters.find(
                                                    (f) =>
                                                        f.value ===
                                                        selectedFilter,
                                                )?.label || "All"}
                                            </span>
                                        </span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-64 p-3 bg-[#151618] rounded-xl border border-white/8 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
                                    >
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between px-1">
                                                <span className="text-[13px] font-medium text-[#8A8F98]">
                                                    Ordering
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <SortDesc className="w-4 h-4 text-[#8A8F98]" />
                                                    <button className="flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium rounded-md bg-white/6 border border-white/4 text-[#E8E8E8] hover:bg-white/10 transition-colors cursor-pointer outline-none">
                                                        Name{" "}
                                                        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                                                    </button>
                                                </div>
                                            </div>

                                            <hr className="border-white/4" />

                                            <div className="flex flex-col px-1">
                                                <span className="text-[13px] font-medium text-[#8A8F98] mb-2">
                                                    Display properties
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    {filters.map((filter) => (
                                                        <button
                                                            key={filter.value}
                                                            onClick={() =>
                                                                onFilterChange?.(
                                                                    filter.value,
                                                                )
                                                            }
                                                            className={cn(
                                                                "px-3 py-1 text-[13px] font-medium rounded-full border transition-colors cursor-pointer",
                                                                selectedFilter ===
                                                                    filter.value
                                                                    ? "border-white/12 bg-white/8 text-[#E8E8E8]"
                                                                    : "border-white/4 bg-transparent text-[#8A8F98] hover:bg-white/4 hover:text-[#E8E8E8]",
                                                            )}
                                                        >
                                                            {filter.label}{" "}
                                                            {filter.count !==
                                                                undefined &&
                                                                `(${filter.count})`}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            {advancedFilterMetadata && (
                                                <>
                                                    <hr className="border-white/4 mt-1" />
                                                    <button
                                                        onClick={() =>
                                                            setIsAdvancedFilterOpen(
                                                                true,
                                                            )
                                                        }
                                                        className="w-full text-left text-[13px] font-medium text-[#8A8F98] hover:text-[#E8E8E8] hover:bg-white/4 py-1.5 px-2 rounded-md transition-colors cursor-pointer outline-none"
                                                    >
                                                        Advanced Filters
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                        {toolbarContent && (
                            <div className="flex-1">{toolbarContent}</div>
                        )}
                    </div>
                </div>
            )}

            <div className="relative">
                <AnimatePresence mode="wait">
                    {isGrid ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={
                                data && renderGridItem ? gridClassName : ""
                            }
                        >
                            {data && renderGridItem
                                ? data.map((item, index) =>
                                      renderGridItem(item, index),
                                  )
                                : gridView}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            data-slot="table-container"
                            className={cn(
                                "relative w-full overflow-x-auto",
                                containerClassName !== undefined
                                    ? containerClassName
                                    : "bg-dashboard-card border border-dashboard-border rounded-2xl shadow-2xs",
                            )}
                        >
                            <table
                                data-slot="table"
                                className={cn(
                                    "w-full caption-bottom text-sm border-collapse",
                                    className,
                                )}
                                {...props}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {advancedFilterMetadata && (
                <AdvancedFilters
                    isOpen={isAdvancedFilterOpen}
                    onClose={() => setIsAdvancedFilterOpen(false)}
                    metadata={advancedFilterMetadata}
                    localFilters={advancedFilters}
                    setLocalFilters={setAdvancedFilters}
                    onApply={() => {
                        onAdvancedFilterApply?.(advancedFilters);
                    }}
                    onReset={() => {
                        setAdvancedFilters([]);
                        onAdvancedFilterApply?.([]);
                    }}
                />
            )}
        </div>
    );
}

export interface TableGridItemProps extends React.HTMLAttributes<HTMLDivElement> {
    contextMenuItems?: React.ReactNode;
}

function TableGridItem({
    className,
    contextMenuItems,
    children,
    ...props
}: TableGridItemProps) {
    const itemContent = (
        <div className={className} {...props}>
            {children}
        </div>
    );

    if (contextMenuItems) {
        return (
            <ContextMenu>
                <ContextMenuTrigger asChild>{itemContent}</ContextMenuTrigger>
                <ContextMenuContent className="w-fit min-w-32">
                    {contextMenuItems}
                </ContextMenuContent>
            </ContextMenu>
        );
    }

    return itemContent;
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
    return (
        <thead
            data-slot="table-header"
            className={cn(
                "bg-dashboard-secondary/30 [&_tr]:border-b [&_tr]:border-dashboard-border/60",
                className,
            )}
            {...props}
        />
    );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
    return (
        <tbody
            data-slot="table-body"
            className={cn("[&_tr:last-child]:border-0", className)}
            {...props}
        />
    );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
    return (
        <tfoot
            data-slot="table-footer"
            className={cn(
                "border-t bg-dashboard-secondary/50 font-medium [&>tr]:last:border-b-0",
                className,
            )}
            {...props}
        />
    );
}

export interface TableRowProps extends React.ComponentProps<"tr"> {
    contextMenuItems?: React.ReactNode;
}

function TableRow({ className, contextMenuItems, ...props }: TableRowProps) {
    const rowContent = (
        <tr
            data-slot="table-row"
            className={cn(
                "border-b border-dashboard-border/60 transition-colors hover:bg-dashboard-secondary/50! has-aria-expanded:bg-dashboard-secondary/40 data-[state=selected]:bg-dashboard-secondary/50",
                className,
            )}
            {...props}
        />
    );

    if (contextMenuItems) {
        return (
            <ContextMenu>
                <ContextMenuTrigger asChild>{rowContent}</ContextMenuTrigger>
                <ContextMenuContent className="w-fit min-w-32">
                    {contextMenuItems}
                </ContextMenuContent>
            </ContextMenu>
        );
    }

    return rowContent;
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
    return (
        <th
            data-slot="table-head"
            className={cn(
                "h-11 px-4 text-start align-middle text-xs font-semibold text-dashboard-muted-foreground uppercase tracking-wider whitespace-nowrap bg-transparent [&:has([role=checkbox])]:pr-0",
                className,
            )}
            {...props}
        />
    );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
    return (
        <td
            data-slot="table-cell"
            className={cn(
                "px-4 py-3.5 align-middle whitespace-nowrap text-xs font-medium text-dashboard-foreground text-start [&:has([role=checkbox])]:pr-0",
                className,
            )}
            {...props}
        />
    );
}

function TableCaption({
    className,
    ...props
}: React.ComponentProps<"caption">) {
    return (
        <caption
            data-slot="table-caption"
            className={cn(
                "mt-4 text-sm text-[12px] text-dashboard-muted-foreground",
                className,
            )}
            {...props}
        />
    );
}

// ============================================================================
// Pagination
// ============================================================================

interface TablePaginationProps<T> {
    data: PaginatedData<T> | undefined;
    onPageChange: (page: number) => void;
    className?: string;
    showPageNumbers?: boolean;
    showInfo?: boolean;
}

function TablePagination<T>({
    data,
    onPageChange,
    className,
    showPageNumbers = true,
    showInfo = true,
}: TablePaginationProps<T>) {
    const { t } = useLanguage("dashboard");
    const currentPage = data?.currentPage ?? 1;
    const totalPages = data?.lastPage ?? 1;
    const pageSize = data?.perPage ?? 10;
    const totalItems = data?.total ?? totalPages * pageSize;
    const items = data?.items ?? [];

    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++)
                    pages.push(i);
            } else {
                pages.push(1);
                pages.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++)
                    pages.push(i);
                pages.push("...");
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const startItem = items.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endItem = items.length > 0 ? startItem + items.length - 1 : 0;

    return (
        <div
            className={cn("flex flex-wrap items-center justify-between px-4 py-3 bg-dashboard-card border-t border-dashboard-border rounded-b-2xl gap-4", className)}
        >
            {showInfo && (
                <div className="text-xs text-dashboard-muted-foreground font-semibold">
                    {items.length > 0 ? (
                        <>
                            {t("common.table.showing")}{" "}
                            <span className="font-bold text-dashboard-foreground">
                                {startItem}-{endItem}
                            </span>{" "}
                            {t("common.table.of")}{" "}
                            <span className="font-bold text-dashboard-foreground">
                                {totalItems}
                            </span>{" "}
                            {t("common.table.entries")}
                        </>
                    ) : (
                        <span className="text-dashboard-muted-foreground">
                            {t("common.table.noEntries")}
                        </span>
                    )}
                </div>
            )}

            <div className="flex items-center gap-1.5 ms-auto">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!canGoPrevious}
                    className="h-8 w-8 p-0 rounded-xl bg-dashboard-muted/60 hover:bg-dashboard-secondary text-dashboard-muted-foreground hover:text-dashboard-foreground disabled:opacity-40 disabled:cursor-not-allowed border border-dashboard-border transition-colors"
                >
                    <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                </Button>

                {showPageNumbers && (
                    <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) =>
                            page === "..." ? (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="w-8 h-8 flex items-center justify-center text-xs text-dashboard-muted-foreground"
                                >
                                    ...
                                </span>
                            ) : (
                                <Button
                                    key={page}
                                    variant={
                                        currentPage === page
                                            ? "default"
                                            : "ghost"
                                    }
                                    size="sm"
                                    onClick={() => onPageChange(page as number)}
                                    className={cn(
                                        "h-8 w-8 p-0 rounded-xl text-xs font-bold transition-all border",
                                        currentPage === page
                                            ? "bg-dashboard-primary text-white border-dashboard-primary shadow-xs"
                                            : "bg-transparent border-transparent hover:bg-dashboard-secondary text-dashboard-muted-foreground hover:text-dashboard-foreground",
                                    )}
                                >
                                    {page}
                                </Button>
                            ),
                        )}
                    </div>
                )}

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!canGoNext}
                    className="h-8 w-8 p-0 rounded-xl bg-dashboard-muted/60 hover:bg-dashboard-secondary text-dashboard-muted-foreground hover:text-dashboard-foreground disabled:opacity-40 disabled:cursor-not-allowed border border-dashboard-border transition-colors"
                >
                    <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                </Button>
            </div>
        </div>
    );
}

export {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableGridItem,
    TableHead,
    TableHeader,
    TablePagination,
    TableRow,
};

export type { TablePaginationProps };
