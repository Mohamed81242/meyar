import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FilterMetadata, FilterValue, FilterProps } from "./types";
import { FilterButton } from "./FilterButton";
import { NormalFilters } from "./NormalFilters";
import { AdvancedFilters } from "./AdvancedFilters";

export interface UseFilterOptions<TKey extends string = string> {
    metadata?: FilterMetadata<TKey>;
    activeFilters: FilterValue<TKey>[];
    onChange: (filters: FilterValue<TKey>[]) => void;
    mode?: "both" | "normal" | "advanced";
    isAr?: boolean;
}

export function useFilter<TKey extends string = string>({
    metadata,
    activeFilters,
    onChange,
    mode = "both",
    isAr = false,
}: UseFilterOptions<TKey>) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const [localFilters, setLocalFilters] = useState<FilterValue<TKey>[]>(activeFilters);

    // Sync local filters when activeFilters changes externally
    useEffect(() => {
        setLocalFilters(activeFilters);
    }, [activeFilters]);

    const handleToggleDropdown = () => {
        if (!showDropdown) {
            setLocalFilters(activeFilters);
        }
        setShowDropdown(!showDropdown);
    };

    const handleOpenDrawer = () => {
        setLocalFilters(activeFilters);
        setShowDrawer(true);
    };

    const handleCloseDrawer = () => {
        setShowDrawer(false);
        setLocalFilters(activeFilters);
    };

    const handleApply = (filtersToApply: FilterValue<TKey>[]) => {
        const validFilters = filtersToApply.filter((f) => {
            if (f.operator === "between") {
                return (
                    Array.isArray(f.value) &&
                    f.value[0] !== "" &&
                    f.value[1] !== ""
                );
            }
            return (
                f.value !== undefined &&
                f.value !== null &&
                f.value !== ""
            );
        });
        onChange(validFilters);
        setShowDropdown(false);
        setShowDrawer(false);
    };

    const handleReset = () => {
        setLocalFilters([]);
        onChange([]);
        setShowDropdown(false);
        setShowDrawer(false);
    };

    const handleCancel = () => {
        setShowDropdown(false);
        setLocalFilters(activeFilters);
    };



    const getFilterLabel = () => {
        if (activeFilters.length === 0) {
            return isAr ? "الكل" : "all";
        }
        if (activeFilters.length === 1) {
            const firstFilter = activeFilters[0];
            const field = metadata?.filters.find((f) => f.column === firstFilter.column);
            if (field) {
                const firstThreeCols = metadata?.filters.slice(0, 3).map((x) => x.column) || [];
                if (firstThreeCols.includes(firstFilter.column)) {
                    return field.label;
                }
                const options = field.options || [];
                const option = options.find((opt) => String(opt.value) === String(firstFilter.value));
                if (option) return option.label;
                return firstFilter.value || field.label;
            }
            return firstFilter.column;
        }
        return isAr ? `${activeFilters.length} نشط` : `${activeFilters.length} active`;
    };

    const buttonProps = {
        isOpen: showDropdown || showDrawer,
        activeCount: activeFilters.length,
        label: getFilterLabel(),
        onClick: mode === "advanced" ? handleOpenDrawer : handleToggleDropdown,
        isAr,
    };

    const dropdownProps = {
        isOpen: showDropdown,
        metadata: metadata!,
        localFilters,
        setLocalFilters,
        onApply: (filtersToApply: FilterValue<TKey>[]) => handleApply(filtersToApply),
        onQuickSelect: (filters: FilterValue<TKey>[]) => {
            onChange(filters);
            setShowDropdown(false);
        },
        onReset: handleReset,
        onOpenAdvanced: () => {
            setShowDropdown(false);
            setShowDrawer(true);
        },
        showAdvancedButton: mode === "both",
        isAr,
    };

    const drawerProps = {
        isOpen: showDrawer,
        onClose: handleCloseDrawer,
        metadata: metadata!,
        localFilters,
        setLocalFilters,
        onApply: () => handleApply(localFilters),
        onReset: handleReset,
        isAr,
    };

    return {
        showDropdown,
        showDrawer,
        setShowDropdown,
        setShowDrawer,
        buttonProps,
        dropdownProps,
        drawerProps,
    };
}

/**
 * Standard unified Filter component that wraps all functionality in a single block layout.
 * Use this for simple layouts, or use the `useFilter` hook + individual components for customized placements.
 */
export function Filter<TKey extends string = string>({
    metadata,
    activeFilters,
    onChange,
    mode = "both",
    isAr = false,
}: FilterProps<TKey>) {
    const {
        buttonProps,
        dropdownProps,
        drawerProps,
        showDropdown,
        showDrawer,
        setShowDropdown,
    } = useFilter({
        metadata,
        activeFilters,
        onChange,
        mode,
        isAr,
    });

    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown, setShowDropdown]);

    if (!metadata) return null;

    return (
        <div className="relative inline-block text-left" ref={containerRef}>
            <FilterButton {...buttonProps} />

            {mode !== "advanced" && (
                <AnimatePresence>
                    {showDropdown && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-50 mt-2 w-64 bg-dashboard-card p-3 rounded-xl border border-dashboard-border shadow-[0_4px_24px_rgba(0,0,0,0.3)] ltr:left-0 rtl:right-0"
                        >
                            <NormalFilters {...dropdownProps} />
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {mode !== "normal" && (
                <AnimatePresence>
                    {showDrawer && <AdvancedFilters {...drawerProps} />}
                </AnimatePresence>
            )}
        </div>
    );
}
