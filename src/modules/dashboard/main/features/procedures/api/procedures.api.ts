import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type { Procedure, ProcedureCreatePayload, ProcedureUpdatePayload } from "../types";
import { mockProceduresApi } from "./mock-data";

const BASE_URL = "/procedures";
const IS_MOCKDATA = true;

export const proceduresApi = {
    getList: async (params?: ListQueryParams, signal?: AbortSignal): Promise<PaginatedData<Procedure>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockProceduresApi.getList(params, signal);
        }

        const response = await api.get<ApiResponse<PaginatedData<Procedure>>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error) throw response.error;
        return response.data?.data as PaginatedData<Procedure>;
    },

    getById: async (id: string, signal?: AbortSignal): Promise<Procedure> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockProceduresApi.getById(id, signal) as Promise<Procedure>;
        }

        const response = await api.get<ApiResponse<Procedure>>(`${BASE_URL}/${id}`, { signal });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Not found");
        return response.data.data;
    },
    
    create: async (payload: ProcedureCreatePayload): Promise<Procedure> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockProceduresApi.create(payload);
        const response = await api.post<ApiResponse<Procedure>>(BASE_URL, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    update: async (id: string, payload: ProcedureUpdatePayload): Promise<Procedure> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockProceduresApi.update(id, payload);
        const response = await api.put<ApiResponse<Procedure>>(`${BASE_URL}/${id}`, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockProceduresApi.delete(id);
        const response = await api.delete(`${BASE_URL}/${id}`);
        if (response.error) throw new Error(response.error.message || "Failed");
    }
};
