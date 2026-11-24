import React, { useState } from "react";
import { useLanguage } from "@/shared/hooks";
import { useDebounce } from "@/shared/observability";
import {
    ChevronRight,
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    BookOpen,
    Settings,
    FileText,
    List,
    HelpCircle,
    Shield,
    Book,
} from "lucide-react";
import { useInspectionTemplatesList } from "../api";
import {
    TemplateFilterPanel,
    TemplateBuilderModal,
    DeleteTemplateModal,
    TemplatesLibraryModal,
    type TemplateFilterState,
} from "../components";
import type { InspectionTemplate } from "../types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";

const DEFAULT_FILTERS: TemplateFilterState = {
    search: "",
    evaluationType: "",
    createDate: "",
    modifyDate: "",
    publishDate: "",
    user: "",
    group: "",
    folder: "",
    permission: "",
    instantInspection: false,
};

export default function InspectionTemplatesPage() {
    const { t } = useLanguage("inspection-templates");

    // Filter states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<TemplateFilterState>(DEFAULT_FILTERS);
    const debouncedSearch = useDebounce(filters.search, 300);

    // Pagination
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);

    // Selected rows state
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Modals state
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<InspectionTemplate | null>(null);
    const [deletingTemplate, setDeletingTemplate] = useState<InspectionTemplate | null>(null);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    // Query Data
    const { data, isLoading } = useInspectionTemplatesList({
        page,
        perPage,
        search: debouncedSearch || undefined,
    });

    const items: InspectionTemplate[] = (data as any)?.items || [];
    const totalItems: number = (data as any)?.total ?? items.length;

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

    const handleOpenEdit = (template: InspectionTemplate) => {
        setEditingTemplate(template);
        setIsBuilderOpen(true);
    };

    const handleOpenCreate = () => {
        setEditingTemplate(null);
        setIsBuilderOpen(true);
    };

    return (
        <div className="space-y-4 pb-12 select-none text-[#1E293B]">
            {/* Breadcrumb Navigation matching Screenshot 1 */}
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span>{t("home", "Home")}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#334155] font-semibold">
                    {t("title", "Inspection Templates")}
                </span>
            </div>

            {/* Page Title matching Screenshot 1 */}
            <div>
                <h1 className="text-2xl font-bold text-[#0F172A] dark:text-dashboard-foreground tracking-tight">
                    {t("title", "Inspection Templates")}
                </h1>
            </div>

            {/* Collapsible Filter Panel matching Screenshot 1 & 2 */}
            <TemplateFilterPanel
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
                filters={filters}
                onChange={setFilters}
                onApply={() => setPage(1)}
                onReset={() => {
                    setFilters(DEFAULT_FILTERS);
                    setPage(1);
                }}
            />

            {/* Action Bar & Total Items Toolbar matching Screenshot 1 */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                {/* Left: Total Items */}
                <div className="text-xs font-semibold text-[#64748B] dark:text-dashboard-muted-foreground">
                    {t("totalItems", "Total Items:")}{" "}
                    <span className="font-bold text-[#0F172A] dark:text-dashboard-foreground">
                        {totalItems}
                    </span>
                </div>

                {/* Right: Library, + Create Template, Order List */}
                <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Meayar Templates Library Button */}
                    <button
                        type="button"
                        onClick={() => setIsLibraryOpen(true)}
                        className="h-9 px-4 text-xs font-semibold rounded-lg border border-[#2563EB]/40 bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                        <BookOpen className="w-4 h-4 text-[#2563EB]" />
                        <span>{t("libraryButton", "Meayar Templates Library")}</span>
                    </button>

                    {/* + Create Template Button */}
                    <button
                        type="button"
                        onClick={handleOpenCreate}
                        className="h-9 px-4 text-xs font-semibold rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{t("createTemplate", "+ Create Template")}</span>
                    </button>

                    {/* قائمة الترتيب Button */}
                    <button
                        type="button"
                        onClick={() => {}}
                        className="h-9 px-3.5 text-xs font-semibold rounded-lg border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-card text-[#334155] dark:text-dashboard-foreground hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                        <Settings className="w-4 h-4 text-[#64748B]" />
                        <span>{t("orderList", "قائمة الترتيب")}</span>
                    </button>
                </div>
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
                                        aria-label="Select all templates"
                                    />
                                </th>
                                <th className="py-3.5 px-6 font-bold tracking-wider text-start">
                                    {t("columns.templates", "TEMPLATES")}
                                </th>
                                <th className="py-3.5 px-6 font-bold tracking-wider text-start">
                                    {t("columns.creationDate", "CREATION DATE")}
                                </th>
                                <th className="py-3.5 px-6 font-bold tracking-wider text-start">
                                    {t("columns.publishDate", "PUBLISH DATE")}
                                </th>
                                <th className="py-3.5 px-6 font-bold tracking-wider text-end">
                                    {t("columns.action", "ACTION")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9] dark:divide-dashboard-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-dashboard-primary" />
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-[#94A3B8]">
                                        {t("noTemplates", "No templates found")}
                                    </td>
                                </tr>
                            ) : (
                                items.map((template) => {
                                    const isSelected = selectedIds.includes(template.id);
                                    const isPublished = template.status === "published";

                                    return (
                                        <tr
                                            key={template.id}
                                            className={`hover:bg-[#F8FAFC] dark:hover:bg-dashboard-secondary/40 transition-colors ${
                                                isSelected ? "bg-[#EFF6FF]/40 dark:bg-dashboard-secondary" : ""
                                            }`}
                                        >
                                            <td className="py-4 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectRow(template.id)}
                                                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                                                    aria-label={`Select ${template.title}`}
                                                />
                                            </td>

                                            {/* Column: TEMPLATES matching Screenshot 1 */}
                                            <td className="py-4 px-6 text-start">
                                                <div className="flex items-start gap-3">
                                                    {/* Template Thumbnail Icon */}
                                                    <div className="w-9 h-11 rounded-lg overflow-hidden shrink-0 border border-[#E2E8F0] dark:border-dashboard-border flex items-center justify-center bg-[#F8FAFC] dark:bg-dashboard-background shadow-2xs">
                                                        {isPublished ? (
                                                            <Shield className="w-5 h-5 text-[#16A34A]" />
                                                        ) : (
                                                            <Book className="w-5 h-5 text-[#0F766E]" />
                                                        )}
                                                    </div>

                                                    {/* Title, Badge & Metadata Pills */}
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-bold text-sm text-[#0F172A] dark:text-dashboard-foreground">
                                                                {template.title}
                                                            </span>
                                                            <span
                                                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                                    isPublished
                                                                        ? "bg-[#DCFCE7] text-[#16A34A]"
                                                                        : "bg-[#FEE2E2] text-[#EF4444]"
                                                                }`}
                                                            >
                                                                {isPublished
                                                                    ? t("published", "Published")
                                                                    : t("unpublished", "Unpublished")}
                                                            </span>
                                                        </div>

                                                        {/* Metadata row: Pages, Sections, Questions matching Screenshot 1 */}
                                                        {isPublished && (
                                                            <div className="flex items-center gap-3 text-[11px] text-[#64748B] pt-0.5">
                                                                <div className="flex items-center gap-1">
                                                                    <FileText className="w-3.5 h-3.5 text-[#94A3B8]" />
                                                                    <span>{template.pagesCount} Pages</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <List className="w-3.5 h-3.5 text-[#94A3B8]" />
                                                                    <span>{template.sectionsCount} Sections</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <HelpCircle className="w-3.5 h-3.5 text-[#94A3B8]" />
                                                                    <span>{template.questionsCount} Questions</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column: CREATION DATE matching Screenshot 1 */}
                                            <td className="py-4 px-6 text-start text-xs">
                                                <div className="flex flex-col gap-0.5 text-[#64748B]">
                                                    <div>
                                                        {t("creationDatePrefix", "Creation Date:")}{" "}
                                                        <span className="text-[#334155] dark:text-dashboard-foreground font-medium">
                                                            {template.createdAt}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        {t("modifyDatePrefix", "Modify Date:")}{" "}
                                                        <span className="text-[#334155] dark:text-dashboard-foreground font-medium">
                                                            {template.modifiedAt}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column: PUBLISH DATE matching Screenshot 1 */}
                                            <td className="py-4 px-6 text-start text-xs font-medium text-[#334155] dark:text-dashboard-foreground">
                                                {template.publishedAt || "--"}
                                            </td>

                                            {/* Column: ACTION matching Screenshot 1 */}
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
                                                                onClick={() => handleOpenEdit(template)}
                                                                className="flex items-center gap-2 px-3 py-2 text-[#334155] dark:text-dashboard-foreground hover:bg-[#F1F5F9] dark:hover:bg-dashboard-secondary rounded-lg cursor-pointer transition-colors"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5 text-[#64748B]" />
                                                                <span>{t("actions.edit", "Edit")}</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setDeletingTemplate(template)}
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

            {/* Template Builder Modal matching Screenshot 3 */}
            <TemplateBuilderModal
                isOpen={isBuilderOpen}
                onClose={() => {
                    setIsBuilderOpen(false);
                    setEditingTemplate(null);
                }}
                template={editingTemplate}
            />

            {/* Delete Confirmation Modal */}
            <DeleteTemplateModal
                isOpen={Boolean(deletingTemplate)}
                onClose={() => setDeletingTemplate(null)}
                template={deletingTemplate}
            />

            {/* Templates Library Modal */}
            <TemplatesLibraryModal
                isOpen={isLibraryOpen}
                onClose={() => setIsLibraryOpen(false)}
            />
        </div>
    );
}
