import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type { StatisticsLiveOverview, StatisticsLiveQueryParams } from "../types";
import { mockStatisticsLiveApi } from "./mock-data";

const BASE_URL = "/system-managements/statistics/live";
const USE_MOCK_DATA = true; // Dual-mode strategy default

export const statisticsLiveApi = {
    getOverview: async (
        params?: StatisticsLiveQueryParams,
        signal?: AbortSignal
    ): Promise<StatisticsLiveOverview> => {
        if (API_CONFIG.USE_MOCK_DATA || USE_MOCK_DATA) {
            return mockStatisticsLiveApi.getOverview(params, signal);
        }

        const response = await api.get<ApiResponse<StatisticsLiveOverview>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error || !response.data?.data) {
            throw new Error(response.error?.message || "Failed to fetch live statistics");
        }
        return response.data.data;
    },

    exportReport: async (format: "excel" | "pdf"): Promise<{ downloadUrl: string }> => {
        if (API_CONFIG.USE_MOCK_DATA || USE_MOCK_DATA) {
            return mockStatisticsLiveApi.exportReport(format);
        }

        const response = await api.post<ApiResponse<{ downloadUrl: string }>>(
            `${BASE_URL}/export`,
            { format }
        );

        if (response.error || !response.data?.data) {
            throw new Error(response.error?.message || "Failed to export report");
        }
        return response.data.data;
    },
};
