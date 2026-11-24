export const companyClassificationsKeys = {
    all: ["company-classifications"] as const,
    lists: () => [...companyClassificationsKeys.all, "list"] as const,
    list: (params?: any) => (params ? [...companyClassificationsKeys.lists(), params] as const : companyClassificationsKeys.lists()),
    detail: (id: string) => [...companyClassificationsKeys.all, "detail", id] as const,
};
