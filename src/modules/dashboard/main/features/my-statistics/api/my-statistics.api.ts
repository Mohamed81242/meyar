import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type { MyStatisticsOverview, StatisticsQueryParams } from "../types";
import { mockMyStatisticsApi } from "./mock-data";

const BASE_URL = "/system-managements/statistics/my";
const USE_MOCK_DATA = true; // Dual-mode strategy default

export const myStatisticsApi = {
    getOverview: async (
        params?: StatisticsQueryParams,
        signal?: AbortSignal
    ): Promise<MyStatisticsOverview> => {
        if (API_CONFIG.USE_MOCK_DATA || USE_MOCK_DATA) {
            return mockMyStatisticsApi.getOverview(params, signal);
        }

        const response = await api.get<ApiResponse<MyStatisticsOverview>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error || !response.data?.data) {
            throw new Error(response.error?.message || "Failed to fetch statistics overview");
        }
        return response.data.data;
    },

    refresh: async (): Promise<{ success: boolean }> => {
        if (API_CONFIG.USE_MOCK_DATA || USE_MOCK_DATA) {
            return mockMyStatisticsApi.refresh();
        }

        const response = await api.post<ApiResponse<{ success: boolean }>>(`${BASE_URL}/refresh`);
        if (response.error || !response.data?.data) {
            throw new Error(response.error?.message || "Failed to refresh statistics");
        }
        return response.data.data;
    },
};
