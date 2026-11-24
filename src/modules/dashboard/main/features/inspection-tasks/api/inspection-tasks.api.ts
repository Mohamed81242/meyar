import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type { InspectionTasks, InspectionTasksCreatePayload, InspectionTasksUpdatePayload } from "../types";
import { mockInspectionTasksApi } from "./mock-data";

const BASE_URL = "/inspection-tasks";
const IS_MOCKDATA = true;

export const inspectionTasksApi = {
    getList: async (params?: ListQueryParams, signal?: AbortSignal): Promise<PaginatedData<InspectionTasks>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockInspectionTasksApi.getList(params, signal);
        }

        const response = await api.get<ApiResponse<PaginatedData<InspectionTasks>>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error) throw response.error;
        return response.data?.data as PaginatedData<InspectionTasks>;
    },

    getById: async (id: string, signal?: AbortSignal): Promise<InspectionTasks> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockInspectionTasksApi.getById(id, signal) as Promise<InspectionTasks>;
        }

        const response = await api.get<ApiResponse<InspectionTasks>>(`${BASE_URL}/${id}`, { signal });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Not found");
        return response.data.data;
    },
    
    create: async (payload: InspectionTasksCreatePayload): Promise<InspectionTasks> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockInspectionTasksApi.create(payload);
        const response = await api.post<ApiResponse<InspectionTasks>>(BASE_URL, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    update: async (id: string, payload: InspectionTasksUpdatePayload): Promise<InspectionTasks> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockInspectionTasksApi.update(id, payload);
        const response = await api.put<ApiResponse<InspectionTasks>>(`${BASE_URL}/${id}`, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockInspectionTasksApi.delete(id);
        const response = await api.delete(`${BASE_URL}/${id}`);
        if (response.error) throw new Error(response.error.message || "Failed");
    }
};
