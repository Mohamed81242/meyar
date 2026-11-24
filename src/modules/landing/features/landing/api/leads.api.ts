import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api";
import type {
    CreateLeadPayload,
    Lead,
    LeadsCountResponse,
    LeadsQueryParams,
} from "../types/landing.types";

const LEADS_URL = "/leads";

export const leadsApi = {
    /**
     * Get count of registered leads / waitlist
     */
    getLeadsCount: async (signal?: AbortSignal): Promise<LeadsCountResponse> => {
        const response = await api.get<ApiResponse<any>>(LEADS_URL+"/count", {
            signal,
            meta: { auth: "none" },
        });
        if (response.error || !response.data?.data) {
            throw new Error(response.error?.message || "Failed to fetch leads count");
        }

        const data = response.data.data;
        if (typeof data === "number") {
            return { count: data, total: data };
        }

        const count =
            data.count ??
            data.total ??
            data.pagination?.total ??
            (Array.isArray(data) ? data.length : 0);

        return { count, total: data.total ?? count };
    },

    /**
     * Create new lead (Register interest)
     */
    createLead: async (payload: CreateLeadPayload): Promise<Lead> => {
        const response = await api.post<ApiResponse<Lead>>(LEADS_URL+"/form", payload, {
            meta: { auth: "none" },
        });
        if (response.error || !response.data?.data) {
            throw new Error(response.error?.message || "Failed to create lead");
        }
        return response.data.data;
    },

    /**
     * Get Leads List
     */
    // getLeads: async (
    //     params?: LeadsQueryParams,
    //     signal?: AbortSignal,
    // ): Promise<{ items: Lead[]; pagination?: any }> => {
    //     const response = await api.get<ApiResponse<any>>(LEADS_URL+"/count", {
    //         params,
    //         signal,
    //         meta: { auth: "none" },
    //     });
    //     if (response.error || !response.data?.data) {
    //         throw new Error(response.error?.message || "Failed to fetch leads");
    //     }

    //     const data = response.data.data;
    //     if (Array.isArray(data)) {
    //         return { items: data };
    //     }
    //     return {
    //         items: data.items || data.data || [],
    //         pagination: data.pagination,
    //     };
    // },
};
