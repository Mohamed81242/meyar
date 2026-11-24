import React, { useState, useEffect, useMemo } from "react";
import { X, Search } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/design-system/components/dialog";
import {
    AVAILABLE_PERMISSIONS_CATALOG,
    type Role,
} from "../types";
import {
    useCreateRolesAndPermissions,
    useUpdateRolesAndPermissions,
} from "../api";
import { toast } from "sonner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    role: Role | null;
}

export const RoleModal: React.FC<Props> = ({ isOpen, onClose, role }) => {
    const isEditing = Boolean(role);
    const [name, setName] = useState("");
    const [isFinalEvaluator, setIsFinalEvaluator] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const createMutation = useCreateRolesAndPermissions();
    const updateMutation = useUpdateRolesAndPermissions();

    // Populate or reset state on open/role change
    useEffect(() => {
        if (role) {
            setName(role.name || "");
            setIsFinalEvaluator(Boolean(role.isFinalEvaluator));
            setSelectedPermissions(role.permissions || []);
        } else {
            setName("");
            setIsFinalEvaluator(false);
            setSelectedPermissions([]);
        }
        setSearchQuery("");
    }, [role, isOpen]);

    // Filter catalog based on search
    const filteredCatalog = useMemo(() => {
        if (!searchQuery.trim()) return AVAILABLE_PERMISSIONS_CATALOG;
        const query = searchQuery.toLowerCase();
        return AVAILABLE_PERMISSIONS_CATALOG.map((group) => {
            const matchesGroup = group.label.toLowerCase().includes(query);
            const matchingPermissions = group.permissions.filter((p) =>
                p.label.toLowerCase().includes(query)
            );
            if (matchesGroup) return group;
            return {
                ...group,
                permissions: matchingPermissions,
            };
        }).filter((group) => group.permissions.length > 0);
    }, [searchQuery]);

    // Handle individual permission checkbox toggle
    const handleTogglePermission = (id: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Handle group toggle (all or none in group)
    const handleToggleGroup = (groupId: string) => {
        const group = AVAILABLE_PERMISSIONS_CATALOG.find((g) => g.id === groupId);
        if (!group) return;

        const groupPermissionIds = group.permissions.map((p) => p.id);
        const allSelected = groupPermissionIds.every((id) =>
            selectedPermissions.includes(id)
        );

        if (allSelected) {
            // Uncheck all in group
            setSelectedPermissions((prev) =>
                prev.filter((id) => !groupPermissionIds.includes(id))
            );
        } else {
            // Check all in group
            setSelectedPermissions((prev) => [
                ...prev,
                ...groupPermissionIds.filter((id) => !prev.includes(id)),
            ]);
        }
    };

    // Form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Name is required");
            return;
        }

        const payload = {
            name: name.trim(),
            isFinalEvaluator,
            permissions: selectedPermissions,
        };

        if (isEditing && role) {
            updateMutation.mutate(
                { id: role.id, data: payload },
                {
                    onSuccess: () => {
                        toast.success("Role updated successfully");
                        onClose();
                    },
                    onError: () => {
                        toast.error("Failed to update role");
                    },
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Role created successfully");
                    onClose();
                },
                onError: () => {
                    toast.error("Failed to create role");
                },
            });
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-[92vw] bg-white dark:bg-dashboard-card p-0 rounded-2xl border border-dashboard-border shadow-2xl overflow-hidden select-none">
                {/* Modal Header */}
                <DialogHeader className="px-6 py-4 border-b border-[#F1F5F9] flex flex-row items-center justify-between">
                    <DialogTitle className="text-base font-bold text-[#0F172A]">
                        {isEditing ? "Edit Role" : "Add Role"}
                    </DialogTitle>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors flex items-center justify-center cursor-pointer"
                        aria-label="إغلاق"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </DialogHeader>

                {/* Modal Body: 2 Columns */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
                        {/* Left Column (Inputs & Options) */}
                        <div className="md:col-span-4 p-6 border-b md:border-b-0 md:border-r border-[#F1F5F9] space-y-5 bg-[#FAFAFA]/50">
                            {/* Name Input Card */}
                            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 space-y-1">
                                <label className="text-[11px] font-semibold text-[#64748B] block">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Name"
                                    className="w-full bg-transparent outline-none text-xs font-semibold text-[#0F172A] placeholder-[#94A3B8]"
                                />
                            </div>

                            {/* Final Evaluator Option */}
                            <div className="flex items-start gap-2.5 pt-2">
                                <input
                                    type="checkbox"
                                    id="final-evaluator-checkbox"
                                    checked={isFinalEvaluator}
                                    onChange={(e) => setIsFinalEvaluator(e.target.checked)}
                                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer mt-0.5"
                                />
                                <div className="space-y-1">
                                    <label
                                        htmlFor="final-evaluator-checkbox"
                                        className="text-xs font-bold text-[#0F172A] cursor-pointer block"
                                    >
                                        مقيم نهائي
                                    </label>
                                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                                        علّم هنا اذا كان هذا الدور هو للمقيم النهائي فقط، يستخدم في البحث لاحقاً
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column (Permissions Tree Selection) */}
                        <div className="md:col-span-8 p-6 flex flex-col space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-[#0F172A]">
                                    Select Permissions
                                </h3>
                                <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                                    The permissions set here apply globally. For permissions specific to certain items, please go to the permissions management in the internal pages (templates, tasks, actions, reports).
                                </p>
                            </div>

                            {/* Search Box */}
                            <div className="relative">
                                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search permissions"
                                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-white outline-none text-[#0F172A] placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                                />
                            </div>

                            {/* Permissions Scrollable List */}
                            <div className="flex-1 max-h-[340px] overflow-y-auto pr-2 space-y-4 divide-y divide-[#F8FAFC]">
                                {filteredCatalog.map((group) => {
                                    const groupPermissionIds = group.permissions.map((p) => p.id);
                                    const allChecked =
                                        groupPermissionIds.length > 0 &&
                                        groupPermissionIds.every((id) =>
                                            selectedPermissions.includes(id)
                                        );

                                    return (
                                        <div key={group.id} className="pt-3 first:pt-0 space-y-2">
                                            {/* Group Checkbox & Header */}
                                            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-[#2563EB]">
                                                <input
                                                    type="checkbox"
                                                    checked={allChecked}
                                                    onChange={() => handleToggleGroup(group.id)}
                                                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                                                />
                                                <span>{group.label}</span>
                                            </label>

                                            {/* Child Checkboxes */}
                                            <div className="flex flex-wrap gap-x-5 gap-y-2.5 pl-6">
                                                {group.permissions.map((perm) => (
                                                    <label
                                                        key={perm.id}
                                                        className="flex items-center gap-2 cursor-pointer text-xs text-[#334155] hover:text-[#0F172A] transition-colors"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedPermissions.includes(
                                                                perm.id
                                                            )}
                                                            onChange={() =>
                                                                handleTogglePermission(perm.id)
                                                            }
                                                            className="w-3.5 h-3.5 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                                                        />
                                                        <span>{perm.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}

                                {filteredCatalog.length === 0 && (
                                    <div className="text-center py-8 text-xs text-[#94A3B8]">
                                        No permissions match your search query.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 py-3.5 border-t border-[#F1F5F9] bg-[#FAFAFA]/70 flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                            {isSubmitting
                                ? "Saving..."
                                : isEditing
                                ? "Edit"
                                : "Add"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
