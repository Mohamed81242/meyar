import React from "react";
import { X, BookOpen, Download } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/design-system/components/dialog";
import { useLanguage } from "@/shared/hooks";
import { toast } from "sonner";

interface TemplatesLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LIBRARY_TEMPLATES = [
    {
        id: "lib-1",
        title: "قالب السلامة والصحة المهنية OSHA",
        category: "Safety",
        sections: 12,
        questions: 84,
    },
    {
        id: "lib-2",
        title: "قالب سلامة ونظافة المستودعات الغذائية",
        category: "Food Storage",
        sections: 8,
        questions: 60,
    },
    {
        id: "lib-3",
        title: "قالب تقييم المنشآت السياحية والفنادق",
        category: "Hospitality",
        sections: 15,
        questions: 120,
    },
];

export const TemplatesLibraryModal: React.FC<TemplatesLibraryModalProps> = ({
    isOpen,
    onClose,
}) => {
    const { t } = useLanguage("inspection-templates");

    const handleImport = (title: string) => {
        toast.success(t("importedTemplate", `Imported template "${title}" to your templates`));
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-white dark:bg-dashboard-card p-0 rounded-2xl border border-dashboard-border shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 px-6 border-b border-[#F1F5F9] dark:border-dashboard-border">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-[#2563EB]" />
                        <DialogTitle className="text-sm font-bold text-[#0F172A] dark:text-dashboard-foreground">
                            {t("libraryTitle", "Meayar Templates Library")}
                        </DialogTitle>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-lg hover:bg-dashboard-secondary transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-3 max-h-96 overflow-y-auto">
                    {LIBRARY_TEMPLATES.map((item) => (
                        <div
                            key={item.id}
                            className="p-4 rounded-xl border border-[#E2E8F0] dark:border-dashboard-border bg-[#F8FAFC] dark:bg-dashboard-background flex items-center justify-between gap-4"
                        >
                            <div className="flex flex-col gap-1">
                                <h4 className="text-xs font-bold text-[#0F172A] dark:text-dashboard-foreground">
                                    {item.title}
                                </h4>
                                <div className="text-[11px] text-[#64748B] flex items-center gap-3">
                                    <span>{item.category}</span>
                                    <span>•</span>
                                    <span>{item.sections} Sections</span>
                                    <span>•</span>
                                    <span>{item.questions} Questions</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleImport(item.title)}
                                className="h-8 px-3 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>{t("import", "Import")}</span>
                            </button>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};
