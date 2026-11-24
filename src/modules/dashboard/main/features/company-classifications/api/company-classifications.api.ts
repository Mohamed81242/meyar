import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type { CompanyClassifications, CompanyClassificationsCreatePayload, CompanyClassificationsUpdatePayload } from "../types";
import { mockCompanyClassificationsApi } from "./mock-data";

const BASE_URL = "/company-classifications";
const IS_MOCKDATA = true;

export const companyClassificationsApi = {
    getList: async (params?: ListQueryParams, signal?: AbortSignal): Promise<PaginatedData<CompanyClassifications>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockCompanyClassificationsApi.getList(params, signal);
        }

        const response = await api.get<ApiResponse<PaginatedData<CompanyClassifications>>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error) throw response.error;
        return response.data?.data as PaginatedData<CompanyClassifications>;
    },

    getById: async (id: string, signal?: AbortSignal): Promise<CompanyClassifications> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockCompanyClassificationsApi.getById(id, signal) as Promise<CompanyClassifications>;
        }

        const response = await api.get<ApiResponse<CompanyClassifications>>(`${BASE_URL}/${id}`, { signal });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Not found");
        return response.data.data;
    },
    
    create: async (payload: CompanyClassificationsCreatePayload): Promise<CompanyClassifications> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockCompanyClassificationsApi.create(payload);
        const response = await api.post<ApiResponse<CompanyClassifications>>(BASE_URL, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    update: async (id: string, payload: CompanyClassificationsUpdatePayload): Promise<CompanyClassifications> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockCompanyClassificationsApi.update(id, payload);
        const response = await api.put<ApiResponse<CompanyClassifications>>(`${BASE_URL}/${id}`, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockCompanyClassificationsApi.delete(id);
        const response = await api.delete(`${BASE_URL}/${id}`);
        if (response.error) throw new Error(response.error.message || "Failed");
    }
};
