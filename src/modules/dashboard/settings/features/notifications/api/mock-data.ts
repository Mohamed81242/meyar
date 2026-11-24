import type {
    NotificationTriggerRule,
    TriggerRuleUpdatePayload,
    NotificationLog,
    BroadcastPayload,
    NotificationChannel,
    NotificationsQueryParams,
} from "../types";
import { v4 as uuidv4 } from "uuid";

// ----------------------
// Mock Trigger Rules
// ----------------------
export let mockTriggerRules: NotificationTriggerRule[] = [
    {
        id: "rule-new-request",
        eventKey: "request.created",
        name: "New Notary Service Request",
        nameAr: "طلب توثيق جديد من العميل",
        description: "Triggered immediately when a client submits a new PoA or legal service request.",
        category: "requests",
        emailEnabled: true,
        smsEnabled: true,
        whatsappEnabled: true,
        inAppEnabled: true,
        emailSubjectTemplate: "Nota: New Service Request #{{requestId}} submitted",
        emailBodyTemplate: "Hello {{recipientName}}, a new service request has been received for {{serviceName}}.",
        smsTemplate: "Nota: Request #{{requestId}} received. Track progress online.",
        isActive: true,
        updatedAt: "2026-07-20T10:00:00.000Z",
    },
    {
        id: "rule-signed-doc",
        eventKey: "document.signed",
        name: "Document Digitally Sealed & Signed",
        nameAr: "اكتمال التوقيع والختم الإلكتروني للمحرر",
        description: "Sent to the client and legal archive once a power of attorney is electronically authenticated.",
        category: "legal",
        emailEnabled: true,
        smsEnabled: false,
        whatsappEnabled: true,
        inAppEnabled: true,
        emailSubjectTemplate: "Your Official Notarized Document is Ready (#{{requestId}})",
        emailBodyTemplate: "Dear {{clientName}}, your document has been digitally sealed by Counselor {{counselorName}}.",
        smsTemplate: "Your notarized document is ready for download on Nota platform.",
        isActive: true,
        updatedAt: "2026-07-22T11:30:00.000Z",
    },
    {
        id: "rule-payment-success",
        eventKey: "payment.completed",
        name: "Electronic Fee Payment Confirmed",
        nameAr: "تأكيد سداد الرسوم الإلكترونية والفاتورة الضريبية",
        description: "Sent upon successful payment capture via credit card or digital wallet.",
        category: "billing",
        emailEnabled: true,
        smsEnabled: true,
        whatsappEnabled: false,
        inAppEnabled: true,
        emailSubjectTemplate: "Nota: Payment Receipt for Invoice #{{invoiceId}}",
        emailBodyTemplate: "Thank you {{clientName}}, we have received your payment of {{amount}} {{currency}}.",
        smsTemplate: "Nota: Payment of {{amount}} EGP confirmed for Invoice #{{invoiceId}}.",
        isActive: true,
        updatedAt: "2026-07-23T14:15:00.000Z",
    },
    {
        id: "rule-counselor-assigned",
        eventKey: "counselor.assigned",
        name: "Legal Counselor Assigned",
        nameAr: "تعيين مستشار قانوني لمراجعة الطلب",
        description: "Notifies the assigned counselor and the client that case review is underway.",
        category: "legal",
        emailEnabled: true,
        smsEnabled: false,
        whatsappEnabled: true,
        inAppEnabled: true,
        emailSubjectTemplate: "Nota: Assigned to Review Request #{{requestId}}",
        emailBodyTemplate: "Counselor {{counselorName}}, request #{{requestId}} is awaiting your legal audit.",
        smsTemplate: "Nota: Counselor {{counselorName}} has been assigned to your request.",
        isActive: true,
        updatedAt: "2026-07-24T09:00:00.000Z",
    },
    {
        id: "rule-court-deadline",
        eventKey: "court.deadline_alert",
        name: "Court Filing & Notary Deadline Alert",
        nameAr: "تنبيه موعد إيداع في المحكمة أو الشهر العقاري",
        description: "Automated alert 24 hours prior to court appearance or notary authentication deadlines.",
        category: "legal",
        emailEnabled: true,
        smsEnabled: true,
        whatsappEnabled: true,
        inAppEnabled: true,
        emailSubjectTemplate: "Urgent Reminder: Upcoming Court Appearance for {{caseNumber}}",
        emailBodyTemplate: "Reminder: You have a scheduled appointment at {{courtName}} on {{date}} at {{time}}.",
        smsTemplate: "Nota Reminder: Court session at {{courtName}} tomorrow at {{time}}.",
        isActive: true,
        updatedAt: "2026-07-25T16:20:00.000Z",
    },
    {
        id: "rule-security-login",
        eventKey: "security.unusual_login",
        name: "Security & New Device Login Alert",
        nameAr: "تنبيه أمني عند تسجيل الدخول من جهاز جديد",
        description: "Dispatched to admins when a dashboard session originates from an unrecognized IP address.",
        category: "security",
        emailEnabled: true,
        smsEnabled: true,
        whatsappEnabled: false,
        inAppEnabled: true,
        emailSubjectTemplate: "Security Alert: New Sign-in to Your Nota Dashboard Account",
        emailBodyTemplate: "A login was detected from IP {{ipAddress}} at {{timestamp}}.",
        smsTemplate: "Security Alert: New login to your Nota admin account from {{ipAddress}}.",
        isActive: true,
        updatedAt: "2026-07-26T12:00:00.000Z",
    },
];

