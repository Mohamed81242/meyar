/**
 * HTTP Client exports
 *
 * Centralized exports for HTTP client, utilities, and helpers.
 * Import from '@/api' or '@/api/client' in your code.
 */

// Enhanced HTTP client with auth modes and advanced params
export {
    api,
    enhancedHttpClient,
    transformError as transformApiError
} from "./httpClient";

// Validation error helpers
export {
    applyServerErrors,
    getFieldError,
    getFieldErrors,
    toFormErrors
} from "./httpClient";

// Params serializer
export {
    createParamsSerializer,
    serializeParams,
    type FilterParams,
    type ListQueryParams,
    type PaginationParams,
    type ParamValue,
    type SerializerOptions,
    type SortParams
} from "./paramsSerializer";

// Request types
export {
    META_PROCESSED,
    type AuthMode,
    type EnhancedRequestConfig,
    type HttpMethod,
    type RequestMeta
} from "./requestTypes";

// API Helpers
export { buildFilterParam } from "./apiHelpers";
