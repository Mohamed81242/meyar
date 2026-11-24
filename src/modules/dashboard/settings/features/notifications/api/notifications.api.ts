import { api } from "@/shared/api/client";
import type { ApiResponse, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type {
    NotificationTriggerRule,
    TriggerRuleUpdatePayload,
    NotificationLog,
    BroadcastPayload,
    NotificationChannel,
    NotificationsQueryParams,
} from "../types";
import { mockNotificationsApi } from "./mock-data";

const BASE_URL = "/notifications";
const IS_MOCKDATA = true;

export const notificationsApi = {
    // -----------------
    // Trigger Rules
    // -----------------
    getRules: async (params?: NotificationsQueryParams, signal?: AbortSignal): Promise<PaginatedData<NotificationTriggerRule>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockNotificationsApi.getRules(params, signal);
        }
        const response = await api.get<ApiResponse<PaginatedData<NotificationTriggerRule>>>(`${BASE_URL}/rules`, { params, signal });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed to fetch notification rules");
        return response.data.data;
    },

    updateRule: async (id: string, payload: TriggerRuleUpdatePayload): Promise<NotificationTriggerRule> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockNotificationsApi.updateRule(id, payload);
        const response = await api.put<ApiResponse<NotificationTriggerRule>>(`${BASE_URL}/rules/${id}`, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed to update notification rule");
        return response.data.data;
    },

    toggleRuleChannel: async (id: string, channel: NotificationChannel): Promise<NotificationTriggerRule> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockNotificationsApi.toggleRuleChannel(id, channel);
        const response = await api.patch<ApiResponse<NotificationTriggerRule>>(`${BASE_URL}/rules/${id}/toggle-channel`, { channel });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed to toggle channel");
        return response.data.data;
    },

    toggleRuleStatus: async (id: string): Promise<NotificationTriggerRule> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockNotificationsApi.toggleRuleStatus(id);
        const response = await api.patch<ApiResponse<NotificationTriggerRule>>(`${BASE_URL}/rules/${id}/toggle-status`);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed to toggle status");
        return response.data.data;
    },

    // -----------------
    // Logs & Broadcasts
    // -----------------
    getLogs: async (params?: NotificationsQueryParams, signal?: AbortSignal): Promise<PaginatedData<NotificationLog>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockNotificationsApi.getLogs(params, signal);
        }
        const response = await api.get<ApiResponse<PaginatedData<NotificationLog>>>(`${BASE_URL}/logs`, { params, signal });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed to fetch logs");
        return response.data.data;
    },

    sendBroadcast: async (payload: BroadcastPayload): Promise<NotificationLog> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockNotificationsApi.sendBroadcast(payload);
        const response = await api.post<ApiResponse<NotificationLog>>(`${BASE_URL}/broadcast`, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed to dispatch broadcast");
        return response.data.data;
    },

    deleteLog: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockNotificationsApi.deleteLog(id);
        const response = await api.delete(`${BASE_URL}/logs/${id}`);
        if (response.error) throw new Error(response.error.message || "Failed to delete log");
    },

    // Backward compatibility
    getList: (params?: any, signal?: AbortSignal) => notificationsApi.getRules(params, signal),
    update: (id: string, payload: any) => notificationsApi.updateRule(id, payload),
};
