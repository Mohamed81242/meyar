import { useQuery } from "@tanstack/react-query";
import { sortingMechanismsApi } from "./sorting-mechanisms.api";
import { sortingMechanismsKeys } from "./sorting-mechanisms.keys";
import type { ListQueryParams } from "@/shared/api";

export function useSortingMechanismssList(params?: ListQueryParams) {
    return useQuery({
        queryKey: sortingMechanismsKeys.list(params),
        queryFn: ({ signal }) => sortingMechanismsApi.getList(params, signal),
    });
}

export function useSortingMechanisms(id: string) {
    return useQuery({
        queryKey: sortingMechanismsKeys.detail(id),
        queryFn: ({ signal }) => sortingMechanismsApi.getById(id, signal),
        enabled: !!id,
    });
}
