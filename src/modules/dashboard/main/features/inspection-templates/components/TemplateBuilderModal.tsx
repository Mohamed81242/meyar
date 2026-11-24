import React, { useState, useEffect } from "react";
import {
    X,
    Eye,
    Check,
    Smartphone,
    FileText,
    Image as ImageIcon,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/design-system/components/dialog";
import {
    useCreateInspectionTemplate,
    useUpdateInspectionTemplate,
} from "../api";
import type { InspectionTemplate, EvaluationType } from "../types";
import { toast } from "sonner";
import { useLanguage } from "@/shared/hooks";

interface TemplateBuilderModalProps {
    isOpen: boolean;
    onClose: () => void;
    template?: InspectionTemplate | null;
}

export const TemplateBuilderModal: React.FC<TemplateBuilderModalProps> = ({
    isOpen,
    onClose,
    template,
}) => {
    const { t } = useLanguage("inspection-templates");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [formType, setFormType] = useState("standard");
    const [evaluationType, setEvaluationType] = useState<EvaluationType>("compliance");
    const [successPercentage, setSuccessPercentage] = useState(100);
    const [showPreview, setShowPreview] = useState(true);

    const createMutation = useCreateInspectionTemplate();
    const updateMutation = useUpdateInspectionTemplate();

    const isEditing = Boolean(template);

    useEffect(() => {
        if (template) {
            setTitle(template.title || "");
            setDescription(template.description || "");
            setFormType(template.formType || "standard");
            setEvaluationType(template.evaluationType || "compliance");
            setSuccessPercentage(template.successPercentage ?? 100);
        } else {
            setTitle("");
            setDescription("");
            setFormType("standard");
            setEvaluationType("compliance");
            setSuccessPercentage(100);
        }
    }, [template, isOpen]);

    const handleSave = (publish: boolean) => {
        const trimmed = title.trim();
        if (!trimmed) {
            toast.error(t("titleRequired", "Title is required"));
            return;
        }

        const payload = {
            title: trimmed,
            description: description.trim() || undefined,
            status: (publish ? "published" : "unpublished") as "published" | "unpublished",
            evaluationType,
            successPercentage,
            formType,
        };

        if (isEditing && template) {
            updateMutation.mutate(
                { id: template.id, data: payload },
                {
                    onSuccess: () => {
                        toast.success(
                            publish
                                ? t("templatePublished", "Template published successfully")
                                : t("templateSaved", "Template saved successfully")
                        );
                        onClose();
                    },
                    onError: () => {
                        toast.error(t("failedToSave", "Failed to save template"));
                    },
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success(
                        publish
                            ? t("templatePublished", "Template published successfully")
                            : t("templateCreated", "Template created successfully")
                    );
                    onClose();
                },
                onError: () => {
                    toast.error(t("failedToCreate", "Failed to create template"));
                },
            });
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl w-full bg-white dark:bg-dashboard-card p-0 rounded-3xl border border-dashboard-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Top Action Bar matching Screenshot 3 */}
                <div className="flex items-center justify-between p-4 px-6 border-b border-[#F1F5F9] dark:border-dashboard-border shrink-0">
                    {/* Left: Eye Preview + Unpublish Changes Saved + Checkmark + Publish */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-dashboard-secondary transition-colors cursor-pointer"
                            aria-label="Preview"
                        >
                            <Eye className="w-4 h-4" />
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSave(false)}
                            disabled={isSubmitting}
                            className="h-8.5 px-4 text-xs font-semibold rounded-lg border border-[#E2E8F0] dark:border-dashboard-border bg-[#F8FAFC] dark:bg-dashboard-background text-[#334155] dark:text-dashboard-foreground hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                        >
                            {t("unpublishChangesSaved", "Unpublish Changes Saved")}
                        </button>

                        <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-3" />
                        </div>

                        <button
                            type="button"
                            onClick={() => handleSave(true)}
                            disabled={isSubmitting}
                            className="h-8.5 px-5 text-xs font-semibold rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {t("publish", "Publish")}
                        </button>
                    </div>

                    {/* Right: Hide View Preview toggle + Close X */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className="h-8.5 px-3.5 text-xs font-semibold rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>
                                {showPreview
                                    ? t("hideViewPreview", "Hide View Preview")
                                    : t("showViewPreview", "Show View Preview")}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="text-[#94A3B8] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-dashboard-secondary transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main Body: Form on Left + Live Mobile Device Preview on Right matching Screenshot 3 */}
                <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Form Area (col-span-7 or 12) */}
                    <div className={`${showPreview ? "lg:col-span-7" : "lg:col-span-12"} flex flex-col gap-5`}>
                        <DialogTitle className="sr-only">
                            {isEditing ? t("editTemplate", "Edit Template") : t("newTemplate", "New Template")}
                        </DialogTitle>

                        {/* Title Input Card */}
                        <div className="bg-[#F8FAFC] dark:bg-dashboard-background border border-[#E2E8F0] dark:border-dashboard-border rounded-xl p-3 px-4 focus-within:border-dashboard-primary transition-colors">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={t("newTemplate", "New Template")}
                                className="w-full bg-transparent border-none outline-none text-sm font-bold text-[#0F172A] dark:text-dashboard-foreground placeholder:text-[#94A3B8]"
                            />
                        </div>

                        {/* Description Input Card */}
                        <div className="bg-[#F8FAFC] dark:bg-dashboard-background border border-[#E2E8F0] dark:border-dashboard-border rounded-xl p-3 px-4 focus-within:border-dashboard-primary transition-colors">
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={t("enterFormDescription", "Enter form description")}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground placeholder:text-[#94A3B8]"
                            />
                        </div>

                        {/* Form Type Dropdown */}
                        <div className="bg-[#F8FAFC] dark:bg-dashboard-background border border-[#E2E8F0] dark:border-dashboard-border rounded-xl p-3 px-4 focus-within:border-dashboard-primary transition-colors">
                            <select
                                value={formType}
                                onChange={(e) => setFormType(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xs text-[#0F172A] dark:text-dashboard-foreground cursor-pointer"
                            >
                                <option value="standard">{t("formTypeStandard", "Form Type: Standard")}</option>
                                <option value="inspection">{t("formTypeInspection", "Inspection Form")}</option>
                                <option value="audit">{t("formTypeAudit", "Audit Checklist")}</option>
                            </select>
                        </div>

                        {/* Image Box + Add Page Button */}
                        <div className="flex flex-col gap-3">
                            <div className="w-36 h-36 rounded-2xl border-2 border-dashed border-[#CBD5E1] dark:border-dashboard-border flex flex-col items-center justify-center relative bg-white dark:bg-dashboard-background cursor-pointer hover:border-dashboard-primary transition-colors group">
                                <ImageIcon className="w-10 h-10 text-[#38BDF8] group-hover:scale-105 transition-transform" />
                                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-xs shadow-md">
                                    +
                                </div>
                            </div>

                            <div>
                                <button
                                    type="button"
                                    onClick={() => toast.info(t("pageAdded", "Page added"))}
                                    className="h-8.5 px-4 text-xs font-semibold rounded-lg border border-[#CBD5E1] dark:border-dashboard-border bg-white dark:bg-dashboard-card text-[#334155] dark:text-dashboard-foreground hover:bg-[#F8FAFC] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                                >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>{t("addPage", "Add Page")}</span>
                                </button>
                            </div>
                        </div>

                        {/* Evaluation Type Tabs */}
                        <div className="flex flex-col gap-2 pt-2">
                            <span className="text-xs font-bold text-[#0F172A] dark:text-dashboard-foreground">
                                {t("evaluationType", "Evaluation type:")}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEvaluationType("compliance")}
                                    className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                                        evaluationType === "compliance"
                                            ? "border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]"
                                            : "border-[#E2E8F0] dark:border-dashboard-border text-[#64748B] hover:bg-[#F8FAFC]"
                                    }`}
                                >
                                    {t("complianceAndInspection", "Compliance And Inspection")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEvaluationType("quality")}
                                    className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                                        evaluationType === "quality"
                                            ? "border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]"
                                            : "border-[#E2E8F0] dark:border-dashboard-border text-[#64748B] hover:bg-[#F8FAFC]"
                                    }`}
                                >
                                    {t("qualityAndMeasurement", "Quality And Measurement")}
                                </button>
                            </div>
                            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                                {t(
                                    "evaluationTypeHelp",
                                    "Each task's result is compared with the pass percentage, so it shows as compliant or not."
                                )}
                            </p>
                        </div>

                        {/* Success Percentage % Card */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-bold text-[#0F172A] dark:text-dashboard-foreground">
                                {t("successPercentage", "Success Percentage%")}
                            </span>
                            <div className="w-48 bg-[#F8FAFC] dark:bg-dashboard-background border border-[#E2E8F0] dark:border-dashboard-border rounded-xl p-2.5 px-3 focus-within:border-dashboard-primary transition-colors">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={successPercentage}
                                    onChange={(e) => setSuccessPercentage(Number(e.target.value))}
                                    className="w-full bg-transparent border-none outline-none text-xs font-bold text-[#0F172A] dark:text-dashboard-foreground"
                                />
                            </div>
                            <span className="text-[10px] text-[#94A3B8]">
                                {t(
                                    "maxScoreNote",
                                    "Max Score: (need 0.00 deg toPassInspection)"
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Right Live Mobile Phone Preview Frame (col-span-5) matching Screenshot 3 */}
                    {showPreview && (
                        <div className="lg:col-span-5 flex justify-center py-4">
                            <div className="w-72 sm:w-80 h-[520px] rounded-[2.5rem] border-[6px] border-black dark:border-slate-800 bg-white dark:bg-dashboard-background shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden select-none">
                                {/* Phone Notch */}
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-3.5 bg-black dark:bg-slate-800 rounded-full" />

                                {/* Phone Screen Header */}
                                <div className="pt-6 border-b border-[#F1F5F9] dark:border-dashboard-border pb-3 flex items-center justify-between text-xs text-[#64748B]">
                                    <span className="font-semibold">
                                        {t("pageCounter", "Page 1 of 0")}
                                    </span>
                                </div>

                                {/* Phone Screen Content Preview */}
                                <div className="flex-1 py-4 flex flex-col gap-3 overflow-y-auto">
                                    <h4 className="text-sm font-bold text-[#0F172A] dark:text-dashboard-foreground">
                                        {title || t("newTemplate", "New Template")}
                                    </h4>
                                    <p className="text-xs text-[#64748B] dark:text-dashboard-muted-foreground">
                                        {description || t("enterFormDescription", "Enter form description")}
                                    </p>
                                    <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-dashboard-card border border-[#E2E8F0] dark:border-dashboard-border text-[11px] text-[#94A3B8] text-center">
                                        {t("questionsPlaceholder", "Add sections and questions to preview here")}
                                    </div>
                                </div>

                                {/* Phone Screen Bottom Buttons matching Screenshot 3 */}
                                <div className="pt-3 border-t border-[#F1F5F9] dark:border-dashboard-border grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        disabled
                                        className="h-9 rounded-xl bg-[#F1F5F9] text-[#94A3B8] text-xs font-semibold flex items-center justify-center cursor-not-allowed"
                                    >
                                        {t("previous", "Previous")}
                                    </button>
                                    <button
                                        type="button"
                                        className="h-9 rounded-xl bg-[#2563EB] text-white text-xs font-semibold flex items-center justify-center cursor-pointer shadow-xs"
                                    >
                                        <span>{t("next", "Next")}</span>
                                        <span className="ml-1 rtl:rotate-180">←</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
