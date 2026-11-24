import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type { SortingMechanismItem } from "../types";
import { mockSortingMechanismsApi } from "./mock-data";

const BASE_URL = "/sorting-mechanisms";
const IS_MOCKDATA = true;

export const sortingMechanismsApi = {
    getList: async (params?: ListQueryParams, signal?: AbortSignal): Promise<PaginatedData<SortingMechanismItem>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockSortingMechanismsApi.getList(params, signal);
        }

        const response = await api.get<ApiResponse<PaginatedData<SortingMechanismItem>>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error) throw response.error;
        return response.data?.data as PaginatedData<SortingMechanismItem>;
    },

    getById: async (id: string, signal?: AbortSignal): Promise<SortingMechanismItem> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockSortingMechanismsApi.getById(id, signal) as Promise<SortingMechanismItem>;
        }

        const response = await api.get<ApiResponse<SortingMechanismItem>>(`${BASE_URL}/${id}`, { signal });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Not found");
        return response.data.data;
    },
    
    create: async (payload: any): Promise<any> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockSortingMechanismsApi.create(payload);
        const response = await api.post(BASE_URL, payload);
        return response.data;
    },

    update: async (id: string, payload: any): Promise<any> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockSortingMechanismsApi.update(id, payload);
        const response = await api.put(`${BASE_URL}/${id}`, payload);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockSortingMechanismsApi.delete(id);
        await api.delete(`${BASE_URL}/${id}`);
    }
};
