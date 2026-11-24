import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { leadsApi } from "./leads.api";
import { leadsKeys } from "./leads.keys";
import type { LeadsCountResponse, LeadsQueryParams } from "../types/landing.types";

/**
 * Fetch total count of leads for the landing page
 */
export function useLeadsCount(
    options?: Partial<UseQueryOptions<LeadsCountResponse, Error>>,
) {
    return useQuery({
        queryKey: leadsKeys.count(),
        queryFn: ({ signal }) => leadsApi.getLeadsCount(signal),
        placeholderData: (prev) => prev,
        ...options,
    });
}

/**
 * Fetch leads list with optional pagination/filters
 */
// export function useLeadsList(
//     params?: LeadsQueryParams,
//     options?: Partial<UseQueryOptions<{ items: any[]; pagination?: any }, Error>>,
// ) {
//     return useQuery({
//         queryKey: leadsKeys.list(params),
//         queryFn: ({ signal }) => leadsApi.getLeads(params, signal),
//         placeholderData: (prev) => prev,
//         ...options,
//     });
// }
