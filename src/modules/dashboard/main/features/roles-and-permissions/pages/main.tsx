import React, { useState } from "react";
import { useLanguage } from "@/shared/hooks";
import { ChevronRight, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useRolesAndPermissionssList } from "../api";
import { RoleModal, DeleteRoleModal } from "../components";
import type { Role } from "../types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/design-system/components/dropdown-menu";

export default function RolesAndPermissionsPage() {
    const { t } = useLanguage("roles-and-permissions");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [deletingRole, setDeletingRole] = useState<Role | null>(null);

    // Selected rows
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Query data
    const { data, isLoading } = useRolesAndPermissionssList();
    const roles: Role[] = (data as any)?.items || [];

    // Checkbox selection
    const isAllSelected = roles.length > 0 && selectedIds.length === roles.length;
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(roles.map((r) => r.id));
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleOpenCreate = () => {
        setEditingRole(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (role: Role) => {
        setEditingRole(role);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 pb-12 select-none">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-dashboard-muted-foreground">
                <span>{t("main.home", "Home")}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#334155] dark:text-dashboard-foreground font-semibold">
                    {t("main.title", "Roles and Permissions")}
                </span>
            </div>

            {/* Page Title & Add Button */}
            <div className="space-y-4">
                <h1 className="text-2xl font-bold text-[#0F172A] dark:text-dashboard-foreground tracking-tight">
                    {t("main.title", "Roles and Permissions")}
                </h1>

                <div>
                    <button
                        onClick={handleOpenCreate}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-dashboard-primary hover:opacity-90 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                        aria-label="Add New Permission"
                    >
                        <span>{t("main.addNew", "+ Add New Permission")}</span>
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="dashboard-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-start border-collapse">
                        <thead>
                            <tr className="border-b border-[#F1F5F9] dark:border-dashboard-border bg-[#F8FAFC]/50 dark:bg-dashboard-secondary/30 text-[11px] font-bold text-[#64748B] dark:text-dashboard-muted-foreground uppercase tracking-wider">
                                <th className="py-4 px-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-[#CBD5E1] text-dashboard-primary focus:ring-dashboard-primary/20 cursor-pointer"
                                        aria-label="Select all roles"
                                    />
                                </th>
                                <th className="py-4 px-6 text-start font-bold">
                                    {t("table.name", "NAME")}
                                </th>
                                <th className="py-4 px-6 text-start font-bold">
                                    {t("table.numberOfUsers", "NUMBER OF USERS")}
                                </th>
                                <th className="py-4 px-6 text-end font-bold w-24">
                                    {t("table.action", "ACTION")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9] dark:divide-dashboard-border text-xs">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-[#94A3B8]">
                                        {t("main.loading", "Loading...")}
                                    </td>
                                </tr>
                            ) : roles.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-[#94A3B8]">
                                        {t("main.noData", "No roles found")}
                                    </td>
                                </tr>
                            ) : (
                                roles.map((role) => {
                                    const isSelected = selectedIds.includes(role.id);
                                    return (
                                        <tr
                                            key={role.id}
                                            className={`hover:bg-[#F8FAFC] dark:hover:bg-dashboard-secondary/40 transition-colors ${
                                                isSelected ? "bg-[#EFF6FF]/40 dark:bg-dashboard-secondary/60" : ""
                                            }`}
                                        >
                                            <td className="py-4 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectRow(role.id)}
                                                    className="w-4 h-4 rounded border-[#CBD5E1] text-dashboard-primary focus:ring-dashboard-primary/20 cursor-pointer"
                                                    aria-label={`Select ${role.name}`}
                                                />
                                            </td>
                                            <td className="py-4 px-6 font-bold text-sm text-[#0F172A] dark:text-dashboard-foreground text-start">
                                                {role.name}
                                            </td>
                                            <td className="py-4 px-6 font-medium text-xs text-[#334155] dark:text-dashboard-muted-foreground text-start">
                                                {role.numberOfUsers}
                                            </td>
                                            <td className="py-4 px-6 text-end">
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            className="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-dashboard-foreground hover:bg-[#F1F5F9] dark:hover:bg-dashboard-secondary transition-colors flex items-center justify-center cursor-pointer outline-none"
                                                            aria-label="Actions"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-32 bg-white dark:bg-dashboard-card shadow-lg border border-[#E2E8F0] dark:border-dashboard-border rounded-xl p-1 text-xs z-50">
                                                            <DropdownMenuItem
                                                                onClick={() => handleOpenEdit(role)}
                                                                className="flex items-center gap-2 px-3 py-2 text-[#334155] dark:text-dashboard-foreground hover:bg-[#F1F5F9] dark:hover:bg-dashboard-secondary rounded-lg cursor-pointer transition-colors"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5 text-[#64748B] dark:text-dashboard-muted-foreground" />
                                                                <span>{t("actions.edit", "Edit")}</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setDeletingRole(role)}
                                                                className="flex items-center gap-2 px-3 py-2 text-[#DC2626] hover:bg-[#FEF2F2] dark:hover:bg-rose-950/30 rounded-lg cursor-pointer transition-colors"
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

            {/* Create / Edit Role Modal */}
            <RoleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                role={editingRole}
            />

            {/* Delete Confirmation Modal */}
            <DeleteRoleModal
                isOpen={Boolean(deletingRole)}
                onClose={() => setDeletingRole(null)}
                role={deletingRole}
            />
        </div>
    );
}
