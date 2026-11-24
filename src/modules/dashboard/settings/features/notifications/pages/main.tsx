import React, { useState } from "react";
import { usePermissions, PERMISSIONS } from "@/auth";
import { useLanguage } from "@/shared/hooks";
import { DataTable, type DataTableColumn } from "@/design-system";
import { Button } from "@/design-system/components/button";
import { Input } from "@/design-system/components/input";
import { Switch } from "@/design-system/components/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/design-system/components/select";
import { ConfirmDialog } from "@/design-system/components/ConfirmDialog";
import {
    Send,
    Search,
    Edit2,
    Trash2,
    Bell,
    Mail,
    PhoneCall,
    MessageSquare,
    BellRing,
    History,
    Eye,
    ChevronLeft,
    ChevronRight,
    Zap,
    CheckCircle2,
    AlertCircle,
    Clock,
} from "lucide-react";
import {
    useNotificationRulesList,
    useNotificationLogsList,
} from "../api/notifications.queries";
import {
    useUpdateNotificationRule,
    useToggleNotificationChannel,
    useToggleNotificationRuleStatus,
    useSendBroadcastNotification,
    useDeleteNotificationLog,
} from "../api/notifications.mutations";
import {
    EditTriggerRuleModal,
    SendBroadcastModal,
    NotificationLogDetailModal,
} from "../components";
import type {
    NotificationTriggerRule,
    TriggerRuleUpdatePayload,
    NotificationLog,
    BroadcastPayload,
    NotificationChannel,
} from "../types";

