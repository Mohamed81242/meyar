export const inspectionTasksKeys = {
    all: ["inspection-tasks"] as const,
    lists: () => [...inspectionTasksKeys.all, "list"] as const,
    list: (params?: any) => (params ? [...inspectionTasksKeys.lists(), params] as const : inspectionTasksKeys.lists()),
    detail: (id: string) => [...inspectionTasksKeys.all, "detail", id] as const,
};
