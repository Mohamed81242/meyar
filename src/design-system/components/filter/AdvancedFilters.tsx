import { motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import React from "react";
import { Button } from "../button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "../dropdown-menu";
import { FilterMetadata, FilterValue } from "./types";

export interface AdvancedFiltersProps<TKey extends string = string> {
    isOpen: boolean;
    onClose: () => void;
    metadata: FilterMetadata<TKey>;
    localFilters: FilterValue<TKey>[];
    setLocalFilters: React.Dispatch<React.SetStateAction<FilterValue<TKey>[]>>;
    onApply: () => void;
    onReset: () => void;
    isAr?: boolean;
    inline?: boolean;
}

export function AdvancedFilters<TKey extends string = string>({
    isOpen,
    onClose,
    metadata,
    localFilters,
    setLocalFilters,
    onApply,
    onReset,
    isAr = false,
    inline = false,
}: AdvancedFiltersProps<TKey>) {
    if (!isOpen || !metadata) return null;

    const handleAddFilter = () => {
        if (!metadata || metadata.filters.length === 0) return;
        const defaultCol = metadata.filters[0];
        const defaultOp = defaultCol.operators[0];
        const fieldType = defaultCol.type || "text";
        setLocalFilters((prev) => [
            ...prev,
            {
                column: defaultCol.column as TKey,
                operator: defaultOp,
                value:
                    fieldType === "boolean"
                        ? true
                        : defaultOp === "between"
                          ? ["", ""]
                          : "",
            },
        ]);
    };

    const handleRemoveFilter = (idx: number) => {
        setLocalFilters((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleColumnChange = (idx: number, newCol: TKey) => {
        const colMeta = metadata.filters.find((f) => f.column === newCol);
        const defaultOp = colMeta?.operators[0] || "=";
        const fieldType = colMeta?.type || "text";
        setLocalFilters((prev) =>
            prev.map((item, i) =>
                i === idx
                    ? {
                          column: newCol,
                          operator: defaultOp,
                          value:
                              fieldType === "boolean"
                                  ? true
                                  : defaultOp === "between"
                                    ? ["", ""]
                                    : "",
                      }
                    : item,
            ),
        );
    };

    const handleOperatorChange = (idx: number, newOp: string) => {
        setLocalFilters((prev) =>
            prev.map((item, i) => {
                if (i !== idx) return item;
                const wasBetween = item.operator === "between";
                const isBetween = newOp === "between";
                let newVal = item.value;
                if (isBetween && !wasBetween) {
                    newVal = ["", ""];
                } else if (!isBetween && wasBetween) {
                    newVal = "";
                }
                return {
                    ...item,
                    operator: newOp,
                    value: newVal,
                };
            }),
        );
    };

    const handleValueChange = (
        idx: number,
        val: any,
        isBetweenSecond = false,
    ) => {
        setLocalFilters((prev) =>
            prev.map((item, i) => {
                if (i !== idx) return item;
                if (item.operator === "between") {
                    const currentVal = Array.isArray(item.value)
                        ? item.value
                        : ["", ""];
                    const newVal = [...currentVal];
                    if (isBetweenSecond) {
                        newVal[1] = val;
                    } else {
                        newVal[0] = val;
                    }
                    return {
                        ...item,
                        value: newVal,
                    };
                }
                return {
                    ...item,
                    value: val,
                };
            }),
        );
    };

    if (inline) {
        return (
            <div className="flex flex-col h-full w-full bg-dashboard-card font-sans text-left overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-dashboard-border flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-dashboard-foreground">
                                {isAr ? "الفلاتر المتقدمة" : "Advanced Filters"}
                            </span>
                            <span className="text-[10px] text-dashboard-muted-foreground leading-none mt-0.5">
                                {isAr
                                    ? "تخصيص نتائج البحث بدقة"
                                    : "Refine search results precisely"}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {localFilters.length > 0 && (
                            <button
                                onClick={() => setLocalFilters([])}
                                className="text-[10px] text-dashboard-muted-foreground hover:text-dashboard-destructive transition font-bold  tracking-wider cursor-pointer bg-transparent border-0 p-0 mr-2"
                            >
                                {isAr ? "مسح" : "Clear"}
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="h-8 w-8 text-dashboard-muted-foreground hover:text-dashboard-foreground hover:bg-dashboard-secondary rounded-xl flex items-center justify-center transition-colors cursor-pointer outline-none bg-transparent border-0"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Form Fields Area (Dynamic Query Builder) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-dashboard-background/30">
                    {localFilters.length === 0 ? (
                        <div className="text-center py-12 text-xs text-dashboard-muted-foreground font-semibold">
                            {isAr
                                ? 'لم يتم إضافة فلاتر بعد. اضغط على "إضافة فلتر" للبدء.'
                                : 'No filters added yet. Click "Add Filter" to start.'}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {localFilters.map((filterItem, idx) => {
                                const colMeta = metadata.filters.find(
                                    (f) => f.column === filterItem.column,
                                );
                                const operators = colMeta?.operators || [];
                                const fieldType = colMeta?.type || "text";

                                return (
                                    <div
                                        key={idx}
                                        className="flex flex-col gap-3 bg-dashboard-secondary/40 p-4 rounded-xl border border-dashboard-border"
                                    >
                                        {/* Column Selection */}
                                        <div className="space-y-1">
                                            <label className="block text-[9px] font-bold text-dashboard-muted-foreground  tracking-wider">
                                                {isAr ? "الحقل" : "Field"}
                                            </label>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="w-full bg-dashboard-card border border-dashboard-border rounded-xl px-3 py-2 text-xs font-semibold flex items-center justify-between outline-none text-dashboard-foreground hover:bg-dashboard-secondary">
                                                    <span>{colMeta?.label || filterItem.column}</span>
                                                    <ChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-full min-w-50">
                                                    {metadata.filters.map((f) => (
                                                        <DropdownMenuItem
                                                            key={f.column}
                                                            onClick={() =>
                                                                handleColumnChange(
                                                                    idx,
                                                                    f.column as TKey,
                                                                )
                                                            }
                                                        >
                                                            {f.label}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Operator Selection */}
                                        <div className="space-y-1">
                                            <label className="block text-[9px] font-bold text-dashboard-muted-foreground  tracking-wider">
                                                {isAr ? "الشرط" : "Condition"}
                                            </label>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="w-full bg-dashboard-card border border-dashboard-border rounded-xl px-3 py-2 text-xs font-semibold flex items-center justify-between outline-none text-dashboard-foreground hover:bg-dashboard-secondary">
                                                    <span>
                                                        {metadata.operators[filterItem.operator] || filterItem.operator}
                                                    </span>
                                                    <ChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-full min-w-50">
                                                    {operators.map((op) => (
                                                        <DropdownMenuItem
                                                            key={op}
                                                            onClick={() =>
                                                                handleOperatorChange(idx, op)
                                                            }
                                                        >
                                                            {metadata.operators[op] || op}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Value input fields */}
                                        <div className="space-y-1">
                                            <label className="block text-[9px] font-bold text-dashboard-muted-foreground  tracking-wider">
                                                {isAr ? "القيمة" : "Value"}
                                            </label>
                                            {fieldType === "boolean" ? (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="w-full bg-dashboard-card border border-dashboard-border rounded-xl px-3 py-2 text-xs font-semibold flex items-center justify-between outline-none text-dashboard-foreground hover:bg-dashboard-secondary">
                                                        <span>
                                                            {String(filterItem.value) === "true"
                                                                ? (isAr ? "نعم" : "Yes")
                                                                : (isAr ? "لا" : "No")}
                                                        </span>
                                                        <ChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-full min-w-30">
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleValueChange(idx, true)
                                                            }
                                                        >
                                                            {isAr ? "نعم" : "Yes"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleValueChange(idx, false)
                                                            }
                                                        >
                                                            {isAr ? "لا" : "No"}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            ) : filterItem.operator ===
                                              "between" ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type={
                                                            fieldType ===
                                                            "number"
                                                                ? "number"
                                                                : fieldType ===
                                                                    "date"
                                                                  ? "date"
                                                                  : "text"
                                                        }
                                                        placeholder={
                                                            isAr ? "من" : "Min"
                                                        }
                                                        value={
                                                            Array.isArray(
                                                                filterItem.value,
                                                            )
                                                                ? filterItem
                                                                      .value[0]
                                                                : ""
                                                        }
                                                        onChange={(e) =>
                                                            handleValueChange(
                                                                idx,
                                                                e.target.value,
                                                                false,
                                                            )
                                                        }
                                                        className="w-full bg-dashboard-card border border-dashboard-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-dashboard-primary/20 transition-all outline-none text-dashboard-foreground"
                                                    />
                                                    <span className="text-[10px] font-bold text-dashboard-muted-foreground  shrink-0">
                                                        {isAr ? "إلى" : "To"}
                                                    </span>
                                                    <input
                                                        type={
                                                            fieldType ===
                                                            "number"
                                                                ? "number"
                                                                : fieldType ===
                                                                    "date"
                                                                  ? "date"
                                                                  : "text"
                                                        }
                                                        placeholder={
                                                            isAr ? "إلى" : "Max"
                                                        }
                                                        value={
                                                            Array.isArray(
                                                                filterItem.value,
                                                            )
                                                                ? filterItem
                                                                      .value[1]
                                                                : ""
                                                        }
                                                        onChange={(e) =>
                                                            handleValueChange(
                                                                idx,
                                                                e.target.value,
                                                                true,
                                                            )
                                                        }
                                                        className="w-full bg-dashboard-card border border-dashboard-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-dashboard-primary/20 transition-all outline-none text-dashboard-foreground"
                                                    />
                                                </div>
                                            ) : (
                                                <input
                                                    type={
                                                        fieldType === "number"
                                                            ? "number"
                                                            : fieldType ===
                                                                "date"
                                                              ? "date"
                                                              : "text"
                                                    }
                                                    placeholder={
                                                        isAr
                                                            ? "القيمة"
                                                            : "Value"
                                                    }
                                                    value={
                                                        typeof filterItem.value ===
                                                            "string" ||
                                                        typeof filterItem.value ===
                                                            "number"
                                                            ? filterItem.value
                                                            : ""
                                                    }
                                                    onChange={(e) =>
                                                        handleValueChange(
                                                            idx,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full bg-dashboard-card border border-dashboard-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-dashboard-primary/20 transition-all outline-none text-dashboard-foreground"
                                                />
                                            )}
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() =>
                                                handleRemoveFilter(idx)
                                            }
                                            className="mt-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-dashboard-destructive hover:bg-dashboard-destructive/10 border border-dashboard-destructive/20 hover:border-transparent transition cursor-pointer self-end bg-transparent"
                                        >
                                            <X size={12} />
                                            <span>
                                                {isAr
                                                    ? "حذف التصفية"
                                                    : "Delete Filter"}
                                            </span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <Button
                        onClick={handleAddFilter}
                        className="w-full rounded-xl border border-dashboard-border bg-dashboard-card text-dashboard-muted-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground font-bold text-xs py-2.5 px-4 transition"
                    >
                        {isAr ? "+ إضافة تصفية جديدة" : "+ Add New Filter"}
                    </Button>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-dashboard-border bg-dashboard-card flex items-center justify-end gap-2 shrink-0">
                    <Button
                        onClick={() => {
                            onReset();
                            onClose();
                        }}
                        className="rounded-xl border border-dashboard-border bg-dashboard-card text-dashboard-destructive hover:bg-dashboard-destructive/5 font-bold text-[10px]  tracking-wider py-2 px-4 transition"
                    >
                        {isAr ? "إعادة تعيين" : "Reset"}
                    </Button>
                    <Button
                        onClick={() => {
                            onApply();
                            onClose();
                        }}
                        className="rounded-xl bg-dashboard-primary text-dashboard-card hover:bg-dashboard-primary/95 font-bold text-[10px]  tracking-wider py-2 px-4 shadow-sm transition"
                    >
                        {isAr ? "تطبيق" : "Apply"}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Backdrop Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/20 backdrop-blur-xs z-50 cursor-pointer"
            />

            {/* Slide-out Panel */}
            <motion.div
                initial={{ x: isAr ? "-100%" : "100%" }}
                animate={{ x: 0 }}
                exit={{ x: isAr ? "-100%" : "100%" }}
                transition={{
                    type: "spring",
                    damping: 26,
                    stiffness: 220,
                }}
                className="fixed ltr:right-0 rtl:left-0 top-0 bottom-0 w-105 max-w-full bg-dashboard-card border-l border-dashboard-border shadow-2xl z-50 flex flex-col overflow-hidden font-sans text-left"
            >
                {/* Stuck-out Close Tab */}
                <button
                    onClick={onClose}
                    className={`absolute top-1/2 -translate-y-1/2 h-12.5 w-6.5 bg-dashboard-card border border-dashboard-border rounded-xl flex items-center justify-center cursor-pointer text-dashboard-foreground hover:bg-dashboard-secondary transition-colors outline-none shadow-md ${
                        isAr
                            ? "rtl:-left-6.5 rtl:border-l-0"
                            : "ltr:-right-6.5 ltr:border-r-0"
                    }`}
                    title={isAr ? "إغلاق" : "Close"}
                >
                    {isAr ? (
                        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                    ) : (
                        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                    )}
                </button>

                {/* Header */}
                <div className="p-4 border-b border-dashboard-border flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-dashboard-foreground">
                                {isAr ? "الفلاتر المتقدمة" : "Advanced Filters"}
                            </span>
                            <span className="text-[10px] text-dashboard-muted-foreground leading-none mt-0.5">
                                {isAr
                                    ? "تخصيص نتائج البحث بدقة"
                                    : "Refine search results precisely"}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {localFilters.length > 0 && (
                            <button
                                onClick={() => setLocalFilters([])}
                                className="text-[10px] text-dashboard-muted-foreground hover:text-dashboard-destructive transition font-bold  tracking-wider cursor-pointer bg-transparent border-0 p-0 mr-2"
                            >
                                {isAr ? "مسح الحالي" : "Clear Current"}
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="h-8 w-8 text-dashboard-muted-foreground hover:text-dashboard-foreground hover:bg-dashboard-secondary rounded-xl flex items-center justify-center transition-colors cursor-pointer outline-none bg-transparent border-0"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Form Fields Area (Dynamic Query Builder) */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-dashboard-background/30">
                    {localFilters.length === 0 ? (
                        <div className="text-center py-12 text-xs text-dashboard-muted-foreground font-semibold">
                            {isAr
                                ? 'لم يتم إضافة فلاتر بعد. اضغط على "إضافة فلتر" للبدء.'
                                : 'No filters added yet. Click "Add Filter" to start.'}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {localFilters.map((filterItem, idx) => {
                                const colMeta = metadata.filters.find(
                                    (f) => f.column === filterItem.column,
                                );
                                const operators = colMeta?.operators || [];
                                const fieldType = colMeta?.type || "text";

                                return (
                                    <div
                                        key={idx}
                                        className="flex flex-col gap-3 bg-dashboard-muted/50 p-4 rounded-xl border border-dashboard-border"
                                    >
                                        {/* Column Selection */}
                                        <div className="space-y-1">
                                            <label className="block text-[9px] font-bold text-dashboard-muted-foreground  tracking-wider">
                                                {isAr ? "الحقل" : "Field"}
                                            </label>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="w-full bg-dashboard-card border border-dashboard-border rounded-xl px-3 py-2 text-xs font-semibold flex items-center justify-between outline-none text-dashboard-foreground hover:bg-dashboard-secondary">
                                                    <span>{colMeta?.label || filterItem.column}</span>
                                                    <ChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-full min-w-50">
                                                    {metadata.filters.map((f) => (
                                                        <DropdownMenuItem
                                                            key={f.column}
                                                            onClick={() =>
                                                                handleColumnChange(
                                                                    idx,
                                                                    f.column as TKey,
                                                                )
                                                            }
                                                        >
                                                            {f.label}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Operator Selection */}
                                        <div className="space-y-1">
                                            <label className="block text-[9px] font-bold text-dashboard-muted-foreground  tracking-wider">
                                                {isAr ? "الشرط" : "Condition"}
                                            </label>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="w-full bg-dashboard-card border border-dashboard-border rounded-xl px-3 py-2 text-xs font-semibold flex items-center justify-between outline-none text-dashboard-foreground hover:bg-dashboard-secondary">
                                                    <span>
                                                        {metadata.operators[filterItem.operator] || filterItem.operator}
                                                    </span>
                                                    <ChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-full min-w-50">
                                                    {operators.map((op) => (
                                                        <DropdownMenuItem
                                                            key={op}
                                                            onClick={() =>
                                                                handleOperatorChange(idx, op)
                                                            }
                                                        >
                                                            {metadata.operators[op] || op}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Value input fields */}
                                        <div className="space-y-1">
                                            <label className="block text-[9px] font-bold text-dashboard-muted-foreground  tracking-wider">
                                                {isAr ? "القيمة" : "Value"}
                                            </label>
                                            {fieldType === "boolean" ? (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="w-full bg-dashboard-card border border-dashboard-border rounded-xl px-3 py-2 text-xs font-semibold flex items-center justify-between outline-none text-dashboard-foreground hover:bg-dashboard-secondary">
                                                        <span>
                                                            {String(filterItem.value) === "true"
                                                                ? (isAr ? "نعم" : "Yes")
                                                                : (isAr ? "لا" : "No")}
                                                        </span>
                                                        <ChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-full min-w-30">
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleValueChange(idx, true)
                                                            }
                                                        >
                                                            {isAr ? "نعم" : "Yes"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleValueChange(idx, false)
                                                            }
                                                        >
                                                            {isAr ? "لا" : "No"}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            ) : filterItem.operator ===
                                              "between" ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type={
                                                            fieldType ===
                                                            "number"
                                                                ? "number"
                                                                : fieldType ===
                                                                    "date"
                                                                  ? "date"
                                                                  : "text"
                                                        }
                                                        placeholder={
                                                            isAr ? "من" : "Min"
                                                        }
                                                        value={
                                                            Array.isArray(
                                                                filterItem.value,
                                                            )
                                                                ? filterItem
                                                                      .value[0]
                                                                : ""
                                                        }
                                                        onChange={(e) =>
                                                            handleValueChange(
                                                                idx,
                                                                e.target.value,
                                                                false,
                                                            )
                                                        }
                                                        className="w-full bg-dashboard-card border border-dashboard-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-dashboard-primary/20 transition-all outline-none text-dashboard-foreground"
                                                    />
                                                    <span className="text-[10px] font-bold text-dashboard-muted-foreground  shrink-0">
                                                        {isAr ? "إلى" : "To"}
                                                    </span>
                                                    <input
                                                        type={
                                                            fieldType ===
                                                            "number"
                                                                ? "number"
                                                                : fieldType ===
                                                                    "date"
                                                                  ? "date"
                                                                  : "text"
                                                        }
                                                        placeholder={
                                                            isAr ? "إلى" : "Max"
                                                        }
                                                        value={
                                                            Array.isArray(
                                                                filterItem.value,
                                                            )
                                                                ? filterItem
                                                                      .value[1]
                                                                : ""
                                                        }
                                                        onChange={(e) =>
                                                            handleValueChange(
                                                                idx,
                                                                e.target.value,
                                                                true,
                                                            )
                                                        }
                                                        className="w-full bg-dashboard-card border border-dashboard-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-dashboard-primary/20 transition-all outline-none text-dashboard-foreground"
                                                    />
                                                </div>
                                            ) : (
                                                <input
                                                    type={
                                                        fieldType === "number"
                                                            ? "number"
                                                            : fieldType ===
                                                                "date"
                                                              ? "date"
                                                              : "text"
                                                    }
                                                    placeholder={
                                                        isAr
                                                            ? "القيمة"
                                                            : "Value"
                                                    }
                                                    value={
                                                        typeof filterItem.value ===
                                                            "string" ||
                                                        typeof filterItem.value ===
                                                            "number"
                                                            ? filterItem.value
                                                            : ""
                                                    }
                                                    onChange={(e) =>
                                                        handleValueChange(
                                                            idx,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full bg-dashboard-card border border-dashboard-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-dashboard-primary/20 transition-all outline-none text-dashboard-foreground"
                                                />
                                            )}
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() =>
                                                handleRemoveFilter(idx)
                                            }
                                            className="mt-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-dashboard-destructive hover:bg-dashboard-destructive/10 border border-dashboard-destructive/20 hover:border-transparent transition cursor-pointer self-end bg-transparent"
                                        >
                                            <X size={12} />
                                            <span>
                                                {isAr
                                                    ? "حذف التصفية"
                                                    : "Delete Filter"}
                                            </span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <Button
                        onClick={handleAddFilter}
                        className="w-full rounded-xl border border-dashboard-border bg-dashboard-card text-dashboard-muted-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground font-bold text-xs py-2.5 px-4 transition"
                    >
                        {isAr ? "+ إضافة تصفية جديدة" : "+ Add New Filter"}
                    </Button>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-dashboard-border bg-dashboard-card flex items-center justify-end gap-2 shrink-0">
                    <Button
                        onClick={() => {
                            onReset();
                            onClose();
                        }}
                        className="rounded-xl border border-dashboard-border bg-dashboard-card text-dashboard-destructive hover:bg-dashboard-destructive/5 font-bold text-[10px]  tracking-wider py-2 px-4 transition"
                    >
                        {isAr ? "إعادة تعيين" : "Reset"}
                    </Button>
                    <Button
                        onClick={onClose}
                        className="rounded-xl border border-dashboard-border bg-dashboard-card text-dashboard-foreground hover:bg-dashboard-secondary font-bold text-[10px]  tracking-wider py-2 px-4 transition"
                    >
                        {isAr ? "إلغاء" : "Cancel"}
                    </Button>
                    <Button
                        onClick={() => {
                            onApply();
                            onClose();
                        }}
                        className="rounded-xl bg-dashboard-primary text-dashboard-card hover:bg-dashboard-primary/95 font-bold text-[10px]  tracking-wider py-2 px-4 shadow-sm transition"
                    >
                        {isAr ? "تطبيق" : "Apply"}
                    </Button>
                </div>
            </motion.div>
        </>
    );
}
