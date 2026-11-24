export const registrationOfCompaniesKeys = {
    all: ["registration-of-companies"] as const,
    lists: () => [...registrationOfCompaniesKeys.all, "list"] as const,
    list: (params?: any) => (params ? [...registrationOfCompaniesKeys.lists(), params] as const : registrationOfCompaniesKeys.lists()),
    detail: (id: string) => [...registrationOfCompaniesKeys.all, "detail", id] as const,
};
