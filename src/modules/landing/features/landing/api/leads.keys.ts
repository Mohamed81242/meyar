export const leadsKeys = {
    all: ["leads"] as const,
    count: () => [...leadsKeys.all, "count"] as const,
    lists: () => [...leadsKeys.all, "list"] as const,
    list: (params?: unknown) =>
        params ? ([...leadsKeys.lists(), params] as const) : leadsKeys.lists(),
    details: () => [...leadsKeys.all, "detail"] as const,
    detail: (id: string | number) => [...leadsKeys.details(), id] as const,
};

export type LeadsQueryKey =
    | typeof leadsKeys.all
    | ReturnType<typeof leadsKeys.count>
    | ReturnType<typeof leadsKeys.lists>
    | ReturnType<typeof leadsKeys.list>
    | ReturnType<typeof leadsKeys.details>
    | ReturnType<typeof leadsKeys.detail>;
