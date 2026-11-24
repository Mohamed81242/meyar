/**
 * PermissionProvider Component
 *
 * Initializes and manages permission state for the application.
 * Should wrap the app after authentication is established.
 *
 * @example
 * ```tsx
 * <PermissionProvider>
 *     <App />
 * </PermissionProvider>
 * ```
 */

import { authStore } from "@/auth/auth.store";
import { LoadingState } from "@/design-system";
import { useAuthPermissionsQuery } from "@/modules/auth/features/auth/api/auth.queries";
import { type ReactNode } from "react";

interface PermissionProviderProps {
    children: ReactNode;
    loadingFallback?: ReactNode;
    errorFallback?: ReactNode;
}

export function PermissionProvider({ children }: { children: ReactNode }) {
    const isAuthenticated = authStore((state) => state.isAuthenticated);
    const { isLoading } = useAuthPermissionsQuery({
        enabled: isAuthenticated,
    });

    if (isAuthenticated && isLoading) {
        return <LoadingState />; // or a loading spinner
    }

    return <>{children}</>;
}
