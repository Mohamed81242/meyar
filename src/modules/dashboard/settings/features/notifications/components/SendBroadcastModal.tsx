import React, { useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/design-system/components/select";
import { Loader2, Mail, MessageSquare, PhoneCall, BellRing, Send } from "lucide-react";
import type { BroadcastPayload, NotificationChannel, RecipientType } from "../types";

interface SendBroadcastModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (data: BroadcastPayload) => void;
    isPending?: boolean;
}

export const SendBroadcastModal: React.FC<SendBroadcastModalProps> = ({
    isOpen,
    onClose,
    onSend,
    isPending = false,
}) => {
    const { t } = useLanguage("notifications");

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [channels, setChannels] = useState<NotificationChannel[]>(["email", "in_app"]);
    const [recipientType, setRecipientType] = useState<RecipientType>("all_admins");
    const [targetContact, setTargetContact] = useState("");
    const [errors, setErrors] = useState<{ title?: string; message?: string; channels?: string }>({});

    const handleToggleChannel = (ch: NotificationChannel) => {
        setChannels((prev) =>
            prev.includes(ch) ? (prev.length > 1 ? prev.filter((c) => c !== ch) : prev) : [...prev, ch]
        );
        if (errors.channels) setErrors((prev) => ({ ...prev, channels: undefined }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { title?: string; message?: string; channels?: string } = {};

        if (!title.trim()) newErrors.title = t("validation.titleRequired");
        if (!message.trim()) newErrors.message = t("validation.messageRequired");
        if (channels.length === 0) newErrors.channels = t("validation.channelRequired");

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSend({
            title: title.trim(),
            message: message.trim(),
            channels,
            recipientType,
            targetContact: recipientType === "individual" ? targetContact.trim() : undefined,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[560px] p-6 bg-dashboard-card border-dashboard-border">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-xl font-bold text-dashboard-foreground">
                        {t("modal.sendBroadcast")}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-dashboard-muted-foreground">
                        {t("modal.sendBroadcastSubtitle")}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Audience Target */}
                    <div className="space-y-1.5">
                        <Label htmlFor="broadcast-audience" className="text-xs font-semibold text-dashboard-foreground">
                            {t("form.targetAudience")} <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={recipientType}
                            onValueChange={(val: any) => val && setRecipientType(val)}
                        >
                            <SelectTrigger
                                id="broadcast-audience"
                                className="w-full bg-dashboard-background border-dashboard-border rounded-xl text-sm"
                            >
                                <SelectValue placeholder={t("form.selectAudience")} />
                            </SelectTrigger>
                            <SelectContent className="bg-dashboard-card border-dashboard-border">
                                <SelectItem value="all_admins">{t("audience.allAdmins")}</SelectItem>
                                <SelectItem value="counselors">{t("audience.counselors")}</SelectItem>
                                <SelectItem value="clients">{t("audience.clients")}</SelectItem>
                                <SelectItem value="individual">{t("audience.individual")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {recipientType === "individual" && (
                        <div className="space-y-1.5">
                            <Label htmlFor="target-contact" className="text-xs font-semibold text-dashboard-foreground">
                                {t("form.targetContact")}
                            </Label>
                            <Input
                                id="target-contact"
                                value={targetContact}
                                onChange={(e) => setTargetContact(e.target.value)}
                                placeholder="name@domain.com or +20 100 000 0000"
                                className="bg-dashboard-background border-dashboard-border rounded-xl text-sm"
                                required
                            />
                        </div>
                    )}

                    {/* Channels Multi-Select */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-dashboard-foreground">
                            {t("form.dispatchChannels")} <span className="text-red-500">*</span>
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div
                                onClick={() => handleToggleChannel("email")}
                                className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer text-xs transition-all ${
                                    channels.includes("email")
                                        ? "bg-dashboard-primary/10 border-dashboard-primary text-dashboard-primary font-bold"
                                        : "bg-dashboard-card border-dashboard-border text-dashboard-muted-foreground hover:bg-dashboard-secondary"
                                }`}
                            >
                                <Mail className="w-3.5 h-3.5" />
                                <span>{t("channels.email")}</span>
                            </div>

                            <div
                                onClick={() => handleToggleChannel("sms")}
                                className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer text-xs transition-all ${
                                    channels.includes("sms")
                                        ? "bg-amber-500/10 border-amber-500 text-amber-500 font-bold"
                                        : "bg-dashboard-card border-dashboard-border text-dashboard-muted-foreground hover:bg-dashboard-secondary"
                                }`}
                            >
                                <PhoneCall className="w-3.5 h-3.5" />
                                <span>{t("channels.sms")}</span>
                            </div>

                            <div
                                onClick={() => handleToggleChannel("whatsapp")}
                                className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer text-xs transition-all ${
                                    channels.includes("whatsapp")
                                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-500 font-bold"
                                        : "bg-dashboard-card border-dashboard-border text-dashboard-muted-foreground hover:bg-dashboard-secondary"
                                }`}
                            >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{t("channels.whatsapp")}</span>
                            </div>

                            <div
                                onClick={() => handleToggleChannel("in_app")}
                                className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer text-xs transition-all ${
                                    channels.includes("in_app")
                                        ? "bg-purple-500/10 border-purple-500 text-purple-500 font-bold"
                                        : "bg-dashboard-card border-dashboard-border text-dashboard-muted-foreground hover:bg-dashboard-secondary"
                                }`}
                            >
                                <BellRing className="w-3.5 h-3.5" />
                                <span>{t("channels.inApp")}</span>
                            </div>
                        </div>
                        {errors.channels && <p className="text-xs text-red-500 mt-1">{errors.channels}</p>}
                    </div>

                    {/* Notification Title */}
                    <div className="space-y-1.5">
                        <Label htmlFor="broadcast-title" className="text-xs font-semibold text-dashboard-foreground">
                            {t("form.broadcastTitle")} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="broadcast-title"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                            }}
                            placeholder="e.g. Scheduled System Upgrade Notice"
                            className="bg-dashboard-background border-dashboard-border rounded-xl text-sm"
                            required
                        />
                        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                    </div>

                    {/* Notification Message */}
                    <div className="space-y-1.5">
                        <Label htmlFor="broadcast-message" className="text-xs font-semibold text-dashboard-foreground">
                            {t("form.broadcastMessage")} <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="broadcast-message"
                            rows={4}
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                            }}
                            placeholder="Type the announcement or notice here..."
                            className="bg-dashboard-background border-dashboard-border rounded-xl text-sm"
                            required
                        />
                        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
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
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            {t("actions.dispatchBroadcast")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
