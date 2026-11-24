/**
 * Observability Module
 *
 * Exports for logging, error boundaries, and performance utilities.
 */

// Logger
export { logger } from "./logger";

// Error Boundary & Error History
export { DefaultErrorFallback, ErrorBoundary } from "./ErrorBoundary";
export { errorHistory } from "./errorHistory";
export { ServerErrorGuard } from "./ServerErrorGuard";

// Hooks
export { useDebounce, useDebouncedCallback } from "./useDebounce";

// Types
export type {
    ErrorBoundaryProps,
    ErrorBoundaryState,
    ErrorFallbackProps,
    LogContext,
    LogEntry,
    LogLevel,
    Logger,
} from "./types";
