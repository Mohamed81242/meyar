import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/design-system/components/dialog";
import {
    useCreateFoldersOrClassification,
    useUpdateFoldersOrClassification,
    AVAILABLE_TEMPLATES,
} from "../api";
import type { TemplateFolder } from "../types";
import { toast } from "sonner";
import { useLanguage } from "@/shared/hooks";

interface FolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    folder?: TemplateFolder | null;
}

export const FolderModal: React.FC<FolderModalProps> = ({
    isOpen,
    onClose,
    folder,
}) => {
    const { t } = useLanguage("folders-or-classifications");
    const [name, setName] = useState("");
    const [searchTemplate, setSearchTemplate] = useState("");
    const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);

    const createMutation = useCreateFoldersOrClassification();
    const updateMutation = useUpdateFoldersOrClassification();

    const isEditing = Boolean(folder);

    useEffect(() => {
        if (folder) {
            setName(folder.name || "");
            setSelectedTemplateIds(folder.selectedTemplateIds || []);
        } else {
            setName("");
            setSelectedTemplateIds([]);
        }
        setSearchTemplate("");
    }, [folder, isOpen]);

    const filteredTemplates = AVAILABLE_TEMPLATES.filter((template) =>
        template.name.toLowerCase().includes(searchTemplate.toLowerCase())
    );

    const isAllSelected =
        filteredTemplates.length > 0 &&
        filteredTemplates.every((item) => selectedTemplateIds.includes(item.id));

    const handleToggleAll = () => {
        if (isAllSelected) {
            const filteredIds = filteredTemplates.map((t) => t.id);
            setSelectedTemplateIds((prev) =>
                prev.filter((id) => !filteredIds.includes(id))
            );
        } else {
            const newIds = new Set([
                ...selectedTemplateIds,
                ...filteredTemplates.map((t) => t.id),
            ]);
            setSelectedTemplateIds(Array.from(newIds));
        }
    };

    const handleToggleTemplate = (templateId: string) => {
        setSelectedTemplateIds((prev) =>
            prev.includes(templateId)
                ? prev.filter((id) => id !== templateId)
                : [...prev, templateId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            toast.error(t("nameRequired", "Name is required"));
            return;
        }

        if (isEditing && folder) {
            updateMutation.mutate(
                {
                    id: folder.id,
                    data: {
                        name: trimmed,
                        selectedTemplateIds,
                    },
                },
                {
                    onSuccess: () => {
                        toast.success(t("folderUpdated", "Folder updated successfully"));
                        onClose();
                    },
                    onError: () => {
                        toast.error(t("failedToUpdate", "Failed to update folder"));
                    },
                }
            );
        } else {
            createMutation.mutate(
                {
                    name: trimmed,
                    selectedTemplateIds,
                },
                {
                    onSuccess: () => {
                        toast.success(t("folderCreated", "Folder created successfully"));
                        onClose();
                    },
                    onError: () => {
                        toast.error(t("failedToCreate", "Failed to create folder"));
                    },
                }
            );
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl bg-white dark:bg-dashboard-card p-0 rounded-2xl border border-dashboard-border shadow-2xl overflow-hidden">
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
                        {isEditing
                            ? t("editFolder", "Edit Template Folder")
                            : t("addFolder", "Add Template Folder")}
                    </DialogTitle>
                </div>

                {/* Form Body matching Screenshot 2: 2-Column Layout */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        {/* Left Column (col-span-4): Name Card matching Screenshot 2 */}
                        <div className="md:col-span-4 bg-[#F8FAFC] dark:bg-dashboard-background border border-[#E2E8F0] dark:border-dashboard-border rounded-xl p-3 px-4 focus-within:border-dashboard-primary transition-colors">
                            <label
                                htmlFor="folder-name-input"
                                className="block text-[11px] font-medium text-[#94A3B8] mb-1"
                            >
                                {t("name", "Name")}
                            </label>
                            <input
                                id="folder-name-input"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t("name", "Name")}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground font-medium placeholder:text-[#94A3B8]"
                                autoFocus
                            />
                        </div>

                        {/* Right Column (col-span-8): Select Templates Card matching Screenshot 2 */}
                        <div className="md:col-span-8 bg-white dark:bg-dashboard-card border border-[#E2E8F0] dark:border-dashboard-border rounded-xl p-4 flex flex-col gap-4">
                            <h3 className="text-xs font-bold text-[#0F172A] dark:text-dashboard-foreground">
                                {t("selectTemplates", "Select Templates")}
                            </h3>

                            {/* Search bar matching Screenshot 2 */}
                            <div className="flex items-center gap-2.5 px-3 h-10 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-white dark:bg-dashboard-background text-xs text-[#94A3B8] focus-within:border-dashboard-primary transition-colors">
                                <Search className="w-4 h-4 text-[#94A3B8] shrink-0" />
                                <input
                                    type="text"
                                    value={searchTemplate}
                                    onChange={(e) => setSearchTemplate(e.target.value)}
                                    placeholder={t("searchTemplate", "Search Template")}
                                    className="bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground placeholder:text-[#94A3B8] flex-1 w-full"
                                />
                            </div>

                            {/* Select All Checkbox */}
                            <label className="flex items-center gap-2.5 text-xs font-semibold text-[#0F172A] dark:text-dashboard-foreground cursor-pointer pt-1">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={handleToggleAll}
                                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                                />
                                <span>{t("selectAllTemplates", "Select All templates")}</span>
                            </label>

                            {/* Template Checkbox List */}
                            <div className="flex flex-col gap-2.5 max-h-52 overflow-y-auto pr-1">
                                {filteredTemplates.map((template) => {
                                    const isChecked = selectedTemplateIds.includes(template.id);
                                    return (
                                        <label
                                            key={template.id}
                                            className="flex items-center gap-2.5 text-xs font-medium text-[#334155] dark:text-dashboard-muted-foreground hover:text-[#0F172A] cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleToggleTemplate(template.id)}
                                                className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                                            />
                                            <span>{template.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
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
