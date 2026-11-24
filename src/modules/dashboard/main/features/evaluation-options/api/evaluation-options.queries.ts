import { useQuery } from "@tanstack/react-query";
import { evaluationOptionsApi } from "./evaluation-options.api";
import { evaluationOptionsKeys } from "./evaluation-options.keys";
import type { ListQueryParams } from "@/shared/api";

export function useEvaluationOptionssList(params?: ListQueryParams) {
    return useQuery({
        queryKey: evaluationOptionsKeys.list(params),
        queryFn: ({ signal }) => evaluationOptionsApi.getList(params, signal),
    });
}

export function useEvaluationOptions(id: string) {
    return useQuery({
        queryKey: evaluationOptionsKeys.detail(id),
        queryFn: ({ signal }) => evaluationOptionsApi.getById(id, signal),
        enabled: !!id,
    });
}
