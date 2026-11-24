/**
 * Shared Hooks
 *
 * Re-exports shared hooks that can be used across all features.
 * Feature-specific hooks should stay in their feature module.
 */

// URL-synced list state
export type {
    Filters,
    FilterValue,
    ListQueryState,
    PaginationMeta,
    SortConfig,
    SortOrder,
    UseListQueryStateOptions,
    UseListQueryStateReturn,
} from "./types";
export { useFormApiErrors } from "./useFormApiErrors";
export type {
    ApiValidationError,
    UseFormApiErrorsOptions,
} from "./useFormApiErrors";
export { useLanguage } from "./useLanguage";
export { useListQueryState } from "./useListQueryState";
export { usePagination } from "./usePagination";
export type {
    PaginationActions,
    PaginationState,
    UsePaginationOptions,
    UsePaginationResult,
} from "./usePagination";
export { useTitle } from "./useTitle";
export { useLayoutStore } from "./useLayoutStore";
export type { MenuOrientation, ContrastMode } from "./useLayoutStore";
export { useSidebarStore } from "./useSidebarStore";
