import { LoadingProvider } from "@/contexts/LoadingContext";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TourProvider } from "goguide";
import { toursConfig } from "@/lib/toursConfig";
import type { ReactNode } from "react";

function Providers({ children }: { children: ReactNode }) {
    return (
        <LoadingProvider>
            <QueryClientProvider client={queryClient}>
                <TourProvider config={toursConfig}>
                    {children}
                </TourProvider>
            </QueryClientProvider>
        </LoadingProvider>
    );
}

export default Providers;
