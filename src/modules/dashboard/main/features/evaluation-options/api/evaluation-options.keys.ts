export const evaluationOptionsKeys = {
    all: ["evaluation-options"] as const,
    lists: () => [...evaluationOptionsKeys.all, "list"] as const,
    list: (params?: any) => (params ? [...evaluationOptionsKeys.lists(), params] as const : evaluationOptionsKeys.lists()),
    detail: (id: string) => [...evaluationOptionsKeys.all, "detail", id] as const,
};
