export const usersKeys = {
    all: ["users"] as const,
    lists: () => [...usersKeys.all, "list"] as const,
    list: (params?: any) => (params ? [...usersKeys.lists(), params] as const : usersKeys.lists()),
    detail: (id: string) => [...usersKeys.all, "detail", id] as const,
};
