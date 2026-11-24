import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type {
    InspectionTask,
    InspectionTaskCreatePayload,
    InspectionTaskUpdatePayload,
} from "../types";
import { mockInspectionTasksApi } from "./mock-data";

const BASE_URL = "/inspection-tasks";
const IS_MOCKDATA = true;

export const inspectionTasksApi = {
    getList: async (
        params?: ListQueryParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<InspectionTask>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockInspectionTasksApi.getList(params, signal);
        }

        const response = await api.get<ApiResponse<PaginatedData<InspectionTask>>>(
            BASE_URL,
            {
                params,
                signal,
            }
        );

        if (response.error) throw response.error;
        return response.data?.data as PaginatedData<InspectionTask>;
    },

    getById: async (id: string, signal?: AbortSignal): Promise<InspectionTask> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockInspectionTasksApi.getById(id, signal) as Promise<InspectionTask>;
        }

        const response = await api.get<ApiResponse<InspectionTask>>(`${BASE_URL}/${id}`, {
            signal,
        });
        if (response.error || !response.data?.data)
            throw new Error(response.error?.message || "Not found");
        return response.data.data;
    },

    create: async (
        payload: InspectionTaskCreatePayload
    ): Promise<InspectionTask> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA)
            return mockInspectionTasksApi.create(payload);
        const response = await api.post<ApiResponse<InspectionTask>>(BASE_URL, payload);
        if (response.error || !response.data?.data)
            throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    update: async (
        id: string,
        payload: InspectionTaskUpdatePayload
    ): Promise<InspectionTask> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA)
            return mockInspectionTasksApi.update(id, payload);
        const response = await api.put<ApiResponse<InspectionTask>>(
            `${BASE_URL}/${id}`,
            payload
        );
        if (response.error || !response.data?.data)
            throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA)
            return mockInspectionTasksApi.delete(id);
        const response = await api.delete<ApiResponse<void>>(`${BASE_URL}/${id}`);
        if (response.error) throw response.error;
    },
};
