export const inspectionTypesKeys = {
    all: ["inspection-types"] as const,
    lists: () => [...inspectionTypesKeys.all, "list"] as const,
    list: (params?: any) => (params ? [...inspectionTypesKeys.lists(), params] as const : inspectionTypesKeys.lists()),
    detail: (id: string) => [...inspectionTypesKeys.all, "detail", id] as const,
};
