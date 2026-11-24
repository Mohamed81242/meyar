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
import { Bell, Users, Calendar, CheckCircle2, AlertCircle, Clock, Mail, MessageSquare, PhoneCall, BellRing } from "lucide-react";
import type { NotificationLog, NotificationChannel } from "../types";

interface NotificationLogDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    log: NotificationLog | null;
}

export const NotificationLogDetailModal: React.FC<NotificationLogDetailModalProps> = ({
    isOpen,
    onClose,
    log,
}) => {
    const { t } = useLanguage("notifications");

    if (!log) return null;

    const formattedDate = new Date(log.sentAt).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const getChannelIcon = (ch: NotificationChannel) => {
        switch (ch) {
            case "email":
                return <Mail className="w-3.5 h-3.5" />;
            case "sms":
                return <PhoneCall className="w-3.5 h-3.5" />;
            case "whatsapp":
                return <MessageSquare className="w-3.5 h-3.5" />;
            default:
                return <BellRing className="w-3.5 h-3.5" />;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[560px] p-6 bg-dashboard-card border-dashboard-border">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-xl bg-dashboard-primary/10 text-dashboard-primary flex items-center justify-center shrink-0">
                                <Bell className="w-4 h-4" />
                            </span>
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-dashboard-secondary border border-dashboard-border text-dashboard-foreground capitalize">
                                {t(`audience.${log.recipientType}`) || log.recipientType}
                            </span>
                        </div>

                        <span
                            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                                log.status === "delivered"
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    : log.status === "failed"
                                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            }`}
                        >
                            {log.status === "delivered" ? (
                                <>
                                    <CheckCircle2 className="w-3 h-3" />
                                    {t("status.delivered")}
                                </>
                            ) : log.status === "failed" ? (
                                <>
                                    <AlertCircle className="w-3 h-3" />
                                    {t("status.failed")}
                                </>
                            ) : (
                                <>
                                    <Clock className="w-3 h-3" />
                                    {t("status.pending")}
                                </>
                            )}
                        </span>
                    </div>

                    <div>
                        <DialogTitle className="text-lg font-bold text-dashboard-foreground leading-snug">
                            {log.title}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="my-4 space-y-3.5">
                    {/* Message Body */}
                    <div className="p-4 rounded-xl bg-dashboard-background border border-dashboard-border text-sm text-dashboard-foreground leading-relaxed whitespace-pre-wrap">
                        {log.message}
                    </div>

                    {/* Dispatch Channels */}
                    <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-dashboard-muted-foreground block">
                            {t("form.dispatchChannels")}
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {log.channels.map((ch) => (
                                <span
                                    key={ch}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-dashboard-background border border-dashboard-border text-dashboard-foreground capitalize"
                                >
                                    {getChannelIcon(ch)}
                                    {t(`channels.${ch}`) || ch}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Meta */}
                    <div className="grid grid-cols-2 gap-3 text-xs text-dashboard-muted-foreground pt-1">
                        <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            <span>{t("table.recipients")}: <strong className="text-dashboard-foreground">{log.recipientCount}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{t("table.sentAt")}: <strong className="text-dashboard-foreground">{formattedDate}</strong></span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="rounded-xl border-dashboard-border text-dashboard-muted-foreground hover:bg-dashboard-secondary"
                    >
                        {t("actions.close")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
