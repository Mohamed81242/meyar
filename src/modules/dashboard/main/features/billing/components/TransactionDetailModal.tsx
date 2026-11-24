import React from "react";
import { useLanguage } from "@/shared/hooks";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/design-system/components/dialog";
import { Button } from "@/design-system/components/button";
import {
    CreditCard,
    User,
    Mail,
    Phone,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    RotateCcw,
    Layers,
    Receipt,
} from "lucide-react";
import type { FinancialTransaction, TransactionStatus } from "../types";

interface TransactionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: FinancialTransaction | null;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
    isOpen,
    onClose,
    transaction,
}) => {
    const { t } = useLanguage("billing");

    if (!transaction) return null;

    const renderStatusBadge = (status: TransactionStatus) => {
        switch (status) {
            case "completed":
            case "successful":
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {t("status.completed", "Completed")}
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        <Clock className="w-3 h-3" />
                        {t("status.pending", "Pending")}
                    </span>
                );
            case "refunded":
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        <RotateCcw className="w-3 h-3" />
                        {t("status.refunded", "Refunded")}
                    </span>
                );
            case "failed":
            default:
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                        <XCircle className="w-3 h-3" />
                        {t("status.failed", "Failed")}
                    </span>
                );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[560px] p-6 bg-dashboard-card border-dashboard-border">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                        {renderStatusBadge(transaction.status)}
                        <span className="text-xs text-dashboard-muted-foreground font-mono">
                            ID: #{transaction.id}
                        </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <div>
                            <DialogTitle className="text-lg font-bold text-dashboard-foreground flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-dashboard-primary" />
                                {t("modal.transactionTitle", "Transaction Details")}
                            </DialogTitle>
                            <span className="text-xs text-dashboard-muted-foreground font-mono mt-0.5 block">
                                Ref: {transaction.reference}
                            </span>
                        </div>

                        <div className="text-right">
                            <span className="text-xl font-black text-dashboard-primary block">
                                {Number(transaction.amount).toLocaleString()} EGP
                            </span>
                            <span className="text-[10px] text-dashboard-muted-foreground uppercase font-bold tracking-wider">
                                {transaction.type}
                            </span>
                        </div>
                    </div>
                </DialogHeader>

                <div className="my-4 space-y-3.5">
                    {/* User info */}
                    {transaction.user && (
                        <div className="p-3.5 rounded-xl bg-dashboard-background border border-dashboard-border space-y-2">
                            <span className="text-[10px] font-bold text-dashboard-muted-foreground uppercase tracking-wider block">
                                {t("table.lawyer", "Associated Practitioner")}
                            </span>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-dashboard-primary/10 text-dashboard-primary flex items-center justify-center font-bold text-xs">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-dashboard-foreground">
                                            {transaction.user.name}
                                        </span>
                                        <span className="text-[11px] text-dashboard-muted-foreground">
                                            {transaction.user.title || "محامٍ"} • {transaction.user.barBranch || "نقابة المحامين"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end text-xs text-dashboard-muted-foreground">
                                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{transaction.user.email}</span>
                                    {transaction.user.phone && <span className="flex items-center gap-1 font-mono"><Phone className="w-3 h-3" />{transaction.user.phone}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Metadata & Service details */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-dashboard-background border border-dashboard-border flex items-center gap-2.5">
                            <Layers className="w-4 h-4 text-dashboard-muted-foreground shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-dashboard-muted-foreground">{t("table.service", "Service Channel")}</span>
                                <span className="text-xs font-bold text-dashboard-foreground font-mono">
                                    {transaction.metadata?.service || transaction.type}
                                </span>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-dashboard-background border border-dashboard-border flex items-center gap-2.5">
                            <CreditCard className="w-4 h-4 text-dashboard-muted-foreground shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-dashboard-muted-foreground">{t("table.type", "Payment Type")}</span>
                                <span className="text-xs font-bold text-dashboard-foreground capitalize">
                                    {transaction.type}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Date */}
                    <div className="p-3 rounded-xl bg-dashboard-background border border-dashboard-border flex items-center justify-between text-xs text-dashboard-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{t("table.occurredAt", "Occurred At")}:</span>
                        </div>
                        <strong className="text-dashboard-foreground">
                            {new Date(transaction.occurredAt || transaction.createdAt).toLocaleString()}
                        </strong>
                    </div>
                </div>

                <DialogFooter className="pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="w-full rounded-xl border-dashboard-border text-dashboard-muted-foreground hover:bg-dashboard-secondary"
                    >
                        {t("actions.close", "Close")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
