import type {
    FinancialTransaction,
    FinanceOverviewResponse,
    WalletTransaction,
    WalletTransactionsResponse,
    FinanceQueryParams,
    WalletQueryParams,
} from "../types";

export let mockFinancialTransactions: FinancialTransaction[] = [
    {
        id: 1,
        userId: 1,
        reference: "588da9ef-fce4-4e97-be74-36dc149f585a",
        type: "commission",
        amount: "75.00",
        status: "completed",
        occurredAt: "2026/10/14 , 08:19:28 PM",
        metadata: {
            service: "meayar_subscription",
        },
        createdAt: "2026/10/14 , 08:19:28 PM",
        updatedAt: "2026/10/14 , 09:02:52 PM",
        user: {
            id: 1,
            firstName: "عبدالرحمن",
            lastName: "قاسم",
            name: "عبدالرحمن قاسم",
            email: "abuqasim1427@gmail.com",
            phone: "+966 552818590",
            role: "أدمن",
            isActive: true,
            title: "أدمن النظام",
            barRegistrationNumber: "100000",
            barBranch: "الرياض",
            verificationStatus: "verified",
            walletBalance: "1500.00",
        },
    },
    {
        id: 2,
        userId: 2,
        reference: "81ee0e23-1bfa-4fe5-81ae-271d8878fcf6",
        type: "commission",
        amount: "75.00",
        status: "completed",
        occurredAt: "2026/08/26 , 02:35:26 AM",
        metadata: {
            service: "meayar_subscription",
        },
        createdAt: "2026/08/26 , 02:35:26 AM",
        updatedAt: "2026/08/26 , 02:35:26 AM",
        user: {
            id: 2,
            firstName: "فراس",
            lastName: "حافظ",
            name: "فراس حافظ",
            email: "rmz.alemtithal@gmail.com",
            phone: "+966 500000000",
            role: "أدمن",
            isActive: true,
            title: "أدمن المنصة",
            barRegistrationNumber: "100153",
            barBranch: "جدة",
            verificationStatus: "verified",
            walletBalance: "2300.00",
        },
    },
];

export let mockWalletTransactions: WalletTransaction[] = [
    {
        id: 101,
        userId: 2,
        reference: "WTX-2026-00101",
        type: "credit",
        amount: "2500.00",
        status: "pending",
        notes: "إيداع عبر فودافون كاش لشحن محفظة التوكيلات",
        occurredAt: "2026-08-16T09:30:00.000000Z",
        createdAt: "2026-08-16T09:30:00.000000Z",
        updatedAt: "2026-08-16T09:30:00.000000Z",
        user: mockFinancialTransactions[0].user,
    },
    {
        id: 102,
        userId: 3,
        reference: "WTX-2026-00102",
        type: "debit",
        amount: "1000.00",
        status: "pending",
        notes: "طلب سحب رصيد أتعاب توثيق لحساب بنك مصر",
        occurredAt: "2026-08-15T14:15:00.000000Z",
        createdAt: "2026-08-15T14:15:00.000000Z",
        updatedAt: "2026-08-15T14:15:00.000000Z",
        user: mockFinancialTransactions[1].user,
    },
    {
        id: 103,
        userId: 6,
        reference: "WTX-2026-00103",
        type: "credit",
        amount: "5000.00",
        status: "completed",
        notes: "تحويل بنكي مباشر معتمد",
        occurredAt: "2026-08-12T11:00:00.000000Z",
        createdAt: "2026-08-12T11:00:00.000000Z",
        updatedAt: "2026-08-12T11:30:00.000000Z",
        user: mockFinancialTransactions[1]?.user || mockFinancialTransactions[0]?.user,
    },
];

