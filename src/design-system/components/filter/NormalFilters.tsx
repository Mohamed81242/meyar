import React from "react";
import { Button } from "../button";
import { FilterMetadata, FilterValue } from "./types";

export interface NormalFiltersProps<TKey extends string = string> {
    metadata: FilterMetadata<TKey>;
    localFilters: FilterValue<TKey>[];
    setLocalFilters: React.Dispatch<React.SetStateAction<FilterValue<TKey>[]>>;
    onApply: (filters: FilterValue<TKey>[]) => void;
    onQuickSelect?: (filters: FilterValue<TKey>[]) => void;
    onReset: () => void;
    onOpenAdvanced?: () => void;
    showAdvancedButton?: boolean;
    isAr?: boolean;
}

export function NormalFilters<TKey extends string = string>({
    metadata,
    localFilters,
    setLocalFilters,
    onApply,
    onQuickSelect,
    onOpenAdvanced,
    showAdvancedButton = false,
    isAr = false,
}: NormalFiltersProps<TKey>) {
    if (!metadata) return null;

    // Get the first three filters from metadata
    const firstThreeFields = metadata.filters.slice(0, 3);
    const firstThreeCols = firstThreeFields.map((f) => f.column);

    const getActiveColumn = () => {
        if (localFilters.length === 1) {
            if (firstThreeCols.includes(localFilters[0].column as any)) {
                return localFilters[0].column;
            }
        }
        return "";
    };

    const activeCol = getActiveColumn();

    const handleSelectColumn = (colName: string) => {
        const apply = onQuickSelect || onApply;
        if (colName === "") {
            setLocalFilters([]);
            apply([]);
        } else {
            const nextFilters = [
                { column: colName as TKey, operator: "=", value: "" },
            ];
            setLocalFilters(nextFilters);
            apply(nextFilters);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="mb-3 px-1">
                <span className="block text-[13px] font-medium text-dashboard-muted-foreground mb-2">
                    {isAr ? "تصفية حسب" : "Filter By"}
                </span>

                <div className="flex flex-wrap gap-2">
                    {/* "All" Option */}
                    <button
                        onClick={() => handleSelectColumn("")}
                        className={`px-3 py-1 text-[13px] font-medium rounded-full border transition-colors cursor-pointer ${
                            activeCol === ""
                                ? "border-white/[0.12] bg-white/[0.08] text-dashboard-foreground"
                                : "border-white/[0.04] bg-transparent text-dashboard-muted-foreground hover:bg-white/[0.04] hover:text-dashboard-foreground"
                        }`}
                    >
                        {isAr ? "الكل" : "All"}
                    </button>

                    {/* First Three Fields */}
                    {firstThreeFields.map((field) => {
                        const isSelected = activeCol === field.column;
                        return (
                            <button
                                key={field.column}
                                onClick={() => handleSelectColumn(field.column)}
                                className={`px-3 py-1 text-[13px] font-medium rounded-full border transition-colors cursor-pointer ${
                                    isSelected
                                        ? "border-white/[0.12] bg-white/[0.08] text-dashboard-foreground"
                                        : "border-white/[0.04] bg-transparent text-dashboard-muted-foreground hover:bg-white/[0.04] hover:text-dashboard-foreground"
                                }`}
                            >
                                {field.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {showAdvancedButton && (
                <div className="border-t border-white/[0.08] mt-2 pt-2 px-1">
                    <button
                        onClick={onOpenAdvanced}
                        className="w-full text-left text-[13px] font-medium text-dashboard-muted-foreground hover:text-dashboard-foreground hover:bg-white/[0.04] py-1.5 px-2 rounded-md transition-colors cursor-pointer outline-none"
                    >
                        {isAr ? "الفلاتر المتقدمة" : "Advanced Filters"}
                    </button>
                </div>
            )}
        </div>
    );
}
