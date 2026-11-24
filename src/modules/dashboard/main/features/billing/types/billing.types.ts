import type { ListQueryParams } from "@/shared/api";

export type TransactionType =
    | "commission"
    | "subscription"
    | "delegation_commission"
    | "advertisement"
    | "refund";

export type TransactionStatus =
    | "completed"
    | "pending"
    | "failed"
    | "refunded"
    | "successful";

export type WalletTransactionType = "credit" | "debit";
export type WalletTransactionStatus = "pending" | "completed" | "rejected";

export interface TransactionUser {
    id: number | string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    isActive: boolean;
    title: string | null;
    barRegistrationNumber: string | null;
    barBranch: string | null;
    verificationStatus: string;
    walletBalance: string | number;
    avatarPath?: string | null;
}

export interface FinancialTransaction {
    id: number | string;
    userId: number | string;
    reference: string;
    type: TransactionType | string;
    amount: string | number;
    status: TransactionStatus;
    occurredAt: string;
    metadata?: {
        service?: string;
        [key: string]: unknown;
    };
    createdAt: string;
    updatedAt: string;
    user?: TransactionUser;
    // Backward compatibility aliases
    lawyerName?: string;
    currency?: string;
    dateFormatted?: string;
}

export interface WalletTransaction {
    id: number | string;
    userId: number | string;
    reference: string;
    type: WalletTransactionType;
    amount: string | number;
    status: WalletTransactionStatus;
    notes?: string | null;
    occurredAt: string;
    createdAt: string;
    updatedAt: string;
    user?: TransactionUser;
}

export interface MonthlyRevenueData {
    period: string;
    amount: number;
    // Backward compatibility
    month?: string;
    revenue?: number;
}

export interface FinanceSummary {
    annualRevenue: number;
    pendingPayments: number;
    platformCommissionPercent: number;
    refundedAmount: number;
    currency: string;
    // Backward compatibility
    revenueGrowth?: number;
    platformCommission?: number;
    refundedAmounts?: number;
}

export interface FinanceOverviewResponse {
    summary: FinanceSummary;
    monthlyRevenue: MonthlyRevenueData[];
    transactions: {
        items: FinancialTransaction[];
        pagination: {
            currentPage: number;
            lastPage: number;
            perPage: number;
            total: number;
        };
    };
}

export interface WalletTransactionsResponse {
    items: WalletTransaction[];
    pagination: {
        currentPage: number;
        lastPage: number;
        perPage: number;
        total: number;
    };
}

export interface FinanceQueryParams extends ListQueryParams {
    search?: string;
    type?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    perPage?: number;
    [key: string]: unknown;
}

export interface WalletQueryParams extends ListQueryParams {
    status?: WalletTransactionStatus | string;
    type?: WalletTransactionType | string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    perPage?: number;
    [key: string]: unknown;
}

export interface ApproveWalletPayload {
    notes?: string;
}

export interface RejectWalletPayload {
    notes: string;
}

// Backward compatibility aliases
export type BillingStats = FinanceSummary;
export type RevenueCategory = "subscriptions" | "poa" | "ads" | string;
export type BillingQueryParams = FinanceQueryParams;
