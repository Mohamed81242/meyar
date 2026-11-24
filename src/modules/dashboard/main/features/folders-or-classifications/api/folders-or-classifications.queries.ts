import { useQuery } from "@tanstack/react-query";
import { foldersOrClassificationsApi } from "./folders-or-classifications.api";
import { foldersOrClassificationsKeys } from "./folders-or-classifications.keys";
import type { ListQueryParams } from "@/shared/api";

export function useFoldersOrClassificationsList(params?: ListQueryParams) {
    return useQuery({
        queryKey: foldersOrClassificationsKeys.list(params),
        queryFn: ({ signal }) => foldersOrClassificationsApi.getList(params, signal),
    });
}

// Backwards compatibility alias
export const useFoldersOrClassificationssList = useFoldersOrClassificationsList;

export function useFoldersOrClassification(id: string) {
    return useQuery({
        queryKey: foldersOrClassificationsKeys.detail(id),
        queryFn: ({ signal }) => foldersOrClassificationsApi.getById(id, signal),
        enabled: Boolean(id),
    });
}

export const useFoldersOrClassifications = useFoldersOrClassification;
