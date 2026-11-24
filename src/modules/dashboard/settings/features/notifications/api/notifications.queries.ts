import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "./notifications.api";
import { notificationsKeys } from "./notifications.keys";
import type { NotificationsQueryParams } from "../types";

export const useNotificationRulesList = (params?: NotificationsQueryParams) => {
    return useQuery({
        queryKey: notificationsKeys.ruleList(params),
        queryFn: ({ signal }) => notificationsApi.getRules(params, signal),
    });
};

export const useNotificationLogsList = (params?: NotificationsQueryParams) => {
    return useQuery({
        queryKey: notificationsKeys.logList(params),
        queryFn: ({ signal }) => notificationsApi.getLogs(params, signal),
    });
};

// Backward compatibility
export const useNotifications = useNotificationRulesList;
