import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type { SortingMechanisms, SortingMechanismsCreatePayload, SortingMechanismsUpdatePayload } from "../types";
import { mockSortingMechanismsApi } from "./mock-data";

const BASE_URL = "/sorting-mechanisms";
const IS_MOCKDATA = true;

export const sortingMechanismsApi = {
    getList: async (params?: ListQueryParams, signal?: AbortSignal): Promise<PaginatedData<SortingMechanisms>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockSortingMechanismsApi.getList(params, signal);
        }

        const response = await api.get<ApiResponse<PaginatedData<SortingMechanisms>>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error) throw response.error;
        return response.data?.data as PaginatedData<SortingMechanisms>;
    },

    getById: async (id: string, signal?: AbortSignal): Promise<SortingMechanisms> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockSortingMechanismsApi.getById(id, signal) as Promise<SortingMechanisms>;
        }

        const response = await api.get<ApiResponse<SortingMechanisms>>(`${BASE_URL}/${id}`, { signal });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Not found");
        return response.data.data;
    },
    
    create: async (payload: SortingMechanismsCreatePayload): Promise<SortingMechanisms> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockSortingMechanismsApi.create(payload);
        const response = await api.post<ApiResponse<SortingMechanisms>>(BASE_URL, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    update: async (id: string, payload: SortingMechanismsUpdatePayload): Promise<SortingMechanisms> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockSortingMechanismsApi.update(id, payload);
        const response = await api.put<ApiResponse<SortingMechanisms>>(`${BASE_URL}/${id}`, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockSortingMechanismsApi.delete(id);
        const response = await api.delete(`${BASE_URL}/${id}`);
        if (response.error) throw new Error(response.error.message || "Failed");
    }
};
