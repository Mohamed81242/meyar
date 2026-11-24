import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type {
    InspectionTemplate,
    InspectionTemplateCreatePayload,
    InspectionTemplateUpdatePayload,
} from "../types";
import { mockInspectionTemplatesApi } from "./mock-data";

const BASE_URL = "/inspection-templates";
const IS_MOCKDATA = true;

export const inspectionTemplatesApi = {
    getList: async (
        params?: ListQueryParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<InspectionTemplate>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockInspectionTemplatesApi.getList(params, signal);
        }

        const response = await api.get<ApiResponse<PaginatedData<InspectionTemplate>>>(
            BASE_URL,
            {
                params,
                signal,
            }
        );

        if (response.error) throw response.error;
        return response.data?.data as PaginatedData<InspectionTemplate>;
    },

    getById: async (id: string, signal?: AbortSignal): Promise<InspectionTemplate> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockInspectionTemplatesApi.getById(id, signal) as Promise<InspectionTemplate>;
        }

        const response = await api.get<ApiResponse<InspectionTemplate>>(`${BASE_URL}/${id}`, {
            signal,
        });
        if (response.error || !response.data?.data)
            throw new Error(response.error?.message || "Not found");
        return response.data.data;
    },

    create: async (
        payload: InspectionTemplateCreatePayload
    ): Promise<InspectionTemplate> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA)
            return mockInspectionTemplatesApi.create(payload);
        const response = await api.post<ApiResponse<InspectionTemplate>>(BASE_URL, payload);
        if (response.error || !response.data?.data)
            throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    update: async (
        id: string,
        payload: InspectionTemplateUpdatePayload
    ): Promise<InspectionTemplate> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA)
            return mockInspectionTemplatesApi.update(id, payload);
        const response = await api.put<ApiResponse<InspectionTemplate>>(
            `${BASE_URL}/${id}`,
            payload
        );
        if (response.error || !response.data?.data)
            throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA)
            return mockInspectionTemplatesApi.delete(id);
        const response = await api.delete<ApiResponse<void>>(`${BASE_URL}/${id}`);
        if (response.error) throw response.error;
    },
};
