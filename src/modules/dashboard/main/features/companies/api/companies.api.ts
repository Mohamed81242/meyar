import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type { Companies, CompaniesCreatePayload, CompaniesUpdatePayload } from "../types";
import { mockCompaniesApi } from "./mock-data";

const BASE_URL = "/companies";
const IS_MOCKDATA = true;

export const companiesApi = {
    getList: async (params?: ListQueryParams, signal?: AbortSignal): Promise<PaginatedData<Companies>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockCompaniesApi.getList(params, signal);
        }

        const response = await api.get<ApiResponse<PaginatedData<Companies>>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error) throw response.error;
        return response.data?.data as PaginatedData<Companies>;
    },

    getById: async (id: string, signal?: AbortSignal): Promise<Companies> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockCompaniesApi.getById(id, signal) as Promise<Companies>;
        }

        const response = await api.get<ApiResponse<Companies>>(`${BASE_URL}/${id}`, { signal });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Not found");
        return response.data.data;
    },
    
    create: async (payload: CompaniesCreatePayload): Promise<Companies> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockCompaniesApi.create(payload);
        const response = await api.post<ApiResponse<Companies>>(BASE_URL, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    update: async (id: string, payload: CompaniesUpdatePayload): Promise<Companies> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockCompaniesApi.update(id, payload);
        const response = await api.put<ApiResponse<Companies>>(`${BASE_URL}/${id}`, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockCompaniesApi.delete(id);
        const response = await api.delete(`${BASE_URL}/${id}`);
        if (response.error) throw new Error(response.error.message || "Failed");
    }
};
