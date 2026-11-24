export const foldersOrClassificationsKeys = {
    all: ["folders-or-classifications"] as const,
    lists: () => [...foldersOrClassificationsKeys.all, "list"] as const,
    list: (params?: any) => (params ? [...foldersOrClassificationsKeys.lists(), params] as const : foldersOrClassificationsKeys.lists()),
    detail: (id: string) => [...foldersOrClassificationsKeys.all, "detail", id] as const,
};
