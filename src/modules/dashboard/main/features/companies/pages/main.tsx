import React, { useState } from "react";
import { useLanguage } from "@/shared/hooks";
import { useDebounce } from "@/shared/observability";
import { ChevronRight, Plus, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useCompaniesList } from "../api";
import { CompanyFilterPanel, CompanyModal, DeleteCompanyModal } from "../components";
import type { Company, CompanyFilterState } from "../types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";

const DEFAULT_FILTERS: CompanyFilterState = {
    search: "",
    category: "",
    levelType: "all",
    user: "",
    group: "",
    tag: "",
    showChildrenCount: false,
};

export default function CompaniesPage() {
    const { t } = useLanguage("companies");

    // Filter states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<CompanyFilterState>(DEFAULT_FILTERS);
    const [activeLevelTab, setActiveLevelTab] = useState<string>("all");
    const debouncedSearch = useDebounce(filters.search, 300);

    // Selected rows
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);

    // Query Data
    const { data, isLoading } = useCompaniesList({
        search: debouncedSearch || undefined,
        category: filters.category || undefined,
        levelType: activeLevelTab !== "all" ? activeLevelTab : filters.levelType !== "all" ? filters.levelType : undefined,
    });

    const items: Company[] = (data as any)?.items || [];

    // Filtered items
    const displayedItems = items.filter((item) => {
        if (filters.tag && item.tag !== filters.tag) return false;
        return true;
    });

    // Checkbox selection
    const isAllSelected = displayedItems.length > 0 && selectedIds.length === displayedItems.length;
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(displayedItems.map((i) => i.id));
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleOpenCreate = () => {
        setEditingCompany(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (comp: Company) => {
        setEditingCompany(comp);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-4 pb-12 select-none text-[#1E293B]">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span>Home</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#334155] font-semibold">companies</span>
            </div>

            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                    companies
                </h1>
            </div>

            {/* Collapsible Filter Panel */}
            <CompanyFilterPanel
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
                filters={filters}
                onChange={setFilters}
                onApply={() => {}}
                onReset={() => setFilters(DEFAULT_FILTERS)}
            />

            {/* Tabs & Add Button Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {/* Level Type Pills */}
                <div className="flex items-center gap-2 flex-wrap">
                    {[
                        { label: "State (0)", value: "State" },
                        { label: "Region (0)", value: "Region" },
                        { label: "Area (3)", value: "Area" },
                        { label: "Site (9)", value: "Site" },
                    ].map((tab) => {
                        const isSelected = activeLevelTab === tab.value;
                        return (
                            <button
                                key={tab.label}
                                type="button"
                                onClick={() =>
                                    setActiveLevelTab(
                                        isSelected ? "all" : tab.value
                                    )
                                }
                                className={`h-8 px-3.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                    isSelected
                                        ? "bg-[#2563EB] text-white border-[#2563EB] shadow-xs"
                                        : "bg-white text-[#2563EB] border-[#2563EB]/30 hover:bg-[#EFF6FF]"
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Add Company Button */}
                <div>
                    <button
                        type="button"
                        onClick={handleOpenCreate}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                        aria-label="Add Company"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Company</span>
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="dashboard-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-start border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]/50 text-[11px] font-bold text-[#64748B] uppercase tracking-wider select-none">
                                <th className="py-4 px-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                                        aria-label="Select all"
                                    />
                                </th>
                                <th className="py-4 px-6 text-start font-bold">Name</th>
                                <th className="py-4 px-6 text-start font-bold">Category</th>
                                <th className="py-4 px-6 text-start font-bold">Level Type</th>
                                <th className="py-4 px-6 text-end font-bold w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9]">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-[#94A3B8]">
                                        Loading companies...
                                    </td>
                                </tr>
                            ) : displayedItems.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-[#94A3B8]">
                                        No companies found
                                    </td>
                                </tr>
                            ) : (
                                displayedItems.map((comp) => {
                                    const isRowSelected = selectedIds.includes(comp.id);
                                    return (
                                        <tr
                                            key={comp.id}
                                            className={`hover:bg-[#F8FAFC] transition-colors ${
                                                isRowSelected ? "bg-[#EFF6FF]/40" : ""
                                            }`}
                                        >
                                            <td className="py-4 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isRowSelected}
                                                    onChange={() => handleSelectRow(comp.id)}
                                                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                                                    aria-label={`Select ${comp.name}`}
                                                />
                                            </td>
                                            <td className="py-4 px-6 font-bold text-sm text-[#0F172A] text-start">
                                                {comp.name}
                                            </td>
                                            <td className="py-4 px-6 font-medium text-xs text-[#334155] text-start">
                                                {comp.category}
                                            </td>
                                            <td className="py-4 px-6 font-medium text-xs text-[#64748B] text-start">
                                                {comp.levelType}
                                            </td>
                                            <td className="py-4 px-6 text-end">
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            className="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors flex items-center justify-center cursor-pointer outline-none"
                                                            aria-label="Actions"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-32 bg-white shadow-lg border border-[#E2E8F0] rounded-xl p-1 text-xs z-50"
                                                        >
                                                            <DropdownMenuItem
                                                                onClick={() => handleOpenEdit(comp)}
                                                                className="flex items-center gap-2 px-3 py-2 text-[#334155] hover:bg-[#F1F5F9] rounded-lg cursor-pointer transition-colors"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5 text-[#64748B]" />
                                                                <span>تعديل</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setDeletingCompany(comp)}
                                                                className="flex items-center gap-2 px-3 py-2 text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg cursor-pointer transition-colors"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5 text-[#DC2626]" />
                                                                <span>حذف</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create / Edit Company Modal */}
            <CompanyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                company={editingCompany}
            />

            {/* Delete Confirmation Modal */}
            <DeleteCompanyModal
                isOpen={Boolean(deletingCompany)}
                onClose={() => setDeletingCompany(null)}
                company={deletingCompany}
            />
        </div>
    );
}
