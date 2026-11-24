/**
 * Site Layout
 *
 * Layout for public site pages (landing, about, contact, etc.).
 * Provides a clean wrapper for public-facing content.
 */

import { TemplateStyles } from "@/modules/dashboard/main/layout/styles";
import { ThemeTransitionOverlay } from "@/modules/dashboard/main/layout/ThemeTransitionOverlay";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

function SiteLayout() {
    const location = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <>
            <TemplateStyles themeName="dashboard">
                <ThemeTransitionOverlay />
                <Outlet />
            </TemplateStyles>
        </>
    );
}

export default SiteLayout;
