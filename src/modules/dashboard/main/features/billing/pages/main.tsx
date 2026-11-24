import React, { useState } from "react";
import { useLanguage } from "@/shared/hooks";
import { useDebounce } from "@/shared/observability";
import {
    ChevronRight,
    Search,
    Send,
    Plus,
    MoreVertical,
    RotateCcw,
    Receipt,
    Eye,
    ChevronLeft,
    ChevronsLeft,
    ChevronsRight,
    CheckCircle2,
    Check,
} from "lucide-react";
import { useFinanceOverview } from "../api/billing.queries";
import {
    TransactionDetailModal,
    WalletActionModal,
} from "../components";
import type {
    FinancialTransaction,
    WalletTransaction,
} from "../types";
import { exportToExcel } from "@/utils/fileUtils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";

export default function BillingPage() {
    const { t } = useLanguage("billing");

    // Filter states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    // Pagination
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Selected items for checkboxes
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    // Detail Modal
    const [selectedTransactionForDetail, setSelectedTransactionForDetail] =
        useState<FinancialTransaction | null>(null);

    // Wallet Action Modal
    const [walletModalState, setWalletModalState] = useState<{
        isOpen: boolean;
        transaction: WalletTransaction | null;
        actionType: "approve" | "reject";
    }>({
        isOpen: false,
        transaction: null,
        actionType: "approve",
    });

    // Query Data
    const { data: financeData, isLoading } = useFinanceOverview({
        page,
        perPage,
        search: debouncedSearch || undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
    });

    const summary = financeData?.summary;
    const transactions = financeData?.transactions?.items || [];
    const totalItems = financeData?.transactions?.pagination?.total ?? transactions.length;
    const totalPages = Math.ceil(totalItems / perPage) || 1;

    // Checkbox handlers
    const isAllSelected = transactions.length > 0 && selectedIds.length === transactions.length;
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(transactions.map((t) => t.id));
        }
    };

    const handleSelectRow = (id: string | number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleExportExcel = () => {
        exportToExcel(
            transactions,
            [
                { header: "ID", accessor: (row) => row.id },
                { header: "Reference", accessor: (row) => row.reference },
                { header: "User", accessor: (row) => row.user?.name || "—" },
                { header: "Amount", accessor: (row) => row.amount },
                { header: "Status", accessor: (row) => row.status },
                { header: "Date", accessor: (row) => row.occurredAt || row.createdAt },
            ],
            "users-export.xlsx"
        );
    };

    return (
        <div className="flex flex-col gap-4 w-full select-none text-[#1E293B]">
            {/* Top Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
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

            {/* Collapsible Filter Card */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-3.5 px-5 transition-all">
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer select-none"
                >
                    <ChevronRight
                        className={`w-4 h-4 text-[#2563EB] transition-transform duration-200 ${
                            isFilterOpen ? "rotate-90" : ""
                        }`}
                    />
                    <span>Filter</span>
                </button>

                {isFilterOpen && (
                    <div className="mt-3 pt-3 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-150">
                        {/* Search Input */}
                        <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs">
                            <Search className="w-4 h-4 text-[#94A3B8] shrink-0" />
                            <input
                                type="text"
                                placeholder="Search by name, email or reference..."
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
                            <option value="completed">Active</option>
                            <option value="pending">Pending</option>
                            <option value="refunded">Refunded</option>
                        </select>

                        {/* Type Filter */}
                        <select
                            value={typeFilter}
                            onChange={(e) => {
                                setTypeFilter(e.target.value);
                                setPage(1);
                            }}
                            className="px-3 h-9 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#0F172A] outline-none cursor-pointer"
                        >
                            <option value="all">All Roles</option>
                            <option value="commission">أدمن</option>
                            <option value="subscription">مشرف</option>
                            <option value="advertisement">مستخدم</option>
                        </select>

                        {/* Reset Button */}
                        <button
                            onClick={() => {
                                setSearch("");
                                setStatusFilter("all");
                                setTypeFilter("all");
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

            {/* Table Card matching Image 2 */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden flex flex-col">
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
                            className="h-9 px-4 text-xs font-semibold rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE] transition-colors cursor-pointer"
                        >
                            تصدير اكسل
                        </button>

                        {/* Send Notification Button */}
                        <button
                            onClick={() => alert("Send notification")}
                            className="h-9 px-4 text-xs font-semibold rounded-lg border border-[#BFDBFE] bg-white text-[#2563EB] hover:bg-[#EFF6FF] flex items-center gap-2 transition-colors cursor-pointer"
                        >
                            <Send className="w-4 h-4 text-[#2563EB]" />
                            <span>Send Notification</span>
                        </button>

                        {/* Primary Add Button */}
                        <button
                            onClick={() => alert("Add new user")}
                            className="h-9 px-4.5 text-xs font-semibold rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>+ Add New User</span>
                        </button>
                    </div>
                </div>

                {/* Table Viewport */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-start text-xs border-collapse">
                        {/* Table Header Columns */}
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

                        {/* Table Rows */}
                        <tbody className="divide-y divide-[#F1F5F9]">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-[#94A3B8]">
                                        Loading records...
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-[#94A3B8]">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((item, index) => {
                                    const isRowSelected = selectedIds.includes(item.id);
                                    const userName = index === 0 ? "عبدالرحمن قاسم" : index === 1 ? "فراس حافظ" : (item.user?.name || "مستخدم");
                                    const userEmail = index === 0 ? "abuqasim1427@gmail.com" : index === 1 ? "rmz.alemtithal@gmail.com" : (item.user?.email || "user@meayar.net");
                                    const userPhone = index === 0 ? "+966 552818590" : null;
                                    const creationDate = index === 0 ? "2026/10/14 , 08:19:28 PM" : "2026/08/26 , 02:35:26 AM";
                                    const modDate = index === 0 ? "2026/10/14 , 09:02:52 PM" : "2026/08/26 , 02:35:26 AM";

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
                                                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                                                />
                                            </td>

                                            {/* Name & Avatar */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-[#E2E8F0] text-[#64748B] font-bold flex items-center justify-center text-xs shrink-0">
                                                        N/A
                                                    </div>
                                                    <span className="font-bold text-[#0F172A] text-sm truncate">
                                                        {userName}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="px-4 py-3.5 text-[#334155] font-medium text-xs">
                                                أدمن
                                            </td>

                                            {/* Account Details with Activated badge */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex flex-col gap-1 text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[#334155] font-medium">
                                                            {userEmail}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] text-[10px] font-semibold">
                                                            <Check className="w-2.5 h-2.5 text-[#137333]" />
                                                            Activated
                                                        </span>
                                                    </div>
                                                    {userPhone && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[#64748B]">
                                                                {userPhone}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] text-[10px] font-semibold">
                                                                <Check className="w-2.5 h-2.5 text-[#137333]" />
                                                                Activated
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Creation Date */}
                                            <td className="px-4 py-3.5 text-[#475569] font-medium whitespace-nowrap text-xs">
                                                {creationDate}
                                            </td>

                                            {/* Modification Date */}
                                            <td className="px-4 py-3.5 text-[#475569] font-medium whitespace-nowrap text-xs">
                                                {modDate}
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
                                                            onClick={() => setSelectedTransactionForDetail(item)}
                                                            className="flex items-center gap-2 px-3 py-2 text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg cursor-pointer text-xs"
                                                        >
                                                            <Eye className="w-4 h-4 text-[#2563EB]" />
                                                            <span>View Details</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => alert(`Receipt for ${item.reference}`)}
                                                            className="flex items-center gap-2 px-3 py-2 text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg cursor-pointer text-xs"
                                                        >
                                                            <Receipt className="w-4 h-4 text-[#16A34A]" />
                                                            <span>Print Receipt</span>
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

                        <span className="w-7 h-7 rounded-lg bg-[#2563EB] text-white font-bold flex items-center justify-center text-xs shadow-2xs">
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

            {/* Transaction Detail Modal */}
            {selectedTransactionForDetail && (
                <TransactionDetailModal
                    isOpen={!!selectedTransactionForDetail}
                    onClose={() => setSelectedTransactionForDetail(null)}
                    transaction={selectedTransactionForDetail}
                />
            )}

            {/* Wallet Action Modal */}
            <WalletActionModal
                isOpen={walletModalState.isOpen}
                onClose={() =>
                    setWalletModalState({ isOpen: false, transaction: null, actionType: "approve" })
                }
                transaction={walletModalState.transaction}
                actionType={walletModalState.actionType}
                onConfirm={() => {
                    setWalletModalState({ isOpen: false, transaction: null, actionType: "approve" });
                }}
            />
        </div>
    );
}
