export const sortingMechanismsKeys = {
    all: ["sorting-mechanisms"] as const,
    lists: () => [...sortingMechanismsKeys.all, "list"] as const,
    list: (params?: any) => (params ? [...sortingMechanismsKeys.lists(), params] as const : sortingMechanismsKeys.lists()),
    detail: (id: string) => [...sortingMechanismsKeys.all, "detail", id] as const,
};
