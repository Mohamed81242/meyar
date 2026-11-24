import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type { RegistrationOfCompanies, RegistrationOfCompaniesCreatePayload, RegistrationOfCompaniesUpdatePayload } from "../types";
import { mockRegistrationOfCompaniesApi } from "./mock-data";

const BASE_URL = "/registration-of-companies";
const IS_MOCKDATA = true;

export const registrationOfCompaniesApi = {
    getList: async (params?: ListQueryParams, signal?: AbortSignal): Promise<PaginatedData<RegistrationOfCompanies>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockRegistrationOfCompaniesApi.getList(params, signal);
        }

        const response = await api.get<ApiResponse<PaginatedData<RegistrationOfCompanies>>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error) throw response.error;
        return response.data?.data as PaginatedData<RegistrationOfCompanies>;
    },

    getById: async (id: string, signal?: AbortSignal): Promise<RegistrationOfCompanies> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockRegistrationOfCompaniesApi.getById(id, signal) as Promise<RegistrationOfCompanies>;
        }

        const response = await api.get<ApiResponse<RegistrationOfCompanies>>(`${BASE_URL}/${id}`, { signal });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Not found");
        return response.data.data;
    },
    
    create: async (payload: RegistrationOfCompaniesCreatePayload): Promise<RegistrationOfCompanies> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockRegistrationOfCompaniesApi.create(payload);
        const response = await api.post<ApiResponse<RegistrationOfCompanies>>(BASE_URL, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    update: async (id: string, payload: RegistrationOfCompaniesUpdatePayload): Promise<RegistrationOfCompanies> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockRegistrationOfCompaniesApi.update(id, payload);
        const response = await api.put<ApiResponse<RegistrationOfCompanies>>(`${BASE_URL}/${id}`, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockRegistrationOfCompaniesApi.delete(id);
        const response = await api.delete(`${BASE_URL}/${id}`);
        if (response.error) throw new Error(response.error.message || "Failed");
    }
};
