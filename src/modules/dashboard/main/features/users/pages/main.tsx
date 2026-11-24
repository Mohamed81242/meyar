import React, { useState } from "react";
import { useLanguage } from "@/shared/hooks";
import { useDebounce } from "@/shared/observability";
import {
    ChevronRight,
    Plus,
    MoreVertical,
    CheckCircle2,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronsLeft,
    ChevronsRight,
    Send,
} from "lucide-react";
import { useUserssList } from "../api";
import { UserFilterPanel, UserModal, DeleteUserModal } from "../components";
import type { User, UserFilterState } from "../types";
import { exportToExcel } from "@/utils/fileUtils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";
import { toast } from "sonner";

const DEFAULT_FILTERS: UserFilterState = {
    search: "",
    role: "",
    template: "",
    entity: "",
    task: "",
    action: "",
    permission: "",
    status: "all",
    group: "",
    typePermission: "all",
    showGroups: false,
};

export default function UsersPage() {
    const { t } = useLanguage("users");

    // Filter states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<UserFilterState>(DEFAULT_FILTERS);
    const debouncedSearch = useDebounce(filters.search, 300);

    // Pagination
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Selected rows
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    // Query Data
    const { data, isLoading } = useUserssList({
        page,
        perPage,
        search: debouncedSearch || undefined,
        status: filters.status !== "all" ? filters.status : undefined,
    });

    const items: User[] = (data as any)?.items || [];
    const totalItems: number = (data as any)?.total ?? items.length;
    const totalPages: number = (data as any)?.lastPage ?? (Math.ceil(totalItems / perPage) || 1);

    // Filtered items (client-side role / advanced filter refinement if set)
    const displayedItems = items.filter((item) => {
        if (filters.role && item.role !== filters.role) return false;
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
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
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
            "users-export.xlsx"
        );
    };

    const handleSendNotification = () => {
        toast.info("إرسال إشعار للمستخدمين المحددين");
    };

    return (
        <div className="space-y-4 pb-12 select-none text-[#1E293B]">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span>Home</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#334155] font-semibold">Users</span>
            </div>

            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                    Users
                </h1>
            </div>

            {/* Collapsible Filter Panel */}
            <UserFilterPanel
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

            {/* Table Card */}
            <div className="dashboard-card overflow-hidden flex flex-col">
                {/* Table Header Toolbar */}
                <div className="p-4 px-6 border-b border-[#F1F5F9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    {/* Left: Total Items */}
                    <div className="text-xs font-medium text-[#64748B]">
                        Total Items: <span className="font-bold text-[#0F172A]">{totalItems}</span>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                        {/* Export Excel Button */}
                        <button
                            type="button"
                            onClick={handleExportExcel}
                            className="h-8.5 px-4 text-xs font-semibold rounded-lg border border-[#2563EB]/40 bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE] transition-colors cursor-pointer"
                        >
                            تصدير اكسل
                        </button>

                        {/* Send Notification Button */}
                        <button
                            type="button"
                            onClick={handleSendNotification}
                            className="h-8.5 px-4 text-xs font-semibold rounded-lg border border-[#2563EB]/40 bg-white text-[#2563EB] hover:bg-[#EFF6FF] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <Send className="w-3.5 h-3.5 text-[#2563EB]" />
                            <span>Send Notification</span>
                        </button>

                        {/* Primary Add Button */}
                        <button
                            type="button"
                            onClick={handleOpenCreate}
                            className="h-8.5 px-4 text-xs font-semibold rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add New User</span>
                        </button>
                    </div>
                </div>

                {/* Table Viewport */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-start border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]/50 text-[11px] font-bold text-[#64748B] uppercase tracking-wider select-none">
                                <th className="px-4 py-3.5 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                                        aria-label="Select all"
                                    />
                                </th>
                                <th className="px-4 py-3.5 text-start font-bold">NAME</th>
                                <th className="px-4 py-3.5 text-start font-bold">ROLE</th>
                                <th className="px-4 py-3.5 text-start font-bold">ACCOUNT DETAILS</th>
                                <th className="px-4 py-3.5 text-start font-bold">CREATION DATE</th>
                                <th className="px-4 py-3.5 text-start font-bold">MODIFICATION DATE</th>
                                <th className="px-4 py-3.5 text-start font-bold">STATUS</th>
                                <th className="px-4 py-3.5 text-center font-bold w-16">ACTION</th>
                            </tr>
                        </thead>
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
                                            className={`hover:bg-[#F8FAFC] transition-colors ${
                                                isRowSelected ? "bg-[#EFF6FF]/40" : ""
                                            }`}
                                        >
                                            {/* Checkbox */}
                                            <td className="px-4 py-3.5 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isRowSelected}
                                                    onChange={() => handleSelectRow(item.id)}
                                                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                                                    aria-label={`Select ${item.name}`}
                                                />
                                            </td>

                                            {/* Name & Avatar */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-[#E2E8F0] text-[#64748B] font-bold flex items-center justify-center text-xs shrink-0 select-none">
                                                        N/A
                                                    </div>
                                                    <span className="font-bold text-[#0F172A] text-xs">
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="px-4 py-3.5 text-[#334155] font-medium text-xs">
                                                {item.role || "أدمن"}
                                            </td>

                                            {/* Account Details */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex flex-col gap-1 text-xs">
                                                    {item.email && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[#334155] font-medium">
                                                                {item.email}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                                                                <CheckCircle2 className="w-3 h-3 text-[#059669]" />
                                                                <span>Activated</span>
                                                            </span>
                                                        </div>
                                                    )}
                                                    {item.phone && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[#64748B] text-[11px]">
                                                                {item.phone}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                                                                <CheckCircle2 className="w-3 h-3 text-[#059669]" />
                                                                <span>Activated</span>
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Creation Date */}
                                            <td className="px-4 py-3.5 text-[#475569] text-xs">
                                                {item.createdAt}
                                            </td>

                                            {/* Modification Date */}
                                            <td className="px-4 py-3.5 text-[#475569] text-xs">
                                                {item.updatedAt}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-4 py-3.5">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                                                    <span>Active</span>
                                                </span>
                                            </td>

                                            {/* Action Dropdown */}
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
                                                        className="w-32 bg-white border border-[#E2E8F0] rounded-xl p-1 shadow-lg text-xs z-50"
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={() => handleOpenEdit(item)}
                                                            className="flex items-center gap-2 px-3 py-2 text-[#334155] hover:bg-[#F1F5F9] rounded-lg cursor-pointer transition-colors"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5 text-[#64748B]" />
                                                            <span>تعديل</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => setDeletingUser(item)}
                                                            className="flex items-center gap-2 px-3 py-2 text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg cursor-pointer transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 text-[#DC2626]" />
                                                            <span>حذف</span>
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
                <div className="p-4 px-6 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-[#64748B]">
                        <span>Rows per page</span>
                        <select
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(Number(e.target.value));
                                setPage(1);
                            }}
                            className="h-8 px-2 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#0F172A] outline-none cursor-pointer"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => setPage(1)}
                            className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            aria-label="First page"
                        >
                            <ChevronsLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>

                        <button
                            type="button"
                            className="w-8 h-8 rounded-lg bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer"
                        >
                            {page}
                        </button>

                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            aria-label="Next page"
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() => setPage(totalPages)}
                            className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            aria-label="Last page"
                        >
                            <ChevronsRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* User Create / Edit Modal */}
            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={editingUser}
            />

            {/* Delete Confirmation Modal */}
            <DeleteUserModal
                isOpen={Boolean(deletingUser)}
                onClose={() => setDeletingUser(null)}
                user={deletingUser}
            />
        </div>
    );
}
