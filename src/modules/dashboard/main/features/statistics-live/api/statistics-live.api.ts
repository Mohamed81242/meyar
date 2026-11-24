import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type { StatisticsLive, StatisticsLiveCreatePayload, StatisticsLiveUpdatePayload } from "../types";
import { mockStatisticsLiveApi } from "./mock-data";

const BASE_URL = "/statistics-live";
const IS_MOCKDATA = true;

export const statisticsLiveApi = {
    getList: async (params?: ListQueryParams, signal?: AbortSignal): Promise<PaginatedData<StatisticsLive>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockStatisticsLiveApi.getList(params, signal);
        }

        const response = await api.get<ApiResponse<PaginatedData<StatisticsLive>>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error) throw response.error;
        return response.data?.data as PaginatedData<StatisticsLive>;
    },

    getById: async (id: string, signal?: AbortSignal): Promise<StatisticsLive> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockStatisticsLiveApi.getById(id, signal) as Promise<StatisticsLive>;
        }

        const response = await api.get<ApiResponse<StatisticsLive>>(`${BASE_URL}/${id}`, { signal });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Not found");
        return response.data.data;
    },
    
    create: async (payload: StatisticsLiveCreatePayload): Promise<StatisticsLive> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockStatisticsLiveApi.create(payload);
        const response = await api.post<ApiResponse<StatisticsLive>>(BASE_URL, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    update: async (id: string, payload: StatisticsLiveUpdatePayload): Promise<StatisticsLive> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockStatisticsLiveApi.update(id, payload);
        const response = await api.put<ApiResponse<StatisticsLive>>(`${BASE_URL}/${id}`, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockStatisticsLiveApi.delete(id);
        const response = await api.delete(`${BASE_URL}/${id}`);
        if (response.error) throw new Error(response.error.message || "Failed");
    }
};
