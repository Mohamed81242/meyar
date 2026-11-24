import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export interface PaginationState {
    page: number;
    perPage: number;
}

export interface PaginationActions {
    nextPage: () => void;
    previousPage: () => void;
    goToPage: (page: number) => void;
    setPerPage: (size: number) => void;
    resetPagination: () => void;
}

export interface UsePaginationResult
    extends PaginationState, PaginationActions {
    hasNext: boolean;
    hasPrevious: boolean;
    offset: number;
}

export interface UsePaginationOptions {
    totalItems?: number;
    initialPerPage?: number;
    syncToURL?: boolean | string; // true uses "page", string uses custom param name
}

/**
 * Unified pagination hook.
 *
 * Internal state by default. Pass `syncToURL: true` (or a custom param name)
 * to keep the current page in the URL query string (e.g. `?page=2`).
 *
 * @example
 * // Internal state only
 * const { page, perPage, nextPage, previousPage, goToPage } = usePagination({ totalItems: 100 });
 *
 * // Synced to URL (?page=2)
 * const { page, perPage, nextPage, previousPage } = usePagination({ totalItems: 100, syncToURL: true });
 */
export function usePagination(
    options: UsePaginationOptions = {},
): UsePaginationResult {
    const { totalItems, initialPerPage = 10, syncToURL = false } = options;

    const urlParam =
        typeof syncToURL === "string" ? syncToURL : syncToURL ? "page" : null;
    const [searchParams, setSearchParams] = useSearchParams();

    const initialPage = urlParam
        ? Math.max(Number(searchParams.get(urlParam)) || 1, 1)
        : 1;

    const [page, setPage] = useState(initialPage);
    const [perPage, setPerPageState] = useState(initialPerPage);

    const totalPages =
        totalItems != null && totalItems > 0
            ? Math.ceil(totalItems / perPage)
            : undefined;

    const hasNext = totalPages != null ? page < totalPages : true;
    const hasPrevious = page > 1;
    const offset = (page - 1) * perPage;

    const updateURL = useCallback(
        (newPage: number) => {
            if (!urlParam) return;
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.set(urlParam, String(newPage));
                return next;
            });
        },
        [urlParam, setSearchParams],
    );

    const setPageInternal = useCallback(
        (newPage: number) => {
            setPage(newPage);
            updateURL(newPage);
        },
        [updateURL],
    );

    const nextPage = useCallback(() => {
        setPage((prev) => {
            const next =
                totalPages != null ? Math.min(prev + 1, totalPages) : prev + 1;
            updateURL(next);
            return next;
        });
    }, [totalPages, updateURL]);

    const previousPage = useCallback(() => {
        setPage((prev) => {
            const next = Math.max(prev - 1, 1);
            updateURL(next);
            return next;
        });
    }, [updateURL]);

    const goToPage = useCallback(
        (target: number) => {
            if (target < 1) return;
            if (totalPages != null && target > totalPages) return;
            setPageInternal(target);
        },
        [totalPages, setPageInternal],
    );

    const setPerPage = useCallback(
        (size: number) => {
            if (size < 1) return;
            setPerPageState(size);
            setPageInternal(1);
        },
        [setPageInternal],
    );

    const resetPagination = useCallback(() => {
        setPageInternal(1);
        setPerPageState(initialPerPage);
    }, [setPageInternal, initialPerPage]);

    return useMemo(
        () => ({
            page,
            perPage,
            hasNext,
            hasPrevious,
            offset,
            nextPage,
            previousPage,
            goToPage,
            setPerPage,
            resetPagination,
        }),
        [
            page,
            perPage,
            hasNext,
            hasPrevious,
            offset,
            nextPage,
            previousPage,
            goToPage,
            setPerPage,
            resetPagination,
        ],
    );
}