// ----------------------
// Mock Sent Logs
// ----------------------
export let mockNotificationLogs: NotificationLog[] = [
    {
        id: "log-1",
        title: "Maintenance Window Notice",
        message: "Platform scheduled maintenance for cryptographic key rotation on Friday 02:00 AM - 04:00 AM Cairo time.",
        channels: ["email", "in_app"],
        recipientType: "all_admins",
        recipientCount: 14,
        status: "delivered",
        sentAt: "2026-08-15T18:00:00.000Z",
        senderName: "Belal Esam",
    },
    {
        id: "log-2",
        title: "Commercial Court E-Filing Protocol Update",
        message: "Please review the updated power of attorney digital verification checklist for Giza Economic Court.",
        channels: ["email", "whatsapp", "in_app"],
        recipientType: "counselors",
        recipientCount: 8,
        status: "delivered",
        sentAt: "2026-08-14T10:30:00.000Z",
        senderName: "Counselor Ahmed Mansour",
    },
    {
        id: "log-3",
        title: "Service Fee Receipt #INV-88219",
        message: "Payment of 1,850 EGP captured for General Power of Attorney notarization.",
        channels: ["email", "sms"],
        recipientType: "individual",
        recipientCount: 1,
        targetContact: "m.tarek@example.com",
        status: "delivered",
        sentAt: "2026-08-14T09:15:00.000Z",
        senderName: "System Automation",
    },
    {
        id: "log-4",
        title: "WhatsApp API Gateway Reconnection Alert",
        message: "WhatsApp Business Cloud webhook re-established successfully.",
        channels: ["in_app"],
        recipientType: "all_admins",
        recipientCount: 5,
        status: "delivered",
        sentAt: "2026-08-12T14:40:00.000Z",
        senderName: "System Automation",
    },
    {
        id: "log-5",
        title: "Urgent Document Correction Required",
        message: "Identity card image upload for Request #SR-9921 was rejected due to low resolution.",
        channels: ["sms", "whatsapp"],
        recipientType: "individual",
        recipientCount: 1,
        targetContact: "+20 100 999 8888",
        status: "failed",
        sentAt: "2026-08-11T16:20:00.000Z",
        senderName: "Nouran El-Shazly",
    },
];

