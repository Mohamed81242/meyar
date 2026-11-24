/**
 * Root Layout
 *
 * Wraps all routes with common providers and hooks.
 * This component is inside the router context, so it can use router hooks.
 */

import { AuthSyncProvider } from "@/auth";
import { Images } from "@/constants/images";
import logoIcon from "@/assets/images/icon.png";
import { LoadingState, Toaster } from "@/design-system";
import { useDashboardTheme } from "@/modules/hooks";
import { useLanguage } from "@/shared/hooks";
import { useTitle } from "@/shared/hooks/useTitle";
import { changeFavicon } from "@/utils/changeFavIcon";
import { TourOverlay } from "goguide";
import { useEffect } from "react";
import { Outlet, useNavigation } from "react-router-dom";

function RootLayout() {
    const navigation = useNavigation();
    const { darkMode } = useDashboardTheme();
    const { t, isRTL } = useLanguage("shared");
    const theme = darkMode ? "dark" : "light";
    const isRouteLoading = navigation.state === "loading";

    const companyName = "NOTA";

    useTitle(companyName);
    useEffect(() => {
        changeFavicon(logoIcon);
    }, []);

    return (
        <AuthSyncProvider>
            <Toaster position="bottom-right" theme={theme} />
            <TourOverlay t={t} isRTL={isRTL} />
            {isRouteLoading && (
                <LoadingState overlay fullScreen message="Loading..." />
            )}
            <Outlet />
        </AuthSyncProvider>
    );
}

export default RootLayout;
