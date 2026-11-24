import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/design-system/components/dialog";
import type { CompanyClassification, CompanyClassificationCreatePayload } from "../types";
import {
    useCreateCompanyClassifications,
    useUpdateCompanyClassifications,
} from "../api";
import { toast } from "sonner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    classification: CompanyClassification | null;
}

export const ClassificationModal: React.FC<Props> = ({
    isOpen,
    onClose,
    classification,
}) => {
    const isEditing = Boolean(classification);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const createMutation = useCreateCompanyClassifications();
    const updateMutation = useUpdateCompanyClassifications();

    useEffect(() => {
        if (classification) {
            setName(classification.name || "");
            setDescription(classification.description || "");
        } else {
            setName("");
            setDescription("");
        }
    }, [classification, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Name is required");
            return;
        }

        const payload: CompanyClassificationCreatePayload = {
            name: name.trim(),
            description: description.trim() || undefined,
        };

        if (isEditing && classification) {
            updateMutation.mutate(
                { id: classification.id, data: payload },
                {
                    onSuccess: () => {
                        toast.success("Classification updated successfully");
                        onClose();
                    },
                    onError: () => {
                        toast.error("Failed to update classification");
                    },
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Classification created successfully");
                    onClose();
                },
                onError: () => {
                    toast.error("Failed to create classification");
                },
            });
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl w-[92vw] bg-white p-0 rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden select-none">
                {/* Header */}
                <DialogHeader className="px-6 py-4 border-b border-[#F1F5F9] flex flex-row items-center justify-between">
                    <DialogTitle className="text-base font-bold text-[#0F172A]">
                        {isEditing ? "Edit Classification" : "Add Classification"}
                    </DialogTitle>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors flex items-center justify-center cursor-pointer"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </DialogHeader>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Name Card */}
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            className="w-full bg-transparent outline-none text-xs font-semibold text-[#0F172A] placeholder-[#94A3B8]"
                        />
                    </div>

                    {/* Description Card */}
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3">
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            className="w-full bg-transparent outline-none text-xs font-semibold text-[#0F172A] placeholder-[#94A3B8]"
                        />
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-end">
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