// ----------------------
// Mock API Implementation
// ----------------------
export const mockNotificationsApi = {
    // 1. Trigger Rules
    getRules: async (params?: NotificationsQueryParams, signal?: AbortSignal): Promise<any> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, search, category, status, perPage = 10 } = (params || {}) as any;
                let filtered = [...mockTriggerRules];

                if (category && category !== "all") {
                    filtered = filtered.filter((r) => r.category === category);
                }

                if (search && search.trim()) {
                    const q = search.toLowerCase().trim();
                    filtered = filtered.filter(
                        (r) =>
                            r.name.toLowerCase().includes(q) ||
                            (r.nameAr && r.nameAr.toLowerCase().includes(q)) ||
                            (r.description && r.description.toLowerCase().includes(q))
                    );
                }

                if (status && status !== "all") {
                    filtered = filtered.filter((r) => (status === "active" ? r.isActive : !r.isActive));
                }

                const p = Number(page);
                const limit = Number(perPage);
                const start = (p - 1) * limit;

                resolve({
                    items: filtered.slice(start, start + limit),
                    perPage: limit,
                    currentPage: p,
                    lastPage: Math.ceil(filtered.length / limit) || 1,
                    nextPageUrl: null,
                    total: filtered.length,
                });
            }, 250);
        });
    },

    updateRule: async (id: string, payload: TriggerRuleUpdatePayload): Promise<NotificationTriggerRule> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockTriggerRules.findIndex((r) => r.id === id);
                if (index === -1) return reject(new Error("Rule not found"));
                const updated: NotificationTriggerRule = {
                    ...mockTriggerRules[index],
                    ...payload,
                    updatedAt: new Date().toISOString(),
                };
                mockTriggerRules[index] = updated;
                resolve(updated);
            }, 250);
        });
    },

    toggleRuleChannel: async (id: string, channel: NotificationChannel): Promise<NotificationTriggerRule> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockTriggerRules.findIndex((r) => r.id === id);
                if (index === -1) return reject(new Error("Rule not found"));
                const rule = mockTriggerRules[index];
                if (channel === "email") rule.emailEnabled = !rule.emailEnabled;
                else if (channel === "sms") rule.smsEnabled = !rule.smsEnabled;
                else if (channel === "whatsapp") rule.whatsappEnabled = !rule.whatsappEnabled;
                else if (channel === "in_app") rule.inAppEnabled = !rule.inAppEnabled;
                rule.updatedAt = new Date().toISOString();
                resolve({ ...rule });
            }, 200);
        });
    },

    toggleRuleStatus: async (id: string): Promise<NotificationTriggerRule> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockTriggerRules.findIndex((r) => r.id === id);
                if (index === -1) return reject(new Error("Rule not found"));
                mockTriggerRules[index].isActive = !mockTriggerRules[index].isActive;
                mockTriggerRules[index].updatedAt = new Date().toISOString();
                resolve(mockTriggerRules[index]);
            }, 200);
        });
    },

    // 2. Notification Logs & Broadcasts
    getLogs: async (params?: NotificationsQueryParams, signal?: AbortSignal): Promise<any> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, search, channel, status, perPage = 10 } = (params || {}) as any;
                let filtered = [...mockNotificationLogs];

                if (channel && channel !== "all") {
                    filtered = filtered.filter((l) => l.channels.includes(channel as NotificationChannel));
                }

                if (status && status !== "all") {
                    filtered = filtered.filter((l) => l.status === status);
                }

                if (search && search.trim()) {
                    const q = search.toLowerCase().trim();
                    filtered = filtered.filter(
                        (l) =>
                            l.title.toLowerCase().includes(q) ||
                            l.message.toLowerCase().includes(q) ||
                            (l.senderName && l.senderName.toLowerCase().includes(q)) ||
                            (l.targetContact && l.targetContact.toLowerCase().includes(q))
                    );
                }

                const p = Number(page);
                const limit = Number(perPage);
                const start = (p - 1) * limit;

                resolve({
                    items: filtered.slice(start, start + limit),
                    perPage: limit,
                    currentPage: p,
                    lastPage: Math.ceil(filtered.length / limit) || 1,
                    nextPageUrl: null,
                    total: filtered.length,
                });
            }, 250);
        });
    },

    sendBroadcast: async (payload: BroadcastPayload): Promise<NotificationLog> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const countMap = {
                    all_admins: 14,
                    counselors: 8,
                    clients: 142,
                    individual: 1,
                };
                const newLog: NotificationLog = {
                    id: uuidv4(),
                    title: payload.title,
                    message: payload.message,
                    channels: payload.channels,
                    recipientType: payload.recipientType,
                    recipientCount: countMap[payload.recipientType] || 1,
                    targetContact: payload.targetContact,
                    status: "delivered",
                    sentAt: new Date().toISOString(),
                    senderName: "Current Admin (You)",
                };
                mockNotificationLogs = [newLog, ...mockNotificationLogs];
                resolve(newLog);
            }, 350);
        });
    },

    deleteLog: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockNotificationLogs = mockNotificationLogs.filter((l) => l.id !== id);
                resolve();
            }, 250);
        });
    },
};
