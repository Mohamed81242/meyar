import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingApi } from "./billing.api";
import { billingKeys } from "./billing.keys";
import type { ApproveWalletPayload, RejectWalletPayload } from "../types";

export function useApproveWalletTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string | number; payload?: ApproveWalletPayload }) =>
            billingApi.approveWalletTransaction(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: billingKeys.all });
        },
    });
}

export function useRejectWalletTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string | number; payload: RejectWalletPayload }) =>
            billingApi.rejectWalletTransaction(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: billingKeys.all });
        },
    });
}

export function useExportFinancialReport() {
    return useMutation({
        mutationFn: () => billingApi.exportReport(),
    });
}
