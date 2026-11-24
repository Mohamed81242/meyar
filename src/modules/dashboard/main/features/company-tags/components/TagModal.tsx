import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/design-system/components/dialog";
import { useCreateCompanyTag, useUpdateCompanyTag } from "../api";
import type { CompanyTag } from "../types";
import { toast } from "sonner";
import { useLanguage } from "@/shared/hooks";

interface TagModalProps {
    isOpen: boolean;
    onClose: () => void;
    tag?: CompanyTag | null;
}

export const TagModal: React.FC<TagModalProps> = ({ isOpen, onClose, tag }) => {
    const { t } = useLanguage("company-tags");
    const [name, setName] = useState("");

    const createMutation = useCreateCompanyTag();
    const updateMutation = useUpdateCompanyTag();

    const isEditing = Boolean(tag);

    useEffect(() => {
        if (tag) {
            setName(tag.name || "");
        } else {
            setName("");
        }
    }, [tag, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            toast.error(t("nameRequired", "Name is required"));
            return;
        }

        if (isEditing && tag) {
            updateMutation.mutate(
                { id: tag.id, data: { name: trimmed } },
                {
                    onSuccess: () => {
                        toast.success(t("tagUpdated", "Tag updated successfully"));
                        onClose();
                    },
                    onError: () => {
                        toast.error(t("failedToUpdate", "Failed to update tag"));
                    },
                }
            );
        } else {
            createMutation.mutate(
                { name: trimmed },
                {
                    onSuccess: () => {
                        toast.success(t("tagCreated", "Tag created successfully"));
                        setName("");
                        onClose();
                    },
                    onError: () => {
                        toast.error(t("failedToCreate", "Failed to create tag"));
                    },
                }
            );
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl bg-white dark:bg-dashboard-card p-0 rounded-2xl border border-dashboard-border shadow-2xl overflow-hidden">
                {/* Header matching Screenshot 2 */}
                <div className="flex items-center justify-between p-4 px-6 border-b border-[#F1F5F9] dark:border-dashboard-border">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-lg hover:bg-dashboard-secondary transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <DialogTitle className="text-sm font-semibold text-[#0F172A] dark:text-dashboard-foreground">
                        {isEditing ? t("editTag", "Edit tag") : t("addType", "Add type")}
                    </DialogTitle>
                </div>

                {/* Form Body matching Screenshot 2 */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                    {/* Input card with Name label & placeholder */}
                    <div className="bg-[#F8FAFC] dark:bg-dashboard-background border border-[#E2E8F0] dark:border-dashboard-border rounded-xl p-3 px-4 focus-within:border-dashboard-primary transition-colors">
                        <label
                            htmlFor="tag-name-input"
                            className="block text-[11px] font-medium text-[#94A3B8] mb-1"
                        >
                            {t("name", "Name")}
                        </label>
                        <input
                            id="tag-name-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t("name", "Name")}
                            className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground font-medium placeholder:text-[#94A3B8]"
                            autoFocus
                        />
                    </div>

                    {/* Footer: Right-aligned Blue Add Button matching Screenshot 2 */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-9 px-6 text-xs font-semibold rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting
                                ? t("saving", "Saving...")
                                : isEditing
                                ? t("save", "Save")
                                : t("add", "Add")}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
