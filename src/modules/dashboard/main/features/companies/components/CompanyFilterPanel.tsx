import React from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import type { CompanyFilterState } from "../types";

interface Props {
    isOpen: boolean;
    onToggle: () => void;
    filters: CompanyFilterState;
    onChange: (next: CompanyFilterState) => void;
    onApply: () => void;
    onReset: () => void;
}

export const CompanyFilterPanel: React.FC<Props> = ({
    isOpen,
    onToggle,
    filters,
    onChange,
    onApply,
    onReset,
}) => {
    const handleFieldChange = (field: keyof CompanyFilterState, value: any) => {
        onChange({
            ...filters,
            [field]: value,
        });
    };

    return (
        <div className="dashboard-card transition-all select-none overflow-hidden">
            {/* Header toggle */}
            <button
                type="button"
                onClick={onToggle}
                className="w-full flex items-center gap-2 p-4 text-xs font-semibold text-[#2563EB] hover:opacity-80 transition-opacity cursor-pointer text-start"
                aria-expanded={isOpen}
            >
                {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-[#2563EB]" />
                ) : (
                    <ChevronRight className="w-4 h-4 text-[#2563EB]" />
                )}
                <span>Filter</span>
            </button>

            {/* Filter Content */}
            {isOpen && (
                <div className="p-5 pt-0 border-t border-[#F1F5F9] space-y-4">
                    {/* Row 1: Search, Categories, Level Types */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => handleFieldChange("search", e.target.value)}
                                placeholder="Search"
                                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white outline-none text-[#0F172A] placeholder-[#94A3B8] focus:border-[#2563EB]"
                            />
                            {filters.search && (
                                <button
                                    type="button"
                                    onClick={() => handleFieldChange("search", "")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Categories */}
                        <div className="relative">
                            <select
                                value={filters.category}
                                onChange={(e) => handleFieldChange("category", e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white outline-none text-[#0F172A] appearance-none cursor-pointer focus:border-[#2563EB]"
                            >
                                <option value="">Categories</option>
                                <option value="مطعم">مطعم</option>
                                <option value="مطابخ الاعاشة">مطابخ الاعاشة</option>
                                <option value="مصانع">مصانع</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Level Types */}
                        <div className="relative">
                            <select
                                value={filters.levelType}
                                onChange={(e) => handleFieldChange("levelType", e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white outline-none text-[#0F172A] appearance-none cursor-pointer focus:border-[#2563EB]"
                            >
                                <option value="">Level Types</option>
                                <option value="Site">Site</option>
                                <option value="Area">Area</option>
                                <option value="Region">Region</option>
                                <option value="State">State</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Row 2: User & Group */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* User Select */}
                        <div className="relative">
                            <select
                                value={filters.user}
                                onChange={(e) => handleFieldChange("user", e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white outline-none text-[#0F172A] appearance-none cursor-pointer focus:border-[#2563EB]"
                            >
                                <option value="">اختر المستخدم</option>
                                <option value="user-1">عبدالرحمن قاسم</option>
                                <option value="user-2">فراس حافظ</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Group Select */}
                        <div className="relative">
                            <select
                                value={filters.group}
                                onChange={(e) => handleFieldChange("group", e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white outline-none text-[#0F172A] appearance-none cursor-pointer focus:border-[#2563EB]"
                            >
                                <option value="">اختر مجموعة</option>
                                <option value="group-1">المجموعة الافتراضية</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Row 3: Tags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <select
                                value={filters.tag}
                                onChange={(e) => handleFieldChange("tag", e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white outline-none text-[#0F172A] appearance-none cursor-pointer focus:border-[#2563EB]"
                            >
                                <option value="">Tags</option>
                                <option value="مطاعم متميزة">مطاعم متميزة</option>
                                <option value="اعاشة كبرى">اعاشة كبرى</option>
                                <option value="مصانع حلويات">مصانع حلويات</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Bottom controls */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#F1F5F9]">
                        {/* Switch toggle: Show Children Count */}
                        <div className="flex items-center gap-2.5">
                            <span className="text-xs font-medium text-[#475569]">
                                Show Children Count
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    handleFieldChange(
                                        "showChildrenCount",
                                        !filters.showChildrenCount
                                    )
                                }
                                className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
                                    filters.showChildrenCount
                                        ? "bg-[#2563EB]"
                                        : "bg-[#CBD5E1]"
                                }`}
                                aria-label="Toggle show children count"
                            >
                                <div
                                    className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
                                        filters.showChildrenCount
                                            ? "translate-x-3.5"
                                            : "translate-x-0"
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2.5">
                            <button
                                type="button"
                                onClick={onReset}
                                className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                            >
                                Save Filter
                            </button>
                            <button
                                type="button"
                                onClick={onApply}
                                className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xs transition-colors cursor-pointer"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
