import React, { useState } from "react";
import { useLanguage } from "@/shared/hooks";
import { useDebounce } from "@/shared/observability";
import {
    ChevronRight,
    MoreVertical,
    Edit2,
    Trash2,
} from "lucide-react";
import { useFoldersOrClassificationsList } from "../api";
import {
    FolderModal,
    DeleteFolderModal,
    FolderEmptyState,
} from "../components";
import type { TemplateFolder } from "../types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";

export default function FoldersOrClassificationsPage() {
    const { t } = useLanguage("folders-or-classifications");

    // Search & pagination state
    const [search] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const [page] = useState(1);
    const [perPage] = useState(10);

    // Selected rows state
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Modals state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingFolder, setEditingFolder] = useState<TemplateFolder | null>(null);
    const [deletingFolder, setDeletingFolder] = useState<TemplateFolder | null>(null);

    // Query Data
    const { data, isLoading } = useFoldersOrClassificationsList({
        page,
        perPage,
        search: debouncedSearch || undefined,
    });

    const items: TemplateFolder[] = (data as any)?.items || [];

    // Checkbox selection
    const isAllSelected = items.length > 0 && selectedIds.length === items.length;
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map((i) => i.id));
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleOpenEdit = (folder: TemplateFolder) => {
        setEditingFolder(folder);
        setIsCreateOpen(true);
    };

    const handleOpenCreate = () => {
        setEditingFolder(null);
        setIsCreateOpen(true);
    };

    return (
        <div className="space-y-4 pb-12 select-none text-[#1E293B]">
            {/* Breadcrumb Navigation matching Screenshot 1 */}
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span>{t("home", "Home")}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#334155] font-semibold">
                    {t("title", "Folders or Classifications")}
                </span>
            </div>

            {/* Page Title matching Screenshot 1 */}
            <div>
                <h1 className="text-2xl font-bold text-[#0F172A] dark:text-dashboard-foreground tracking-tight">
                    {t("title", "Folders or Classifications")}
                </h1>
            </div>

            {/* Action Button: "Create Folder" matching Screenshot 1 */}
            <div>
                <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="h-9 px-4 text-xs font-semibold rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white transition-colors cursor-pointer inline-flex items-center shadow-2xs"
                >
                    <span>{t("createFolder", "Create Folder")}</span>
                </button>
            </div>

            {/* Table Card matching Screenshot 1 */}
            <div className="dashboard-card overflow-hidden flex flex-col">
                <div className="overflow-x-auto hide-scrollbar">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-[#F1F5F9] dark:border-dashboard-border text-[#64748B] dark:text-dashboard-muted-foreground text-xs uppercase font-semibold">
                                <th className="py-3.5 px-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                                        aria-label="Select all folders"
                                    />
                                </th>
                                <th className="py-3.5 px-6 font-bold tracking-wider text-start">
                                    {t("columns.name", "NAME")}
                                </th>
                                <th className="py-3.5 px-6 font-bold tracking-wider text-start">
                                    {t("columns.numberOfTemplates", "NUMBER OF TEMPLATES")}
                                </th>
                                <th className="py-3.5 px-6 font-bold tracking-wider text-end">
                                    {t("columns.actions", "ACTIONS")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9] dark:divide-dashboard-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-dashboard-primary" />
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={4}>
                                        <FolderEmptyState />
                                    </td>
                                </tr>
                            ) : (
                                items.map((folder) => {
                                    const isSelected = selectedIds.includes(folder.id);
                                    return (
                                        <tr
                                            key={folder.id}
                                            className={`hover:bg-[#F8FAFC] dark:hover:bg-dashboard-secondary/40 transition-colors ${
                                                isSelected ? "bg-[#EFF6FF]/40 dark:bg-dashboard-secondary" : ""
                                            }`}
                                        >
                                            <td className="py-4 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectRow(folder.id)}
                                                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                                                    aria-label={`Select ${folder.name}`}
                                                />
                                            </td>
                                            <td className="py-4 px-6 font-bold text-sm text-[#0F172A] dark:text-dashboard-foreground text-start">
                                                {folder.name}
                                            </td>
                                            <td className="py-4 px-6 font-medium text-xs text-[#334155] dark:text-dashboard-muted-foreground text-start">
                                                {folder.numberOfTemplates}
                                            </td>
                                            <td className="py-4 px-6 text-end">
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            className="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] dark:hover:bg-dashboard-secondary transition-colors flex items-center justify-center cursor-pointer outline-none"
                                                            aria-label="Actions"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-32 bg-white dark:bg-dashboard-card shadow-lg border border-[#E2E8F0] dark:border-dashboard-border rounded-xl p-1 text-xs z-50"
                                                        >
                                                            <DropdownMenuItem
                                                                onClick={() => handleOpenEdit(folder)}
                                                                className="flex items-center gap-2 px-3 py-2 text-[#334155] dark:text-dashboard-foreground hover:bg-[#F1F5F9] dark:hover:bg-dashboard-secondary rounded-lg cursor-pointer transition-colors"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5 text-[#64748B]" />
                                                                <span>{t("actions.edit", "Edit")}</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setDeletingFolder(folder)}
                                                                className="flex items-center gap-2 px-3 py-2 text-[#DC2626] hover:bg-[#FEF2F2] dark:hover:bg-red-950/20 rounded-lg cursor-pointer transition-colors"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5 text-[#DC2626]" />
                                                                <span>{t("actions.delete", "Delete")}</span>
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

            {/* Add / Edit Folder Modal matching Screenshot 2 */}
            <FolderModal
                isOpen={isCreateOpen}
                onClose={() => {
                    setIsCreateOpen(false);
                    setEditingFolder(null);
                }}
                folder={editingFolder}
            />

            {/* Delete Confirmation Modal */}
            <DeleteFolderModal
                isOpen={Boolean(deletingFolder)}
                onClose={() => setDeletingFolder(null)}
                folder={deletingFolder}
            />
        </div>
    );
}
