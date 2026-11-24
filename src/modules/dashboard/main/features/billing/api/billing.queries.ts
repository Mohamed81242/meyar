import { useQuery } from "@tanstack/react-query";
import { billingApi } from "./billing.api";
import { billingKeys } from "./billing.keys";
import type { FinanceQueryParams, WalletQueryParams } from "../types";

export const useFinanceOverview = (params?: FinanceQueryParams) => {
    return useQuery({
        queryKey: billingKeys.financeOverview(params),
        queryFn: ({ signal }) => billingApi.getFinanceOverview(params, signal),
    });
};

export const useWalletTransactions = (params?: WalletQueryParams) => {
    return useQuery({
        queryKey: billingKeys.walletTransactions(params),
        queryFn: ({ signal }) => billingApi.getWalletTransactions(params, signal),
    });
};

// Backward compatibility hooks
export const useBillingStats = () => {
    return useQuery({
        queryKey: billingKeys.stats(),
        queryFn: () => billingApi.getStats(),
    });
};

export const useMonthlyRevenueChart = (_category?: string) => {
    return useQuery({
        queryKey: billingKeys.chart(_category),
        queryFn: () => billingApi.getMonthlyRevenue(),
    });
};

export const useFinancialTransactions = (params?: FinanceQueryParams) => {
    return useQuery({
        queryKey: billingKeys.transactions(params),
        queryFn: ({ signal }) => billingApi.getTransactions(params, signal),
    });
};
