import { useQuery } from "@tanstack/react-query";
import { proceduresApi } from "./procedures.api";
import { proceduresKeys } from "./procedures.keys";
import type { ListQueryParams } from "@/shared/api";

export function useProceduressList(params?: ListQueryParams) {
    return useQuery({
        queryKey: proceduresKeys.list(params),
        queryFn: ({ signal }) => proceduresApi.getList(params, signal),
    });
}

export function useProcedures(id: string) {
    return useQuery({
        queryKey: proceduresKeys.detail(id),
        queryFn: ({ signal }) => proceduresApi.getById(id, signal),
        enabled: !!id,
    });
}
