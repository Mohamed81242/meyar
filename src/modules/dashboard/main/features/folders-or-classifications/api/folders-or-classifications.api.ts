import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type { FoldersOrClassifications, FoldersOrClassificationsCreatePayload, FoldersOrClassificationsUpdatePayload } from "../types";
import { mockFoldersOrClassificationsApi } from "./mock-data";

const BASE_URL = "/folders-or-classifications";
const IS_MOCKDATA = true;

export const foldersOrClassificationsApi = {
    getList: async (params?: ListQueryParams, signal?: AbortSignal): Promise<PaginatedData<FoldersOrClassifications>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockFoldersOrClassificationsApi.getList(params, signal);
        }

        const response = await api.get<ApiResponse<PaginatedData<FoldersOrClassifications>>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error) throw response.error;
        return response.data?.data as PaginatedData<FoldersOrClassifications>;
    },

    getById: async (id: string, signal?: AbortSignal): Promise<FoldersOrClassifications> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockFoldersOrClassificationsApi.getById(id, signal) as Promise<FoldersOrClassifications>;
        }

        const response = await api.get<ApiResponse<FoldersOrClassifications>>(`${BASE_URL}/${id}`, { signal });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Not found");
        return response.data.data;
    },
    
    create: async (payload: FoldersOrClassificationsCreatePayload): Promise<FoldersOrClassifications> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockFoldersOrClassificationsApi.create(payload);
        const response = await api.post<ApiResponse<FoldersOrClassifications>>(BASE_URL, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    update: async (id: string, payload: FoldersOrClassificationsUpdatePayload): Promise<FoldersOrClassifications> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockFoldersOrClassificationsApi.update(id, payload);
        const response = await api.put<ApiResponse<FoldersOrClassifications>>(`${BASE_URL}/${id}`, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockFoldersOrClassificationsApi.delete(id);
        const response = await api.delete(`${BASE_URL}/${id}`);
        if (response.error) throw new Error(response.error.message || "Failed");
    }
};
