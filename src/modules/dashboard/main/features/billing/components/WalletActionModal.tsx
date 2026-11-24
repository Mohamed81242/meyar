import React, { useState } from "react";
import { Button } from "@/design-system/components/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/design-system/components/dialog";
import { Input } from "@/design-system/components/input";
import { Label } from "@/design-system/components/label";
import { useLanguage } from "@/shared/hooks";
import { CheckCircle2, XCircle, Loader2, Wallet, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { WalletTransaction } from "../types";

interface WalletActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: WalletTransaction | null;
    actionType: "approve" | "reject";
    onConfirm: (notes?: string) => void;
    isPending?: boolean;
}

export const WalletActionModal: React.FC<WalletActionModalProps> = ({
    isOpen,
    onClose,
    transaction,
    actionType,
    onConfirm,
    isPending = false,
}) => {
    const { t } = useLanguage("billing");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");

    React.useEffect(() => {
        if (isOpen) {
            setNotes("");
            setError("");
        }
    }, [isOpen]);

    if (!transaction) return null;

    const isApprove = actionType === "approve";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isApprove && !notes.trim()) {
            setError(t("wallet.rejectionRequired", "Reason is required for rejecting settlement"));
            return;
        }
        onConfirm(notes || undefined);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[520px] p-6 bg-dashboard-card border-dashboard-border">
                <DialogHeader className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                isApprove
                                    ? "bg-emerald-500/10 text-emerald-500"
                                    : "bg-rose-500/10 text-rose-500"
                            }`}
                        >
                            <Wallet className="w-4 h-4" />
                        </span>
                        <DialogTitle className="text-xl font-bold text-dashboard-foreground">
                            {isApprove ? t("wallet.approveTitle", "Approve Settlement Transaction") : t("wallet.rejectTitle", "Reject Settlement Transaction")}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-xs text-dashboard-muted-foreground">
                        {transaction.reference} • {transaction.user?.name || "المحامي"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 my-3">
                    {/* Transaction summary */}
                    <div className="p-4 rounded-xl bg-dashboard-background border border-dashboard-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                                    transaction.type === "credit"
                                        ? "bg-emerald-500/10 text-emerald-500"
                                        : "bg-amber-500/10 text-amber-500"
                                }`}
                            >
                                {transaction.type === "credit" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-dashboard-foreground">
                                    {transaction.type === "credit" ? t("wallet.deposit", "Deposit (Credit)") : t("wallet.withdrawal", "Withdrawal (Debit)")}
                                </span>
                                <span className="text-[11px] text-dashboard-muted-foreground">
                                    {transaction.user?.name}
                                </span>
                            </div>
                        </div>

                        <span className="text-lg font-black text-dashboard-foreground">
                            {Number(transaction.amount).toLocaleString()} EGP
                        </span>
                    </div>

                    {transaction.notes && (
                        <div className="p-3 rounded-xl bg-dashboard-background border border-dashboard-border text-xs text-dashboard-muted-foreground">
                            <span className="text-[10px] font-semibold text-dashboard-foreground block mb-0.5">{t("wallet.userNotes", "User Request Remarks")}:</span>
                            {transaction.notes}
                        </div>
                    )}

                    {/* Decision Notes */}
                    <div className="space-y-1.5">
                        <Label htmlFor="wal-notes" className="text-xs font-semibold text-dashboard-foreground flex items-center justify-between">
                            <span>{isApprove ? t("wallet.approvalNotes", "Approval Remarks (Optional)") : t("wallet.rejectionReason", "Rejection Reason")}</span>
                            {!isApprove && <span className="text-rose-500 text-[10px]">{t("common.required", "Required")}</span>}
                        </Label>
                        <Input
                            id="wal-notes"
                            value={notes}
                            onChange={(e) => {
                                setNotes(e.target.value);
                                if (error) setError("");
                            }}
                            placeholder={
                                isApprove
                                    ? t("wallet.approvePlaceholder", "e.g. Bank transfer verified successfully...")
                                    : t("wallet.rejectPlaceholder", "e.g. Invalid bank credentials or insufficient balance...")
                            }
                            className={`bg-dashboard-background border-dashboard-border rounded-xl text-sm ${
                                error ? "border-rose-500" : ""
                            }`}
                        />
                        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isPending}
                            className="rounded-xl border-dashboard-border text-dashboard-muted-foreground hover:bg-dashboard-secondary"
                        >
                            {t("actions.cancel", "Cancel")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className={`rounded-xl font-semibold shadow-xs gap-2 text-white ${
                                isApprove
                                    ? "bg-emerald-600 hover:bg-emerald-500"
                                    : "bg-rose-600 hover:bg-rose-500"
                            }`}
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isApprove ? (
                                <CheckCircle2 className="w-4 h-4" />
                            ) : (
                                <XCircle className="w-4 h-4" />
                            )}
                            {isApprove ? t("wallet.confirmApprove", "Confirm Approval") : t("wallet.confirmReject", "Confirm Rejection")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
