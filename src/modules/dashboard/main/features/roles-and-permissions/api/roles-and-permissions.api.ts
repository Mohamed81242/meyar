import { api } from "@/shared/api/client";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type { RolesAndPermissions, RolesAndPermissionsCreatePayload, RolesAndPermissionsUpdatePayload } from "../types";
import { mockRolesAndPermissionsApi } from "./mock-data";

const BASE_URL = "/roles-and-permissions";
const IS_MOCKDATA = true;

export const rolesAndPermissionsApi = {
    getList: async (params?: ListQueryParams, signal?: AbortSignal): Promise<PaginatedData<RolesAndPermissions>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockRolesAndPermissionsApi.getList(params, signal);
        }

        const response = await api.get<ApiResponse<PaginatedData<RolesAndPermissions>>>(BASE_URL, {
            params,
            signal,
        });

        if (response.error) throw response.error;
        return response.data?.data as PaginatedData<RolesAndPermissions>;
    },

    getById: async (id: string, signal?: AbortSignal): Promise<RolesAndPermissions> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mockRolesAndPermissionsApi.getById(id, signal) as Promise<RolesAndPermissions>;
        }

        const response = await api.get<ApiResponse<RolesAndPermissions>>(`${BASE_URL}/${id}`, { signal });
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Not found");
        return response.data.data;
    },
    
    create: async (payload: RolesAndPermissionsCreatePayload): Promise<RolesAndPermissions> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockRolesAndPermissionsApi.create(payload);
        const response = await api.post<ApiResponse<RolesAndPermissions>>(BASE_URL, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    update: async (id: string, payload: RolesAndPermissionsUpdatePayload): Promise<RolesAndPermissions> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockRolesAndPermissionsApi.update(id, payload);
        const response = await api.put<ApiResponse<RolesAndPermissions>>(`${BASE_URL}/${id}`, payload);
        if (response.error || !response.data?.data) throw new Error(response.error?.message || "Failed");
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mockRolesAndPermissionsApi.delete(id);
        const response = await api.delete(`${BASE_URL}/${id}`);
        if (response.error) throw new Error(response.error.message || "Failed");
    }
};
