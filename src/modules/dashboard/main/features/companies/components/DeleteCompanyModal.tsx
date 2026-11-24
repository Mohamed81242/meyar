import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/design-system/components/dialog";
import { useDeleteCompanies } from "../api";
import type { Company } from "../types";
import { toast } from "sonner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    company: Company | null;
}

export const DeleteCompanyModal: React.FC<Props> = ({
    isOpen,
    onClose,
    company,
}) => {
    const deleteMutation = useDeleteCompanies();

    const handleDelete = () => {
        if (!company) return;
        deleteMutation.mutate(company.id, {
            onSuccess: () => {
                toast.success("تم حذف الجهة بنجاح");
                onClose();
            },
            onError: () => {
                toast.error("حدث خطأ أثناء حذف الجهة");
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xl select-none">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-[#0F172A]">
                        حذف الجهة
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 text-xs text-[#64748B]">
                    هل أنت متأكد من حذف الجهة{" "}
                    <span className="font-bold text-[#0F172A]">
                        "{company?.name}"
                    </span>
                    ؟ لا يمكن التراجع عن هذا الإجراء.
                </div>

                <DialogFooter className="gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    >
                        إلغاء
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 text-white transition-colors cursor-pointer"
                    >
                        {deleteMutation.isPending ? "جاري الحذف..." : "حذف"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
