export const rolesAndPermissionsKeys = {
    all: ["roles-and-permissions"] as const,
    lists: () => [...rolesAndPermissionsKeys.all, "list"] as const,
    list: (params?: any) => (params ? [...rolesAndPermissionsKeys.lists(), params] as const : rolesAndPermissionsKeys.lists()),
    detail: (id: string) => [...rolesAndPermissionsKeys.all, "detail", id] as const,
};
