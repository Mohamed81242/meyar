import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type { InspectionTypes, InspectionTypesCreatePayload, InspectionTypesUpdatePayload } from "../types";
import { mockInspectionTypesApi } from "./mock-data";

const BASE_URL = "/inspection-types";
const IS_MOCKDATA = true;

export const inspectionTypesApi = {
    getList: async (params?: ListQueryParams, signal?: AbortSignal): Promise<PaginatedData<InspectionTypes>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockInspectionTypesApi.getList(params, signal);
        }

        const response = await api.get<ApiResponse<PaginatedData<InspectionTypes>>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error) throw response.error;
        return response.data?.data as PaginatedData<InspectionTypes>;
    },

    getById: async (id: string, signal?: AbortSignal): Promise<InspectionTypes> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockInspectionTypesApi.getById(id, signal) as Promise<InspectionTypes>;
        }

        const response = await api.get<ApiResponse<InspectionTypes>>(`${BASE_URL}/${id}`, { signal });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Not found");
        return response.data.data;
    },
    
    create: async (payload: InspectionTypesCreatePayload): Promise<InspectionTypes> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockInspectionTypesApi.create(payload);
        const response = await api.post<ApiResponse<InspectionTypes>>(BASE_URL, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    update: async (id: string, payload: InspectionTypesUpdatePayload): Promise<InspectionTypes> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockInspectionTypesApi.update(id, payload);
        const response = await api.put<ApiResponse<InspectionTypes>>(`${BASE_URL}/${id}`, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockInspectionTypesApi.delete(id);
        const response = await api.delete(`${BASE_URL}/${id}`);
        if (response.error) throw new Error(response.error.message || "Failed");
    }
};