export default function NotificationsPage() {
    const { t } = useLanguage("notifications");
    const { hasPermission } = usePermissions();

    // Sub-tab: "rules" | "logs"
    const [activeTab, setActiveTab] = useState<"rules" | "logs">("rules");

    // Filter & Pagination States
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const perPage = 8;

    // Modal States
    const [selectedRuleForEdit, setSelectedRuleForEdit] = useState<NotificationTriggerRule | null>(null);
    const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
    const [selectedLogForDetail, setSelectedLogForDetail] = useState<NotificationLog | null>(null);
    const [logToDelete, setLogToDelete] = useState<string | null>(null);

    // Queries
    const { data: rulesListData, isLoading: isRulesLoading } = useNotificationRulesList({
        page,
        perPage,
        search,
        category: categoryFilter,
        status: statusFilter,
    });

    const { data: logsListData, isLoading: isLogsLoading } = useNotificationLogsList({
        page,
        perPage,
        search,
        status: statusFilter,
    });

    // Mutations
    const updateRuleMutation = useUpdateNotificationRule();
    const toggleChannelMutation = useToggleNotificationChannel();
    const toggleStatusMutation = useToggleNotificationRuleStatus();
    const sendBroadcastMutation = useSendBroadcastNotification();
    const deleteLogMutation = useDeleteNotificationLog();

    const handleTabChange = (tab: "rules" | "logs") => {
        setActiveTab(tab);
        setPage(1);
        setSearch("");
    };

    const handleSaveRule = (payload: TriggerRuleUpdatePayload) => {
        if (!selectedRuleForEdit) return;
        updateRuleMutation.mutate(
            { id: selectedRuleForEdit.id, data: payload },
            {
                onSuccess: () => setSelectedRuleForEdit(null),
            }
        );
    };

    const handleSendBroadcast = (payload: BroadcastPayload) => {
        sendBroadcastMutation.mutate(payload, {
            onSuccess: () => {
                setIsBroadcastModalOpen(false);
                setActiveTab("logs");
                setPage(1);
            },
        });
    };

    const handleConfirmDeleteLog = () => {
        if (!logToDelete) return;
        deleteLogMutation.mutate(logToDelete, {
            onSuccess: () => setLogToDelete(null),
        });
    };

    const getCategoryBadgeStyle = (cat: string) => {
        switch (cat) {
            case "requests":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "legal":
                return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "billing":
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "security":
                return "bg-rose-500/10 text-rose-500 border-rose-500/20";
            default:
                return "bg-dashboard-secondary text-dashboard-foreground border-dashboard-border";
        }
    };

    // ------------------------------------
    // Columns: 1. Trigger Rules
    // ------------------------------------
    const ruleColumns: DataTableColumn<NotificationTriggerRule>[] = [
        {
            id: "name",
            header: t("table.eventTrigger"),
            cell: (item) => (
                <div
                    onClick={() => setSelectedRuleForEdit(item)}
                    className="flex items-start gap-3 cursor-pointer group max-w-sm sm:max-w-md"
                >
                    <div className="w-8 h-8 rounded-lg bg-dashboard-secondary/80 flex items-center justify-center shrink-0 text-dashboard-muted-foreground group-hover:text-dashboard-primary group-hover:bg-dashboard-primary/10 transition-colors mt-0.5">
                        <Zap className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-dashboard-foreground text-sm group-hover:text-dashboard-primary transition-colors">
                            {item.name}
                        </span>
                        {item.description && (
                            <span className="text-[11px] text-dashboard-muted-foreground line-clamp-1 mt-0.5">
                                {item.description}
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            id: "category",
            header: t("table.category"),
            cell: (item) => (
                <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border inline-block capitalize ${getCategoryBadgeStyle(
                        item.category
                    )}`}
                >
                    {t(`categories.${item.category}`) || item.category}
                </span>
            ),
        },
        {
            id: "channels",
            header: t("table.channels"),
            cell: (item) => (
                <div className="flex items-center gap-1.5">
                    {/* Email */}
                    <button
                        type="button"
                        disabled={!hasPermission(PERMISSIONS.NOTIFICATIONS.UPDATE) || toggleChannelMutation.isPending}
                        onClick={() => toggleChannelMutation.mutate({ id: item.id, channel: "email" })}
                        title={`${t("channels.email")}: ${item.emailEnabled ? t("status.active") : t("status.inactive")}`}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                            item.emailEnabled
                                ? "bg-dashboard-primary/15 border-dashboard-primary/40 text-dashboard-primary"
                                : "bg-dashboard-background border-dashboard-border text-dashboard-muted-foreground/40 opacity-40 hover:opacity-100"
                        }`}
                    >
                        <Mail className="w-3.5 h-3.5" />
                    </button>

                    {/* SMS */}
                    <button
                        type="button"
                        disabled={!hasPermission(PERMISSIONS.NOTIFICATIONS.UPDATE) || toggleChannelMutation.isPending}
                        onClick={() => toggleChannelMutation.mutate({ id: item.id, channel: "sms" })}
                        title={`${t("channels.sms")}: ${item.smsEnabled ? t("status.active") : t("status.inactive")}`}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                            item.smsEnabled
                                ? "bg-amber-500/15 border-amber-500/40 text-amber-500"
                                : "bg-dashboard-background border-dashboard-border text-dashboard-muted-foreground/40 opacity-40 hover:opacity-100"
                        }`}
                    >
                        <PhoneCall className="w-3.5 h-3.5" />
                    </button>

                    {/* WhatsApp */}
                    <button
                        type="button"
                        disabled={!hasPermission(PERMISSIONS.NOTIFICATIONS.UPDATE) || toggleChannelMutation.isPending}
                        onClick={() => toggleChannelMutation.mutate({ id: item.id, channel: "whatsapp" })}
                        title={`${t("channels.whatsapp")}: ${item.whatsappEnabled ? t("status.active") : t("status.inactive")}`}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                            item.whatsappEnabled
                                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-500"
                                : "bg-dashboard-background border-dashboard-border text-dashboard-muted-foreground/40 opacity-40 hover:opacity-100"
                        }`}
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                    </button>

                    {/* In-App */}
                    <button
                        type="button"
                        disabled={!hasPermission(PERMISSIONS.NOTIFICATIONS.UPDATE) || toggleChannelMutation.isPending}
                        onClick={() => toggleChannelMutation.mutate({ id: item.id, channel: "in_app" })}
                        title={`${t("channels.inApp")}: ${item.inAppEnabled ? t("status.active") : t("status.inactive")}`}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                            item.inAppEnabled
                                ? "bg-purple-500/15 border-purple-500/40 text-purple-500"
                                : "bg-dashboard-background border-dashboard-border text-dashboard-muted-foreground/40 opacity-40 hover:opacity-100"
                        }`}
                    >
                        <BellRing className="w-3.5 h-3.5" />
                    </button>
                </div>
            ),
        },
        {
            id: "status",
            header: t("table.status"),
            cell: (item) => (
                <div className="flex items-center gap-2">
                    <Switch
                        size="sm"
                        checked={item.isActive}
                        onCheckedChange={() => toggleStatusMutation.mutate(item.id)}
                        disabled={!hasPermission(PERMISSIONS.NOTIFICATIONS.UPDATE) || toggleStatusMutation.isPending}
                    />
                    <span className={`text-xs font-semibold ${item.isActive ? "text-emerald-500" : "text-dashboard-muted-foreground"}`}>
                        {item.isActive ? t("status.active") : t("status.inactive")}
                    </span>
                </div>
            ),
        },
        {
            id: "actions",
            header: t("table.actions"),
            variant: "actions",
            cell: (item) => (
                <div className="flex items-center gap-2 justify-end">
                    {hasPermission(PERMISSIONS.NOTIFICATIONS.UPDATE) && (
                        <button
                            onClick={() => setSelectedRuleForEdit(item)}
                            aria-label={t("actions.editRule")}
                            className="px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-dashboard-primary hover:bg-dashboard-primary/10 transition-colors cursor-pointer"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{t("actions.editRule")}</span>
                        </button>
                    )}
                </div>
            ),
        },
    ];

    // ------------------------------------
    // Columns: 2. Broadcast Logs
    // ------------------------------------
    const logColumns: DataTableColumn<NotificationLog>[] = [
        {
            id: "title",
            header: t("table.broadcastTitle"),
            cell: (item) => (
                <div
                    onClick={() => setSelectedLogForDetail(item)}
                    className="flex items-start gap-3 cursor-pointer group max-w-sm sm:max-w-md"
                >
                    <div className="w-8 h-8 rounded-lg bg-dashboard-secondary/80 flex items-center justify-center shrink-0 text-dashboard-muted-foreground group-hover:text-dashboard-primary group-hover:bg-dashboard-primary/10 transition-colors mt-0.5">
                        <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-dashboard-foreground text-sm group-hover:text-dashboard-primary transition-colors line-clamp-1">
                            {item.title}
                        </span>
                        <span className="text-[11px] text-dashboard-muted-foreground line-clamp-1">
                            {item.message}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            id: "audience",
            header: t("table.targetAudience"),
            cell: (item) => (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-dashboard-secondary border border-dashboard-border text-dashboard-foreground capitalize">
                    {t(`audience.${item.recipientType}`) || item.recipientType}
                </span>
            ),
        },
        {
            id: "channels",
            header: t("table.channels"),
            cell: (item) => (
                <div className="flex items-center gap-1">
                    {item.channels.map((ch) => (
                        <span
                            key={ch}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-dashboard-secondary border border-dashboard-border text-dashboard-foreground capitalize"
                        >
                            {ch}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            id: "status",
            header: t("table.status"),
            cell: (item) => (
                <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border w-fit ${
                        item.status === "delivered"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : item.status === "failed"
                            ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}
                >
                    {item.status === "delivered" ? (
                        <>
                            <CheckCircle2 className="w-3 h-3" />
                            {t("status.delivered")}
                        </>
                    ) : item.status === "failed" ? (
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
            ),
        },
        {
            id: "actions",
            header: t("table.actions"),
            variant: "actions",
            cell: (item) => (
                <div className="flex items-center gap-2 justify-end">
                    {(hasPermission(PERMISSIONS.NOTIFICATIONS.VIEW) ||
                        hasPermission(PERMISSIONS.NOTIFICATIONS.VIEW_ANY)) && (
                        <button
                            onClick={() => setSelectedLogForDetail(item)}
                            title={t("actions.view")}
                            aria-label={t("actions.view")}
                            className="p-1.5 rounded-lg text-dashboard-muted-foreground hover:text-dashboard-foreground hover:bg-dashboard-secondary transition-colors cursor-pointer"
                        >
                            <Eye className="w-3.5 h-3.5" />
                        </button>
                    )}
                    {hasPermission(PERMISSIONS.NOTIFICATIONS.DELETE) && (
                        <button
                            onClick={() => setLogToDelete(item.id)}
                            aria-label={t("actions.delete")}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    const currentData = activeTab === "rules" ? rulesListData?.items || [] : logsListData?.items || [];
    const isCurrentLoading = activeTab === "rules" ? isRulesLoading : isLogsLoading;
    const totalResults = activeTab === "rules" ? rulesListData?.total ?? 0 : logsListData?.total ?? 0;
    const totalPages = activeTab === "rules" ? rulesListData?.lastPage ?? 1 : logsListData?.lastPage ?? 1;

    const startRange = totalResults > 0 ? (page - 1) * perPage + 1 : 0;
    const endRange = Math.min(page * perPage, totalResults);

    return (
        <div className="bg-dashboard-background text-dashboard-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-20 flex flex-col gap-6">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-dashboard-border">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
                        <p className="text-xs text-dashboard-muted-foreground mt-1">
                            {t("subtitle")}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {(hasPermission(PERMISSIONS.NOTIFICATIONS.SEND) ||
                            hasPermission(PERMISSIONS.NOTIFICATIONS.CREATE)) && (
                            <Button
                                onClick={() => setIsBroadcastModalOpen(true)}
                                className="bg-dashboard-primary hover:bg-dashboard-primary/90 text-white gap-2 rounded-xl text-xs font-semibold px-4 py-2 shadow-xs cursor-pointer"
                            >
                                <Send className="w-3.5 h-3.5" />
                                {t("actions.sendBroadcast")}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Sub-Tabs Switcher */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-dashboard-card border border-dashboard-border w-fit shadow-2xs">
                    <button
                        onClick={() => handleTabChange("rules")}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                            activeTab === "rules"
                                ? "bg-dashboard-primary text-white shadow-xs"
                                : "text-dashboard-muted-foreground hover:text-dashboard-foreground hover:bg-dashboard-secondary"
                        }`}
                    >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{t("tabs.rules")}</span>
                    </button>
                    <button
                        onClick={() => handleTabChange("logs")}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                            activeTab === "logs"
                                ? "bg-dashboard-primary text-white shadow-xs"
                                : "text-dashboard-muted-foreground hover:text-dashboard-foreground hover:bg-dashboard-secondary"
                        }`}
                    >
                        <History className="w-3.5 h-3.5" />
                        <span>{t("tabs.logs")}</span>
                    </button>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dashboard-muted-foreground pointer-events-none" />
                        <Input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder={
                                activeTab === "rules"
                                    ? t("searchPlaceholder.rules")
                                    : t("searchPlaceholder.logs")
                            }
                            className="ltr:pr-10 rtl:pl-10 w-full bg-dashboard-card border-dashboard-border rounded-xl text-xs"
                            dir="auto"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        {/* Category Filter (Rules tab) */}
                        {activeTab === "rules" && (
                            <Select
                                value={categoryFilter}
                                onValueChange={(val) => {
                                    if (val) {
                                        setCategoryFilter(val);
                                        setPage(1);
                                    }
                                }}
                            >
                                <SelectTrigger className="w-[160px] bg-dashboard-card border-dashboard-border rounded-xl text-xs">
                                    <SelectValue placeholder={t("categories.all")} />
                                </SelectTrigger>
                                <SelectContent className="bg-dashboard-card border-dashboard-border">
                                    <SelectItem value="all">{t("categories.all")}</SelectItem>
                                    <SelectItem value="requests">{t("categories.requests")}</SelectItem>
                                    <SelectItem value="legal">{t("categories.legal")}</SelectItem>
                                    <SelectItem value="billing">{t("categories.billing")}</SelectItem>
                                    <SelectItem value="security">{t("categories.security")}</SelectItem>
                                    <SelectItem value="system">{t("categories.system")}</SelectItem>
                                </SelectContent>
                            </Select>
                        )}

                        {/* Status Filter */}
                        <Select
                            value={statusFilter}
                            onValueChange={(val) => {
                                if (val) {
                                    setStatusFilter(val);
                                    setPage(1);
                                }
                            }}
                        >
                            <SelectTrigger className="w-[130px] bg-dashboard-card border-dashboard-border rounded-xl text-xs">
                                <SelectValue placeholder={t("status.all")} />
                            </SelectTrigger>
                            <SelectContent className="bg-dashboard-card border-dashboard-border">
                                <SelectItem value="all">{t("status.all")}</SelectItem>
                                <SelectItem value="active">{t("status.active")}</SelectItem>
                                <SelectItem value="inactive">{t("status.inactive")}</SelectItem>
                                {activeTab === "logs" && (
                                    <>
                                        <SelectItem value="delivered">{t("status.delivered")}</SelectItem>
                                        <SelectItem value="failed">{t("status.failed")}</SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Main Table Card */}
                <div className="bg-dashboard-card border border-dashboard-border rounded-xl shadow-xs overflow-hidden flex flex-col">
                    <div className="w-full overflow-hidden">
                        {activeTab === "rules" ? (
                            <DataTable
                                columns={ruleColumns}
                                data={currentData as NotificationTriggerRule[]}
                                isLoading={isCurrentLoading}
                                emptyState={
                                    <div className="p-12 text-center text-dashboard-muted-foreground flex flex-col items-center gap-3">
                                        <Bell className="w-10 h-10 stroke-1 text-dashboard-muted-foreground/60" />
                                        <p className="text-sm">{t("table.noData")}</p>
                                    </div>
                                }
                            />
                        ) : (
                            <DataTable
                                columns={logColumns}
                                data={currentData as NotificationLog[]}
                                isLoading={isCurrentLoading}
                                emptyState={
                                    <div className="p-12 text-center text-dashboard-muted-foreground flex flex-col items-center gap-3">
                                        <History className="w-10 h-10 stroke-1 text-dashboard-muted-foreground/60" />
                                        <p className="text-sm">{t("table.noData")}</p>
                                    </div>
                                }
                            />
                        )}
                    </div>

                    {/* Pagination Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-dashboard-border text-xs text-dashboard-muted-foreground bg-dashboard-card">
                        <span>
                            {t("pagination.showing")}{" "}
                            <strong className="text-dashboard-foreground">{startRange}</strong>{" "}
                            {t("pagination.to")}{" "}
                            <strong className="text-dashboard-foreground">{endRange}</strong>{" "}
                            {t("pagination.of")}{" "}
                            <strong className="text-dashboard-foreground">{totalResults}</strong>{" "}
                            {t("pagination.results")}
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                disabled={page <= 1 || isCurrentLoading}
                                aria-label="Previous Page"
                                className="w-8 h-8 rounded-lg flex items-center justify-center border border-dashboard-border bg-dashboard-background hover:bg-dashboard-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-dashboard-foreground"
                            >
                                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                                <button
                                    key={pNum}
                                    onClick={() => setPage(pNum)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                        pNum === page
                                            ? "bg-dashboard-primary text-white shadow-xs"
                                            : "border border-dashboard-border bg-dashboard-background hover:bg-dashboard-secondary text-dashboard-foreground"
                                    }`}
                                >
                                    {pNum}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                disabled={page >= totalPages || isCurrentLoading}
                                aria-label="Next Page"
                                className="w-8 h-8 rounded-lg flex items-center justify-center border border-dashboard-border bg-dashboard-background hover:bg-dashboard-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-dashboard-foreground"
                            >
                                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Trigger Rule Modal */}
            <EditTriggerRuleModal
                isOpen={!!selectedRuleForEdit}
                onClose={() => setSelectedRuleForEdit(null)}
                onSave={handleSaveRule}
                rule={selectedRuleForEdit}
                isPending={updateRuleMutation.isPending}
            />

            {/* Send Broadcast Modal */}
            <SendBroadcastModal
                isOpen={isBroadcastModalOpen}
                onClose={() => setIsBroadcastModalOpen(false)}
                onSend={handleSendBroadcast}
                isPending={sendBroadcastMutation.isPending}
            />

            {/* Notification Log Detail Modal */}
            <NotificationLogDetailModal
                isOpen={!!selectedLogForDetail}
                onClose={() => setSelectedLogForDetail(null)}
                log={selectedLogForDetail}
            />

            {/* Confirm Delete Log Dialog */}
            <ConfirmDialog
                open={!!logToDelete}
                onOpenChange={(open) => {
                    if (!open) setLogToDelete(null);
                }}
                onConfirm={handleConfirmDeleteLog}
                title={t("dialog.deleteTitle")}
                description={t("dialog.deleteDescription")}
                confirmText={t("dialog.confirm")}
                cancelText={t("dialog.cancel")}
                variant="danger"
            />
        </div>
    );
}
