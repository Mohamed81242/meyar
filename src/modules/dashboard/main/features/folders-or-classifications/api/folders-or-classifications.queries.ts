import { useQuery } from "@tanstack/react-query";
import { foldersOrClassificationsApi } from "./folders-or-classifications.api";
import { foldersOrClassificationsKeys } from "./folders-or-classifications.keys";
import type { ListQueryParams } from "@/shared/api";

export function useFoldersOrClassificationssList(params?: ListQueryParams) {
    return useQuery({
        queryKey: foldersOrClassificationsKeys.list(params),
        queryFn: ({ signal }) => foldersOrClassificationsApi.getList(params, signal),
    });
}

export function useFoldersOrClassifications(id: string) {
    return useQuery({
        queryKey: foldersOrClassificationsKeys.detail(id),
        queryFn: ({ signal }) => foldersOrClassificationsApi.getById(id, signal),
        enabled: !!id,
    });
}
