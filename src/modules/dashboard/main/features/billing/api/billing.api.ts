import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import type {
    FinanceOverviewResponse,
    FinancialTransaction,
    WalletTransactionsResponse,
    WalletTransaction,
    FinanceQueryParams,
    WalletQueryParams,
    ApproveWalletPayload,
    RejectWalletPayload,
} from "../types";
import { mockBillingApi } from "./mock-data";

const USE_MOCK_DATA = false;
const FINANCE_URL = "/system-managements/finance";
const WALLET_TX_URL = "/system-managements/wallet-transactions";

export const billingApi = {
    /**
     * Get Finance Overview (KPIs + Monthly Revenue Chart + Recent Transactions)
     */
    getFinanceOverview: async (params?: FinanceQueryParams, signal?: AbortSignal): Promise<FinanceOverviewResponse> => {
        if (API_CONFIG.USE_MOCK_DATA || USE_MOCK_DATA) {
            return mockBillingApi.getFinanceOverview(params);
        }
        const response = await api.get<ApiResponse<FinanceOverviewResponse>>(FINANCE_URL, {
            params,
            signal,
        });
        if (response.error || !response.data?.data) {
            throw new Error(response.error?.message || "Failed to fetch finance overview");
        }
        return response.data.data;
    },

    /**
     * Get Platform Transactions list
     */
    getTransactions: async (params?: FinanceQueryParams, signal?: AbortSignal): Promise<{ items: FinancialTransaction[]; pagination: any }> => {
        if (API_CONFIG.USE_MOCK_DATA || USE_MOCK_DATA) {
            const overview = await mockBillingApi.getFinanceOverview(params);
            return overview.transactions;
        }
        const response = await api.get<ApiResponse<any>>(`${FINANCE_URL}/transactions`, {
            params,
            signal,
        });
        if (response.error || !response.data?.data) {
            throw new Error(response.error?.message || "Failed to fetch transactions");
        }
        return response.data.data;
    },

    /**
     * Get Wallet Transactions Queue
     */
    getWalletTransactions: async (params?: WalletQueryParams, signal?: AbortSignal): Promise<WalletTransactionsResponse> => {
        if (API_CONFIG.USE_MOCK_DATA || USE_MOCK_DATA) {
            return mockBillingApi.getWalletTransactions(params);
        }
        const response = await api.get<ApiResponse<WalletTransactionsResponse>>(WALLET_TX_URL, {
            params,
            signal,
        });
        if (response.error || !response.data?.data) {
            throw new Error(response.error?.message || "Failed to fetch wallet transactions queue");
        }
        return response.data.data;
    },

    /**
     * Approve Wallet Settlement Transaction
     */
    approveWalletTransaction: async (id: string | number, payload?: ApproveWalletPayload): Promise<WalletTransaction> => {
        if (API_CONFIG.USE_MOCK_DATA || USE_MOCK_DATA) {
            return mockBillingApi.approveWalletTransaction(id, payload?.notes);
        }
        const response = await api.post<ApiResponse<WalletTransaction>>(`${WALLET_TX_URL}/${id}/approve`, {
            notes: payload?.notes || "Approved by administrator",
        });
        if (response.error || !response.data?.data) {
            throw new Error(response.error?.message || "Failed to approve wallet transaction");
        }
        return response.data.data;
    },

    /**
     * Reject Wallet Settlement Transaction
     */
    rejectWalletTransaction: async (id: string | number, payload: RejectWalletPayload): Promise<WalletTransaction> => {
        if (API_CONFIG.USE_MOCK_DATA || USE_MOCK_DATA) {
            return mockBillingApi.rejectWalletTransaction(id, payload.notes);
        }
        const response = await api.post<ApiResponse<WalletTransaction>>(`${WALLET_TX_URL}/${id}/reject`, {
            notes: payload.notes,
        });
        if (response.error || !response.data?.data) {
            throw new Error(response.error?.message || "Failed to reject wallet transaction");
        }
        return response.data.data;
    },

    // Backward compatibility aliases
    getStats: async () => {
        const res = await billingApi.getFinanceOverview();
        return res.summary;
    },
    getMonthlyRevenue: async () => {
        const res = await billingApi.getFinanceOverview();
        return res.monthlyRevenue;
    },
    exportReport: async () => {
        return new Promise((resolve) => setTimeout(resolve, 800));
    },
};
