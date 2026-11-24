import React, { useEffect, useState } from "react";
import { useLanguage } from "@/shared/hooks";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/design-system/components/dialog";
import { Button } from "@/design-system/components/button";
import { Input } from "@/design-system/components/input";
import { Textarea } from "@/design-system/components/textarea";
import { Label } from "@/design-system/components/label";
import { Switch } from "@/design-system/components/switch";
import { Loader2, Mail, MessageSquare, PhoneCall, BellRing } from "lucide-react";
import type { NotificationTriggerRule, TriggerRuleUpdatePayload } from "../types";

interface EditTriggerRuleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: TriggerRuleUpdatePayload) => void;
    rule: NotificationTriggerRule | null;
    isPending?: boolean;
}

export const EditTriggerRuleModal: React.FC<EditTriggerRuleModalProps> = ({
    isOpen,
    onClose,
    onSave,
    rule,
    isPending = false,
}) => {
    const { t } = useLanguage("notifications");

    const [name, setName] = useState("");
    const [nameAr, setNameAr] = useState("");
    const [description, setDescription] = useState("");
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [smsEnabled, setSmsEnabled] = useState(false);
    const [whatsappEnabled, setWhatsappEnabled] = useState(false);
    const [inAppEnabled, setInAppEnabled] = useState(true);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailBody, setEmailBody] = useState("");
    const [smsBody, setSmsBody] = useState("");
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (rule) {
            setName(rule.name || "");
            setNameAr(rule.nameAr || "");
            setDescription(rule.description || "");
            setEmailEnabled(rule.emailEnabled ?? true);
            setSmsEnabled(rule.smsEnabled ?? false);
            setWhatsappEnabled(rule.whatsappEnabled ?? false);
            setInAppEnabled(rule.inAppEnabled ?? true);
            setEmailSubject(rule.emailSubjectTemplate || "");
            setEmailBody(rule.emailBodyTemplate || "");
            setSmsBody(rule.smsTemplate || "");
            setIsActive(rule.isActive ?? true);
        }
    }, [rule, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name: name.trim(),
            nameAr: nameAr.trim() || undefined,
            description: description.trim() || undefined,
            emailEnabled,
            smsEnabled,
            whatsappEnabled,
            inAppEnabled,
            emailSubjectTemplate: emailSubject.trim() || undefined,
            emailBodyTemplate: emailBody.trim() || undefined,
            smsTemplate: smsBody.trim() || undefined,
            isActive,
        });
    };

    if (!rule) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[620px] p-6 bg-dashboard-card border-dashboard-border">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-xl font-bold text-dashboard-foreground">
                        {t("modal.editRule")}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-dashboard-muted-foreground">
                        {t("modal.editRuleSubtitle")}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[75vh] overflow-y-auto custom-scrollbar ltr:pr-1 rtl:pl-1">
                    {/* Event info */}
                    <div className="p-3 rounded-xl bg-dashboard-background border border-dashboard-border flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-dashboard-muted-foreground uppercase">{rule.eventKey}</span>
                            <span className="text-xs font-bold text-dashboard-foreground">{rule.name}</span>
                        </div>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-dashboard-secondary border border-dashboard-border text-dashboard-foreground capitalize">
                            {rule.category}
                        </span>
                    </div>

                    {/* Delivery Channels Checklist */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-dashboard-foreground">
                            {t("form.deliveryChannels")}
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {/* Email */}
                            <div
                                onClick={() => setEmailEnabled(!emailEnabled)}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                                    emailEnabled
                                        ? "bg-dashboard-primary/10 border-dashboard-primary text-dashboard-primary font-bold"
                                        : "bg-dashboard-card border-dashboard-border text-dashboard-muted-foreground hover:bg-dashboard-secondary"
                                }`}
                            >
                                <Mail className="w-4 h-4" />
                                <span className="text-xs">{t("channels.email")}</span>
                            </div>

                            {/* SMS */}
                            <div
                                onClick={() => setSmsEnabled(!smsEnabled)}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                                    smsEnabled
                                        ? "bg-amber-500/10 border-amber-500 text-amber-500 font-bold"
                                        : "bg-dashboard-card border-dashboard-border text-dashboard-muted-foreground hover:bg-dashboard-secondary"
                                }`}
                            >
                                <PhoneCall className="w-4 h-4" />
                                <span className="text-xs">{t("channels.sms")}</span>
                            </div>

                            {/* WhatsApp */}
                            <div
                                onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                                    whatsappEnabled
                                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-500 font-bold"
                                        : "bg-dashboard-card border-dashboard-border text-dashboard-muted-foreground hover:bg-dashboard-secondary"
                                }`}
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-xs">{t("channels.whatsapp")}</span>
                            </div>

                            {/* In-App Push */}
                            <div
                                onClick={() => setInAppEnabled(!inAppEnabled)}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                                    inAppEnabled
                                        ? "bg-purple-500/10 border-purple-500 text-purple-500 font-bold"
                                        : "bg-dashboard-card border-dashboard-border text-dashboard-muted-foreground hover:bg-dashboard-secondary"
                                }`}
                            >
                                <BellRing className="w-4 h-4" />
                                <span className="text-xs">{t("channels.inApp")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Email Templates */}
                    {emailEnabled && (
                        <div className="space-y-3 p-3.5 rounded-xl border border-dashboard-border bg-dashboard-background/30">
                            <span className="text-xs font-bold text-dashboard-foreground flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-dashboard-primary" />
                                {t("form.emailTemplateConfig")}
                            </span>
                            <div className="space-y-1.5">
                                <Label htmlFor="email-subject" className="text-[11px] font-semibold text-dashboard-muted-foreground">
                                    {t("form.emailSubject")}
                                </Label>
                                <Input
                                    id="email-subject"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    placeholder="Subject with {{placeholders}}..."
                                    className="bg-dashboard-card border-dashboard-border rounded-xl text-xs"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="email-body" className="text-[11px] font-semibold text-dashboard-muted-foreground">
                                    {t("form.emailBody")}
                                </Label>
                                <Textarea
                                    id="email-body"
                                    rows={3}
                                    value={emailBody}
                                    onChange={(e) => setEmailBody(e.target.value)}
                                    placeholder="Email content template..."
                                    className="bg-dashboard-card border-dashboard-border rounded-xl text-xs"
                                />
                            </div>
                        </div>
                    )}

                    {/* SMS / WhatsApp Templates */}
                    {(smsEnabled || whatsappEnabled) && (
                        <div className="space-y-2 p-3.5 rounded-xl border border-dashboard-border bg-dashboard-background/30">
                            <span className="text-xs font-bold text-dashboard-foreground flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                                {t("form.shortMessageTemplate")}
                            </span>
                            <Textarea
                                id="sms-body"
                                rows={2}
                                value={smsBody}
                                onChange={(e) => setSmsBody(e.target.value)}
                                placeholder="Short text template (up to 160 characters)..."
                                className="bg-dashboard-card border-dashboard-border rounded-xl text-xs"
                            />
                        </div>
                    )}

                    {/* Rule Active Switch */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-dashboard-border bg-dashboard-background/50">
                        <div className="space-y-0.5">
                            <Label htmlFor="rule-status" className="text-xs font-semibold text-dashboard-foreground cursor-pointer">
                                {t("form.ruleActiveStatus")}
                            </Label>
                            <p className="text-[11px] text-dashboard-muted-foreground">
                                {t("form.ruleActiveStatusDesc")}
                            </p>
                        </div>
                        <Switch
                            id="rule-status"
                            checked={isActive}
                            onCheckedChange={setIsActive}
                        />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isPending}
                            className="rounded-xl border-dashboard-border text-dashboard-muted-foreground hover:bg-dashboard-secondary"
                        >
                            {t("actions.cancel")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-dashboard-primary hover:bg-dashboard-primary/90 text-white rounded-xl gap-2 font-semibold shadow-xs"
                        >
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {t("actions.saveChanges")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
