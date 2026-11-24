export const proceduresKeys = {
    all: ["procedures"] as const,
    lists: () => [...proceduresKeys.all, "list"] as const,
    list: (params?: any) => (params ? [...proceduresKeys.lists(), params] as const : proceduresKeys.lists()),
    detail: (id: string) => [...proceduresKeys.all, "detail", id] as const,
};
