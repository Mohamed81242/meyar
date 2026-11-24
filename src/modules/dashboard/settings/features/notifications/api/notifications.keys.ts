export const notificationsKeys = {
    all: ["notifications"] as const,
    rules: () => [...notificationsKeys.all, "rules"] as const,
    ruleList: (params?: any) => (params ? [...notificationsKeys.rules(), params] as const : notificationsKeys.rules()),
    logs: () => [...notificationsKeys.all, "logs"] as const,
    logList: (params?: any) => (params ? [...notificationsKeys.logs(), params] as const : notificationsKeys.logs()),
    // Backward compatibility
    lists: () => notificationsKeys.rules(),
    list: (params?: any) => notificationsKeys.ruleList(params),
};
