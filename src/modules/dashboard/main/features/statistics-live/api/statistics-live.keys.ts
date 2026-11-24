export const statisticsLiveKeys = {
    all: ["statistics-live"] as const,
    lists: () => [...statisticsLiveKeys.all, "list"] as const,
    list: (params?: any) => (params ? [...statisticsLiveKeys.lists(), params] as const : statisticsLiveKeys.lists()),
    detail: (id: string) => [...statisticsLiveKeys.all, "detail", id] as const,
};
