import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type { TemplateFolder, TemplateFolderCreatePayload, TemplateFolderUpdatePayload } from "../types";
import { mockFoldersOrClassificationsApi } from "./mock-data";

const BASE_URL = "/folders-or-classifications";
const IS_MOCKDATA = true;

export const foldersOrClassificationsApi = {
    getList: async (params?: ListQueryParams, signal?: AbortSignal): Promise<PaginatedData<TemplateFolder>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockFoldersOrClassificationsApi.getList(params, signal);
        }

        const response = await api.get<ApiResponse<PaginatedData<TemplateFolder>>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error) throw response.error;
        return response.data?.data as PaginatedData<TemplateFolder>;
    },

    getById: async (id: string, signal?: AbortSignal): Promise<TemplateFolder> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockFoldersOrClassificationsApi.getById(id, signal) as Promise<TemplateFolder>;
        }

        const response = await api.get<ApiResponse<TemplateFolder>>(`${BASE_URL}/${id}`, { signal });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Not found");
        return response.data.data;
    },

    create: async (payload: TemplateFolderCreatePayload): Promise<TemplateFolder> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockFoldersOrClassificationsApi.create(payload);
        const response = await api.post<ApiResponse<TemplateFolder>>(BASE_URL, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    update: async (id: string, payload: TemplateFolderUpdatePayload): Promise<TemplateFolder> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockFoldersOrClassificationsApi.update(id, payload);
        const response = await api.put<ApiResponse<TemplateFolder>>(`${BASE_URL}/${id}`, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockFoldersOrClassificationsApi.delete(id);
        const response = await api.delete<ApiResponse<void>>(`${BASE_URL}/${id}`);
        if (response.error) throw response.error;
    },
};
