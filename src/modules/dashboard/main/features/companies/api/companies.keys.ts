export const companiesKeys = {
    all: ["companies"] as const,
    lists: () => [...companiesKeys.all, "list"] as const,
    list: (params?: any) => (params ? [...companiesKeys.lists(), params] as const : companiesKeys.lists()),
    detail: (id: string) => [...companiesKeys.all, "detail", id] as const,
};
