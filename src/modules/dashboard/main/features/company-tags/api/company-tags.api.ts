import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type { CompanyTag, CompanyTagCreatePayload, CompanyTagUpdatePayload } from "../types";
import { mockCompanyTagsApi } from "./mock-data";

const BASE_URL = "/company-tags";
const IS_MOCKDATA = true;

export const companyTagsApi = {
    getList: async (params?: ListQueryParams, signal?: AbortSignal): Promise<PaginatedData<CompanyTag>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockCompanyTagsApi.getList(params, signal);
        }

        const response = await api.get<ApiResponse<PaginatedData<CompanyTag>>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error) throw response.error;
        return response.data?.data as PaginatedData<CompanyTag>;
    },

    getById: async (id: string, signal?: AbortSignal): Promise<CompanyTag> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockCompanyTagsApi.getById(id, signal) as Promise<CompanyTag>;
        }

        const response = await api.get<ApiResponse<CompanyTag>>(`${BASE_URL}/${id}`, { signal });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Not found");
        return response.data.data;
    },

    create: async (payload: CompanyTagCreatePayload): Promise<CompanyTag> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockCompanyTagsApi.create(payload);
        const response = await api.post<ApiResponse<CompanyTag>>(BASE_URL, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    update: async (id: string, payload: CompanyTagUpdatePayload): Promise<CompanyTag> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockCompanyTagsApi.update(id, payload);
        const response = await api.put<ApiResponse<CompanyTag>>(`${BASE_URL}/${id}`, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockCompanyTagsApi.delete(id);
        const response = await api.delete<ApiResponse<void>>(`${BASE_URL}/${id}`);
        if (response.error) throw response.error;
    },
};
