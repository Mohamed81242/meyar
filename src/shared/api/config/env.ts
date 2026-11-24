/**
 * API Environment Configuration
 * Single source of truth for API-related configuration values
 */

const envMode =
    import.meta.env.VITE_ENV_MODE ||
    (import.meta.env.DEV ? "development" : "production");
const isDev = envMode === "development";

const getBaseUrl = (): string => {
    // SSR safety
    if (typeof window === "undefined") {
        return import.meta.env.VITE_API_URL;
    }

    // In development mode, we use the local Vite proxy
    if (isDev) {
        return `${window.location.origin}/api`;
    }

    // In production/staging, we use the configured backend VITE_API_URL directly
    return import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
};

export const API_CONFIG = {
    BASE_URL: getBaseUrl(),
    TIMEOUT: 30000,
    AUTH_COOKIE_NAME: import.meta.env.VITE_AUTH_COOKIE_NAME,
    PROJECT_NAME: import.meta.env.VITE_PROJECT_NAME,
    ENV_MODE: envMode,
    AUTH_COOKIE_EXPIRES_DAYS: import.meta.env.VITE_AUTH_COOKIE_EXPIRES_DAYS,
    USE_MOCK_DATA: true,
} as const;

export type ApiConfig = typeof API_CONFIG;
