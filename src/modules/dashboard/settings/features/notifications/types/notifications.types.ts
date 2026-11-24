import { z } from "zod";
import type { ListQueryParams } from "@/shared/api";

export type NotificationChannel = "email" | "sms" | "whatsapp" | "in_app";
export type NotificationCategory = "requests" | "legal" | "billing" | "security" | "system";
export type DeliveryStatus = "sent" | "delivered" | "failed" | "pending";
export type RecipientType = "all_admins" | "counselors" | "clients" | "individual";

// ----------------------
// Trigger Rule Types
// ----------------------
export const triggerRuleSchema = z.object({
    name: z.string().min(2, "Name is required"),
    nameAr: z.string().optional(),
    description: z.string().optional(),
    category: z.enum(["requests", "legal", "billing", "security", "system"]),
    emailEnabled: z.boolean().default(true),
    smsEnabled: z.boolean().default(false),
    whatsappEnabled: z.boolean().default(false),
    inAppEnabled: z.boolean().default(true),
    emailSubjectTemplate: z.string().optional(),
    emailBodyTemplate: z.string().optional(),
    smsTemplate: z.string().optional(),
    isActive: z.boolean().default(true),
});

export interface NotificationTriggerRule {
    id: string;
    eventKey: string;
    name: string;
    nameAr?: string;
    description?: string;
    category: NotificationCategory;
    emailEnabled: boolean;
    smsEnabled: boolean;
    whatsappEnabled: boolean;
    inAppEnabled: boolean;
    emailSubjectTemplate?: string;
    emailBodyTemplate?: string;
    smsTemplate?: string;
    isActive: boolean;
    updatedAt: string;
}

export type TriggerRuleUpdatePayload = Partial<z.infer<typeof triggerRuleSchema>>;

// ----------------------
// Notification Log / Broadcast Types
// ----------------------
export const broadcastSchema = z.object({
    title: z.string().min(2, "Title is required"),
    message: z.string().min(5, "Message must be at least 5 characters"),
    channels: z.array(z.enum(["email", "sms", "whatsapp", "in_app"])).min(1, "Select at least one channel"),
    recipientType: z.enum(["all_admins", "counselors", "clients", "individual"]),
    targetContact: z.string().optional(),
});

export interface NotificationLog {
    id: string;
    title: string;
    message: string;
    channels: NotificationChannel[];
    recipientType: RecipientType;
    recipientCount: number;
    targetContact?: string;
    status: DeliveryStatus;
    sentAt: string;
    senderName?: string;
}

export type BroadcastPayload = z.infer<typeof broadcastSchema>;

// Backward compatibility
export type Notifications = NotificationTriggerRule;
export const notificationsSchema = triggerRuleSchema;
export type NotificationsCreatePayload = z.infer<typeof triggerRuleSchema>;
export type NotificationsUpdatePayload = TriggerRuleUpdatePayload;

export interface NotificationsQueryParams extends ListQueryParams {
    search?: string;
    category?: string;
    channel?: string;
    status?: string;
    [key: string]: unknown;
}
