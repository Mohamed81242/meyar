import React, { useState } from "react";
import { useLanguage } from "@/shared/hooks";
import { useDebounce } from "@/shared/observability";
import {
    ChevronRight,
    Search,
    Plus,
    MoreVertical,
    CheckCircle2,
    Edit2,
    Trash2,
    RotateCcw,
    ChevronLeft,
    ChevronsLeft,
    ChevronsRight,
    Send,
} from "lucide-react";
import { useCompanyTagssList } from "../api";
import {
    CreateCompanyTagsModal,
    EditCompanyTagsModal,
    DeleteCompanyTagsModal,
} from "../components";
import type { CompanyTags } from "../types";
import { exportToExcel } from "@/utils/fileUtils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";

export default function CompanyTagsPage() {
    const { t } = useLanguage("company-tags");

    // Filter states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const [statusFilter, setStatusFilter] = useState("all");

    // Pagination
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Selected rows
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CompanyTags | null>(null);
    const [deletingItem, setDeletingItem] = useState<CompanyTags | null>(null);

    // Query Data
    const { data, isLoading } = useCompanyTagssList({
        page,
        perPage,
        search: debouncedSearch || undefined,
    });

    const items: CompanyTags[] = (data as any)?.items || [];
    const totalItems: number = (data as any)?.total ?? items.length;
    const totalPages: number = (data as any)?.lastPage ?? (Math.ceil(totalItems / perPage) || 1);

    // Filtered items (client status filter if applicable)
    const displayedItems = items.filter((item) => {
        if (statusFilter === "active") return item.isActive;
        if (statusFilter === "inactive") return !item.isActive;
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

    const handleExportExcel = () => {
        exportToExcel(
            displayedItems,
            [
                { header: "ID", accessor: (row) => row.id },
                { header: "Name", accessor: (row) => row.name },
                { header: "Role", accessor: (row) => row.role || "—" },
                { header: "Email", accessor: (row) => row.email || "—" },
                { header: "Phone", accessor: (row) => row.phone || "—" },
                { header: "Status", accessor: (row) => (row.isActive ? "Active" : "Inactive") },
                { header: "Created At", accessor: (row) => row.createdAt },
            ],
            "company-tags-export.xlsx"
        );
    };

    return (
        <div className="flex flex-col gap-4 w-full select-none text-[#1E293B]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
                <span>Home</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#334155] font-semibold">
                    Company Tags
                </span>
            </div>

            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                    Company Tags
                </h1>
            </div>

            {/* Collapsible Filter Card */}
            <div className="dashboard-card p-3.5 px-5 transition-all">
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 text-sm font-semibold text-dashboard-primary hover:opacity-80 transition-colors cursor-pointer select-none"
                >
                    <ChevronRight
                        className={`w-4 h-4 text-dashboard-primary transition-transform duration-200 ${
                            isFilterOpen ? "rotate-90" : ""
                        }`}
                    />
                    <span>Filter</span>
                </button>

                {isFilterOpen && (
                    <div className="mt-3 pt-3 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150">
                        {/* Search Input */}
                        <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus-within:border-dashboard-primary transition-colors">
                            <Search className="w-4 h-4 text-[#94A3B8] shrink-0" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent border-none outline-none w-full text-xs text-[#0F172A] placeholder:text-[#94A3B8]"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            className="px-3 h-9 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#0F172A] outline-none cursor-pointer"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        {/* Reset Button */}
                        <button
                            onClick={() => {
                                setSearch("");
                                setStatusFilter("all");
                                setPage(1);
                            }}
                            className="px-3 h-9 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#475569] hover:bg-[#F1F5F9] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Reset Filters</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Table Card */}
            <div className="dashboard-card overflow-hidden flex flex-col">
                {/* Table Header Toolbar */}
                <div className="p-4 px-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    {/* Left: Total Items */}
                    <div className="text-sm font-medium text-[#64748B]">
                        Total Items: <span className="font-bold text-[#0F172A]">{totalItems}</span>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                        {/* Export Excel Button */}
                        <button
                            onClick={handleExportExcel}
                            className="h-9 px-4 text-xs font-semibold rounded-lg border border-dashboard-primary/30 bg-dashboard-secondary text-dashboard-primary hover:bg-dashboard-secondary/80 transition-colors cursor-pointer"
                        >
                            تصدير اكسل
                        </button>

                        {/* Send Notification Button */}
                        <button
                            onClick={() => alert("Send notification")}
                            className="h-9 px-4 text-xs font-semibold rounded-lg border border-dashboard-primary/30 bg-white text-dashboard-primary hover:bg-dashboard-secondary flex items-center gap-2 transition-colors cursor-pointer"
                        >
                            <Send className="w-4 h-4 text-dashboard-primary" />
                            <span>Send Notification</span>
                        </button>

                        {/* Primary Add Button */}
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="h-9 px-4.5 text-xs font-semibold rounded-lg bg-dashboard-primary hover:opacity-90 text-white flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>+ Add New Company Tags</span>
                        </button>
                    </div>
                </div>

                {/* Table Viewport */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-start text-xs border-collapse">
                        {/* Columns */}
                        <thead>
                            <tr className="border-b border-[#E2E8F0] bg-white text-xs font-bold text-[#475569] uppercase tracking-wider select-none">
                                <th className="px-4 py-3 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                                    />
                                </th>
                                <th className="px-4 py-3 text-start font-bold">NAME</th>
                                <th className="px-4 py-3 text-start font-bold">ROLE</th>
                                <th className="px-4 py-3 text-start font-bold">ACCOUNT DETAILS</th>
                                <th className="px-4 py-3 text-start font-bold">CREATION DATE</th>
                                <th className="px-4 py-3 text-start font-bold">MODIFICATION DATE</th>
                                <th className="px-4 py-3 text-start font-bold">STATUS</th>
                                <th className="px-4 py-3 text-center font-bold">ACTION</th>
                            </tr>
                        </thead>

                        {/* Rows */}
                        <tbody className="divide-y divide-[#F1F5F9]">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-[#94A3B8]">
                                        Loading records...
                                    </td>
                                </tr>
                            ) : displayedItems.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-[#94A3B8]">
                                        No records found.
                                    </td>
                                </tr>
                            ) : (
                                displayedItems.map((item) => {
                                    const isRowSelected = selectedIds.includes(item.id);
                                    return (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-[#F8FAFC] transition-colors"
                                        >
                                            {/* Checkbox */}
                                            <td className="px-4 py-3.5 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isRowSelected}
                                                    onChange={() => handleSelectRow(item.id)}
                                                    className="w-4 h-4 rounded border-[#CBD5E1] text-dashboard-primary focus:ring-dashboard-primary cursor-pointer"
                                                />
                                            </td>

                                            {/* Name & Avatar */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-[#E2E8F0] text-[#64748B] font-bold flex items-center justify-center text-xs shrink-0">
                                                        {item.name ? item.name.charAt(0) : "N/A"}
                                                    </div>
                                                    <span className="font-bold text-[#0F172A] text-sm truncate">
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="px-4 py-3.5 text-[#334155] font-medium text-xs">
                                                {item.role || "أدمن"}
                                            </td>

                                            {/* Account Details with Activated pill */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex flex-col gap-1 text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[#334155] font-medium">
                                                            {item.email || "rmz.alemtithal@gmail.com"}
                                                        </span>
                                                        <span className="px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] text-[10px] font-semibold">
                                                            Activated
                                                        </span>
                                                    </div>
                                                    {item.phone && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[#64748B]">
                                                                {item.phone}
                                                            </span>
                                                            <span className="px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] text-[10px] font-semibold">
                                                                Activated
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Creation Date */}
                                            <td className="px-4 py-3.5 text-[#475569] font-medium whitespace-nowrap text-xs">
                                                {item.createdAt}
                                            </td>

                                            {/* Modification Date */}
                                            <td className="px-4 py-3.5 text-[#475569] font-medium whitespace-nowrap text-xs">
                                                {item.updatedAt}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#10B981] bg-[#ECFDF5] text-[#059669] text-xs font-semibold">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                                                    Active
                                                </span>
                                            </td>

                                            {/* Action Menu (3 dots) */}
                                            <td className="px-4 py-3.5 text-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer outline-none mx-auto"
                                                        aria-label="Actions"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-36 bg-white border border-[#E2E8F0] rounded-xl p-1 shadow-lg text-xs"
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={() => setEditingItem(item)}
                                                            className="flex items-center gap-2 px-3 py-2 text-xs text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg cursor-pointer"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5 text-dashboard-primary" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => setDeletingItem(item)}
                                                            className="flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                                            <span>Delete</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 px-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B] select-none">
                    {/* Rows per page */}
                    <div className="flex items-center gap-2">
                        <span>Rows per page</span>
                        <select
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(Number(e.target.value));
                                setPage(1);
                            }}
                            className="h-8 px-2.5 rounded-md border border-[#E2E8F0] bg-white text-xs text-[#0F172A] outline-none cursor-pointer"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    {/* Page Navigation Controls */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setPage(1)}
                            disabled={page <= 1}
                            className="p-1 text-[#94A3B8] hover:text-[#0F172A] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            aria-label="First page"
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page <= 1}
                            className="p-1 text-[#94A3B8] hover:text-[#0F172A] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <span className="w-7 h-7 rounded-lg bg-dashboard-primary text-white font-bold flex items-center justify-center text-xs shadow-sm">
                            {page}
                        </span>

                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            disabled={page >= totalPages}
                            className="p-1 text-[#94A3B8] hover:text-[#0F172A] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            aria-label="Next page"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPage(totalPages)}
                            disabled={page >= totalPages}
                            className="p-1 text-[#94A3B8] hover:text-[#0F172A] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            aria-label="Last page"
                        >
                            <ChevronsRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CreateCompanyTagsModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            <EditCompanyTagsModal
                isOpen={!!editingItem}
                onClose={() => setEditingItem(null)}
                item={editingItem}
            />

            <DeleteCompanyTagsModal
                isOpen={!!deletingItem}
                onClose={() => setDeletingItem(null)}
                item={deletingItem}
            />
        </div>
    );
}
