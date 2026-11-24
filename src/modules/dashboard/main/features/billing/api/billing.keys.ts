export const billingKeys = {
    all: ["billing"] as const,
    finance: () => [...billingKeys.all, "finance"] as const,
    financeOverview: (params?: any) => (params ? [...billingKeys.finance(), params] as const : billingKeys.finance()),
    transactions: (params?: any) => [...billingKeys.all, "transactions", params] as const,
    walletTransactions: (params?: any) => [...billingKeys.all, "wallet-transactions", params] as const,
    // Backward compatibility aliases
    stats: () => [...billingKeys.all, "stats"] as const,
    chart: (category?: string) => [...billingKeys.all, "chart", category] as const,
};
