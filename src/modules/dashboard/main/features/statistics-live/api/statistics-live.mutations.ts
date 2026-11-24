import { useMutation } from "@tanstack/react-query";
import { statisticsLiveApi } from "./statistics-live.api";
import { toast } from "sonner";

export function useExportStatisticsReport() {
    return useMutation({
        mutationFn: (format: "excel" | "pdf") => statisticsLiveApi.exportReport(format),
        onSuccess: (data) => {
            toast.success("Report generated successfully");
            if (data.downloadUrl && data.downloadUrl !== "#") {
                window.open(data.downloadUrl, "_blank");
            }
        },
        onError: () => {
            toast.error("Failed to export report");
        },
    });
}
