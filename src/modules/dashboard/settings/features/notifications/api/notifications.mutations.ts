import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "./notifications.api";
import { notificationsKeys } from "./notifications.keys";
import type {
    TriggerRuleUpdatePayload,
    BroadcastPayload,
    NotificationChannel,
} from "../types";

export function useUpdateNotificationRule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TriggerRuleUpdatePayload }) =>
            notificationsApi.updateRule(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationsKeys.rules() });
        },
    });
}

export function useToggleNotificationChannel() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, channel }: { id: string; channel: NotificationChannel }) =>
            notificationsApi.toggleRuleChannel(id, channel),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationsKeys.rules() });
        },
    });
}

export function useToggleNotificationRuleStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => notificationsApi.toggleRuleStatus(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationsKeys.rules() });
        },
    });
}

export function useSendBroadcastNotification() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: BroadcastPayload) => notificationsApi.sendBroadcast(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationsKeys.logs() });
        },
    });
}

export function useDeleteNotificationLog() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => notificationsApi.deleteLog(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationsKeys.logs() });
        },
    });
}

// Backward compatibility
export const useUpdateNotifications = useUpdateNotificationRule;
