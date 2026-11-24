import React, { useState } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import type { UserFilterState } from "../types";

interface Props {
    isOpen: boolean;
    onToggle: () => void;
    filters: UserFilterState;
    onChange: (next: UserFilterState) => void;
    onApply: () => void;
    onReset: () => void;
}

export const UserFilterPanel: React.FC<Props> = ({
    isOpen,
    onToggle,
    filters,
    onChange,
    onApply,
    onReset,
}) => {
    const handleFieldChange = (field: keyof UserFilterState, value: any) => {
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
                    {/* Row 1: Search & Roles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        {/* Roles */}
                        <div className="relative">
                            <select
                                value={filters.role}
                                onChange={(e) => handleFieldChange("role", e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white outline-none text-[#0F172A] appearance-none cursor-pointer focus:border-[#2563EB]"
                            >
                                <option value="">roles</option>
                                <option value="أدمن">أدمن</option>
                                <option value="مراقب">مراقب</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Row 2: Template, Entity, Task */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Assessment Template */}
                        <div className="relative">
                            <select
                                value={filters.template}
                                onChange={(e) => handleFieldChange("template", e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white outline-none text-[#0F172A] appearance-none cursor-pointer focus:border-[#2563EB]"
                            >
                                <option value="">قالب التقييم</option>
                                <option value="بنود تفتيش المطاعم">بنود تفتيش المطاعم</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Entities */}
                        <div className="relative">
                            <select
                                value={filters.entity}
                                onChange={(e) => handleFieldChange("entity", e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white outline-none text-[#0F172A] appearance-none cursor-pointer focus:border-[#2563EB]"
                            >
                                <option value="">الجهات</option>
                                <option value="سيلفش">سيلفش - Sellfish</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Task */}
                        <div className="relative">
                            <select
                                value={filters.task}
                                onChange={(e) => handleFieldChange("task", e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white outline-none text-[#0F172A] appearance-none cursor-pointer focus:border-[#2563EB]"
                            >
                                <option value="">مهمة التقييم</option>
                                <option value="task-1">مهمة تقييم 1</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Row 3: Actions & Permissions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Actions */}
                        <div className="relative">
                            <select
                                value={filters.action}
                                onChange={(e) => handleFieldChange("action", e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white outline-none text-[#0F172A] appearance-none cursor-pointer focus:border-[#2563EB]"
                            >
                                <option value="">الإجراءات</option>
                                <option value="action-1">إجراء 1</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Permissions */}
                        <div className="relative">
                            <select
                                value={filters.permission}
                                onChange={(e) => handleFieldChange("permission", e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white outline-none text-[#0F172A] appearance-none cursor-pointer focus:border-[#2563EB]"
                            >
                                <option value="">Permissions</option>
                                <option value="perm-all">All Permissions</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Row 4: Status, Groups, Type Permissions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Status */}
                        <div className="relative">
                            <select
                                value={filters.status}
                                onChange={(e) => handleFieldChange("status", e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white outline-none text-[#0F172A] appearance-none cursor-pointer focus:border-[#2563EB]"
                            >
                                <option value="all">Status: All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Groups */}
                        <div className="relative">
                            <select
                                value={filters.group}
                                onChange={(e) => handleFieldChange("group", e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white outline-none text-[#0F172A] appearance-none cursor-pointer focus:border-[#2563EB]"
                            >
                                <option value="">Groups</option>
                                <option value="group-1">Default Group</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Type Permissions */}
                        <div className="relative">
                            <select
                                value={filters.typePermission}
                                onChange={(e) =>
                                    handleFieldChange("typePermission", e.target.value)
                                }
                                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white outline-none text-[#0F172A] appearance-none cursor-pointer focus:border-[#2563EB]"
                            >
                                <option value="all">Type Permissions: All</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Bottom controls */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#F1F5F9]">
                        {/* Switch toggle: Show Groups */}
                        <div className="flex items-center gap-2.5">
                            <span className="text-xs font-medium text-[#475569]">Show Groups</span>
                            <button
                                type="button"
                                onClick={() =>
                                    handleFieldChange("showGroups", !filters.showGroups)
                                }
                                className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
                                    filters.showGroups ? "bg-[#2563EB]" : "bg-[#CBD5E1]"
                                }`}
                                aria-label="Toggle show groups"
                            >
                                <div
                                    className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
                                        filters.showGroups ? "translate-x-3.5" : "translate-x-0"
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
