import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type { EvaluationOptions, EvaluationOptionsCreatePayload, EvaluationOptionsUpdatePayload } from "../types";
import { mockEvaluationOptionsApi } from "./mock-data";

const BASE_URL = "/evaluation-options";
const IS_MOCKDATA = true;

export const evaluationOptionsApi = {
    getList: async (params?: ListQueryParams, signal?: AbortSignal): Promise<PaginatedData<EvaluationOptions>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockEvaluationOptionsApi.getList(params, signal);
        }

        const response = await api.get<ApiResponse<PaginatedData<EvaluationOptions>>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error) throw response.error;
        return response.data?.data as PaginatedData<EvaluationOptions>;
    },

    getById: async (id: string, signal?: AbortSignal): Promise<EvaluationOptions> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockEvaluationOptionsApi.getById(id, signal) as Promise<EvaluationOptions>;
        }

        const response = await api.get<ApiResponse<EvaluationOptions>>(`${BASE_URL}/${id}`, { signal });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Not found");
        return response.data.data;
    },
    
    create: async (payload: EvaluationOptionsCreatePayload): Promise<EvaluationOptions> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockEvaluationOptionsApi.create(payload);
        const response = await api.post<ApiResponse<EvaluationOptions>>(BASE_URL, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    update: async (id: string, payload: EvaluationOptionsUpdatePayload): Promise<EvaluationOptions> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockEvaluationOptionsApi.update(id, payload);
        const response = await api.put<ApiResponse<EvaluationOptions>>(`${BASE_URL}/${id}`, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockEvaluationOptionsApi.delete(id);
        const response = await api.delete(`${BASE_URL}/${id}`);
        if (response.error) throw new Error(response.error.message || "Failed");
    }
};
