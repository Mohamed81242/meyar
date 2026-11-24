/**
 * API Helper Functions
 *
 * Utility functions for making requests to different API endpoints
 */


/**
 * Helper to build filter parameter structure for API requests.
 *
 * @example
 * ```ts
 * buildFilterParam("project_name_en", "like", "Aliva")
 * // Returns: { project_name_en: { operator: "like", value: "Aliva" } }
 * ```
 */
export function buildFilterParam(
    column: string,
    operator: string,
    value: any,
) {
    return {
        [column]: {
            operator,
            value,
        },
    };
}

/**
 * Format active filters (single or array of FilterValue) into the API param structure.
 */
export function formatFilterParam(filter: any) {
    if (Array.isArray(filter)) {
        return filter.reduce(
            (acc, f) => ({
                ...acc,
                ...buildFilterParam(f.column, f.operator, f.value),
            }),
            {},
        );
    }
    if (
        filter &&
        typeof filter === "object" &&
        "column" in filter &&
        "operator" in filter
    ) {
        return buildFilterParam(filter.column, filter.operator, filter.value);
    }
    return filter;
}


