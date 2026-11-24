import { useQuery } from "@tanstack/react-query";
import { usersApi } from "./users.api";
import { usersKeys } from "./users.keys";
import type { ListQueryParams } from "@/shared/api";

export function useUserssList(params?: ListQueryParams) {
    return useQuery({
        queryKey: usersKeys.list(params),
        queryFn: ({ signal }) => usersApi.getList(params, signal),
    });
}

export function useUsers(id: string) {
    return useQuery({
        queryKey: usersKeys.detail(id),
        queryFn: ({ signal }) => usersApi.getById(id, signal),
        enabled: !!id,
    });
}
