export const companyTagsKeys = {
    all: ["company-tags"] as const,
    lists: () => [...companyTagsKeys.all, "list"] as const,
    list: (params?: any) => (params ? [...companyTagsKeys.lists(), params] as const : companyTagsKeys.lists()),
    detail: (id: string) => [...companyTagsKeys.all, "detail", id] as const,
};
