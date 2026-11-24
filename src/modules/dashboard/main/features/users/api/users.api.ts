import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type { Users, UsersCreatePayload, UsersUpdatePayload } from "../types";
import { mockUsersApi } from "./mock-data";

const BASE_URL = "/users";
const IS_MOCKDATA = true;

export const usersApi = {
    getList: async (params?: ListQueryParams, signal?: AbortSignal): Promise<PaginatedData<Users>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockUsersApi.getList(params, signal);
        }

        const response = await api.get<ApiResponse<PaginatedData<Users>>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error) throw response.error;
        return response.data?.data as PaginatedData<Users>;
    },

    getById: async (id: string, signal?: AbortSignal): Promise<Users> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockUsersApi.getById(id, signal) as Promise<Users>;
        }

        const response = await api.get<ApiResponse<Users>>(`${BASE_URL}/${id}`, { signal });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Not found");
        return response.data.data;
    },
    
    create: async (payload: UsersCreatePayload): Promise<Users> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockUsersApi.create(payload);
        const response = await api.post<ApiResponse<Users>>(BASE_URL, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    update: async (id: string, payload: UsersUpdatePayload): Promise<Users> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockUsersApi.update(id, payload);
        const response = await api.put<ApiResponse<Users>>(`${BASE_URL}/${id}`, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockUsersApi.delete(id);
        const response = await api.delete(`${BASE_URL}/${id}`);
        if (response.error) throw new Error(response.error.message || "Failed");
    }
};
