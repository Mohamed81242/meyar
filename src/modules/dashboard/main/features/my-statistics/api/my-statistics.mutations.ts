import { useMutation, useQueryClient } from "@tanstack/react-query";
import { myStatisticsApi } from "./my-statistics.api";
import { myStatisticsKeys } from "./my-statistics.keys";
import { toast } from "sonner";

export function useRefreshMyStatistics() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: myStatisticsApi.refresh,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: myStatisticsKeys.all });
            toast.success("Statistics updated");
        },
        onError: () => {
            toast.error("Failed to refresh statistics");
        },
    });
}