export const mockBillingApi = {
    getFinanceOverview: async (params?: FinanceQueryParams): Promise<FinanceOverviewResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, perPage = 20, search, type, status } = params || {};
                let filtered = [...mockFinancialTransactions];

                if (type && type !== "all") {
                    filtered = filtered.filter((t) => t.type === type);
                }

                if (status && status !== "all") {
                    filtered = filtered.filter((t) => t.status === status);
                }

                if (search && search.trim()) {
                    const q = search.toLowerCase().trim();
                    filtered = filtered.filter(
                        (t) =>
                            t.reference.toLowerCase().includes(q) ||
                            (t.user && t.user.name.toLowerCase().includes(q)) ||
                            (t.user && t.user.email.toLowerCase().includes(q))
                    );
                }

                const p = Number(page);
                const limit = Number(perPage);
                const start = (p - 1) * limit;
                const paginatedItems = filtered.slice(start, start + limit);

                resolve({
                    summary: {
                        annualRevenue: 600,
                        pendingPayments: 0,
                        platformCommissionPercent: 15,
                        refundedAmount: 0,
                        currency: "EGP",
                    },
                    monthlyRevenue: [
                        { period: "2026-03", amount: 0, month: "Mar", revenue: 0 },
                        { period: "2026-04", amount: 0, month: "Apr", revenue: 0 },
                        { period: "2026-05", amount: 75, month: "May", revenue: 75 },
                        { period: "2026-06", amount: 375, month: "Jun", revenue: 375 },
                        { period: "2026-07", amount: 150, month: "Jul", revenue: 150 },
                        { period: "2026-08", amount: 0, month: "Aug", revenue: 0 },
                    ],
                    transactions: {
                        items: paginatedItems,
                        pagination: {
                            currentPage: p,
                            lastPage: Math.ceil(filtered.length / limit) || 1,
                            perPage: limit,
                            total: filtered.length,
                        },
                    },
                });
            }, 250);
        });
    },

    getWalletTransactions: async (params?: WalletQueryParams): Promise<WalletTransactionsResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, perPage = 20, search, status, type } = params || {};
                let filtered = [...mockWalletTransactions];

                if (status && status !== "all") {
                    filtered = filtered.filter((w) => w.status === status);
                }

                if (type && type !== "all") {
                    filtered = filtered.filter((w) => w.type === type);
                }

                if (search && search.trim()) {
                    const q = search.toLowerCase().trim();
                    filtered = filtered.filter(
                        (w) =>
                            w.reference.toLowerCase().includes(q) ||
                            (w.user && w.user.name.toLowerCase().includes(q)) ||
                            (w.notes && w.notes.toLowerCase().includes(q))
                    );
                }

                const p = Number(page);
                const limit = Number(perPage);
                const start = (p - 1) * limit;
                const paginatedItems = filtered.slice(start, start + limit);

                resolve({
                    items: paginatedItems,
                    pagination: {
                        currentPage: p,
                        lastPage: Math.ceil(filtered.length / limit) || 1,
                        perPage: limit,
                        total: filtered.length,
                    },
                });
            }, 250);
        });
    },

    approveWalletTransaction: async (id: string | number, notes?: string): Promise<WalletTransaction> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockWalletTransactions.findIndex((w) => String(w.id) === String(id));
                if (index === -1) return reject(new Error("Transaction not found"));

                const current = mockWalletTransactions[index];
                const updated: WalletTransaction = {
                    ...current,
                    status: "completed",
                    notes: notes || current.notes || "Approved by finance manager",
                    updatedAt: new Date().toISOString(),
                };

                mockWalletTransactions[index] = updated;
                resolve(updated);
            }, 300);
        });
    },

    rejectWalletTransaction: async (id: string | number, notes: string): Promise<WalletTransaction> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockWalletTransactions.findIndex((w) => String(w.id) === String(id));
                if (index === -1) return reject(new Error("Transaction not found"));

                const current = mockWalletTransactions[index];
                const updated: WalletTransaction = {
                    ...current,
                    status: "rejected",
                    notes: notes || "Rejected by finance manager",
                    updatedAt: new Date().toISOString(),
                };

                mockWalletTransactions[index] = updated;
                resolve(updated);
            }, 300);
        });
    },
};
