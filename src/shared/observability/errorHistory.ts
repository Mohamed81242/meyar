/**
 * Error History
 *
 * Tracks the last page where an error occurred so the /500 route
 * can redirect back when accessed without a preceding error.
 */

const STORAGE_KEY = "lastErrorPath";

export const errorHistory = {
    /**
     * Record the current pathname as the location of the last error.
     */
    record(locationPath?: string): void {
        try {
            sessionStorage.setItem(
                STORAGE_KEY,
                locationPath ?? window.location.pathname + window.location.search,
            );
        } catch {
            /* ignore storage errors */
        }
    },

    /**
     * Get the pathname of the last recorded error.
     */
    getLastPath(): string | null {
        try {
            return sessionStorage.getItem(STORAGE_KEY);
        } catch {
            return null;
        }
    },

    /**
     * Clear the recorded error.
     */
    clear(): void {
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch {
            /* ignore */
        }
    },

    /**
     * Check whether an error has been recorded this session.
     */
    hasError(): boolean {
        return this.getLastPath() !== null;
    },
};
