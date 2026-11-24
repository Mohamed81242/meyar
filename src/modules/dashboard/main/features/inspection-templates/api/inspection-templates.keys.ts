export const inspectionTemplatesKeys = {
    all: ["inspection-templates"] as const,
    lists: () => [...inspectionTemplatesKeys.all, "list"] as const,
    list: (params?: any) => (params ? [...inspectionTemplatesKeys.lists(), params] as const : inspectionTemplatesKeys.lists()),
    detail: (id: string) => [...inspectionTemplatesKeys.all, "detail", id] as const,
};
