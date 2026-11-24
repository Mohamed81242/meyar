import React, { useState } from "react";
import { useLanguage } from "@/shared/hooks";
import { ChevronRight, Plus, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useCompanyClassificationssList } from "../api";
import { ClassificationModal, DeleteClassificationModal } from "../components";
import type { CompanyClassification } from "../types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";

export default function CompanyClassificationsPage() {
    const { t } = useLanguage("company-classifications");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CompanyClassification | null>(null);
    const [deletingItem, setDeletingItem] = useState<CompanyClassification | null>(null);

    // Selected rows
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Query data
    const { data, isLoading } = useCompanyClassificationssList();
    const items: CompanyClassification[] = (data as any)?.items || [];

    // Checkbox selection
    const isAllSelected = items.length > 0 && selectedIds.length === items.length;
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map((r) => r.id));
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleOpenCreate = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item: CompanyClassification) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 pb-12 select-none">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span>Home</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#334155] font-semibold">
                    Company Classifications
                </span>
            </div>

            {/* Page Title & Add Button */}
            <div className="space-y-4">
                <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                    Company Classifications
                </h1>

                <div>
                    <button
                        onClick={handleOpenCreate}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                        aria-label="Add New Classification"
                    >
                        <span>+ Add New Classification</span>
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="dashboard-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-start border-collapse">
                        <thead>
                            <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]/50 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                                <th className="py-4 px-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                                        aria-label="Select all"
                                    />
                                </th>
                                <th className="py-4 px-6 text-start font-bold">NAME</th>
                                <th className="py-4 px-6 text-start font-bold">DESCRIPTION</th>
                                <th className="py-4 px-6 text-end font-bold w-24">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9] text-xs">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-[#94A3B8]">
                                        Loading...
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-[#94A3B8]">
                                        No classifications found
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => {
                                    const isSelected = selectedIds.includes(item.id);
                                    return (
                                        <tr
                                            key={item.id}
                                            className={`hover:bg-[#F8FAFC] transition-colors ${
                                                isSelected ? "bg-[#EFF6FF]/40" : ""
                                            }`}
                                        >
                                            <td className="py-4 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectRow(item.id)}
                                                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                                                    aria-label={`Select ${item.name}`}
                                                />
                                            </td>
                                            <td className="py-4 px-6 font-bold text-sm text-[#0F172A] text-start">
                                                {item.name}
                                            </td>
                                            <td className="py-4 px-6 font-medium text-xs text-[#334155] text-start">
                                                {item.description || "—"}
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
                                                        <DropdownMenuContent align="end" className="w-32 bg-white shadow-lg border border-[#E2E8F0] rounded-xl p-1 text-xs z-50">
                                                            <DropdownMenuItem
                                                                onClick={() => handleOpenEdit(item)}
                                                                className="flex items-center gap-2 px-3 py-2 text-[#334155] hover:bg-[#F1F5F9] rounded-lg cursor-pointer transition-colors"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5 text-[#64748B]" />
                                                                <span>تعديل</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setDeletingItem(item)}
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

            {/* Create / Edit Modal */}
            <ClassificationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                classification={editingItem}
            />

            {/* Delete Confirmation Modal */}
            <DeleteClassificationModal
                isOpen={Boolean(deletingItem)}
                onClose={() => setDeletingItem(null)}
                classification={deletingItem}
            />
        </div>
    );
}
