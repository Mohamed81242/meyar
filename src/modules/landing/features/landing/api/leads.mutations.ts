import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsApi } from "./leads.api";
import { leadsKeys } from "./leads.keys";
import type { CreateLeadPayload, Lead } from "../types/landing.types";

/**
 * Mutation to submit a new lead from the landing waitlist form
 */
export function useCreateLead() {
    const queryClient = useQueryClient();

    return useMutation<Lead, Error, CreateLeadPayload>({
        mutationFn: (payload: CreateLeadPayload) => leadsApi.createLead(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: leadsKeys.all });
            queryClient.invalidateQueries({ queryKey: leadsKeys.count() });
        },
    });
}
