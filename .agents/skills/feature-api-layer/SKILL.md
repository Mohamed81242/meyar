---
name: feature-api-layer
description: Scaffold the complete API integration layer (api.ts, keys.ts, queries.ts, mutations.ts, mock-data.ts, index.ts) for a new dashboard feature, following the dual-mode strategy used in service-portfolio and other established features.
---

# Feature API Layer Skill

Use this skill whenever you are asked to scaffold or add the API layer for a **new dashboard feature** (e.g., a new entity like Assets, Change Requests, Knowledge Base, etc.). It generates the six files that make up the dual-mode API integration pattern used throughout this codebase, and provides rules for creating the UI in `pages/main.tsx`.

> **Reference implementation**: `src/features/dashboard/service-portfolio/` (for both API and `pages/main.tsx`)

---

## Overview: The 3-Tier Dual-Mode Architecture

Every feature API layer is split across exactly **six files** and three logical tiers:

| Tier | File | Purpose |
|------|------|---------|
| Mock | `mock-data.ts` | In-memory data + fake API implementation |
| 1 – Raw API | `[feature].api.ts` | Pure async functions, dual-mode gate |
| 2 – Query Keys | `[feature].keys.ts` | Centralized TanStack Query key factory |
| 3 – Queries | `[feature].queries.ts` | `useQuery` hooks (reads) |
| 3 – Mutations | `[feature].mutations.ts` | `useMutation` hooks (writes) |
| Barrel | `index.ts` | Re-exports everything |

The UI **never** calls Axios directly. It only calls the custom hooks in tier 3.

---

## Step-by-step Generation Guide

### Inputs Required Before Generating

Collect the following before writing any code:
1. **Feature name** (camelCase, e.g. `assetManagement`) and its kebab-case slug (e.g. `asset-management`).
2. **Entity model** – the TypeScript interface for the resource (fields, types).
3. **API base path** – the backend REST path, e.g. `/asset-management`.
4. **Available operations** – which of: `getList`, `getById`, `create`, `update`, `delete`, and any custom actions (e.g. `toggleStatus`, `approve`).
5. **Mock data** – representative array of 2–3 example records matching the entity model.

---

## File 1: `mock-data.ts`

### Rules
- Export a `let` array named `mock[Entity]s: [Entity][]` (mutable so CRUD operations work).
- Export a `const mock[Entity]Api` object containing methods that **mirror** the real API exactly.
- Simulate network latency with `setTimeout(..., 500)`.
- Use `crypto.randomUUID()` for generating IDs on `create`.
- Never import `api` or Axios — this file is completely backend-free.
- Support basic filtering (search, status, pagination) inside `getList` so mock behaviour matches real API behaviour.

### Template
```typescript
import type { [Entity] } from "../types";

// -- Mock Data ----------------------------------------------------------------
export let mock[Entity]s: [Entity][] = [
    {
        id: crypto.randomUUID(),
        // ... representative field values
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    // add 1-2 more records
];

// -- Mock API implementation --------------------------------------------------
export const mock[Entity]Api = {
    getList: async (params?: any, _signal?: AbortSignal): Promise<any> =>
        new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, search, perPage = 25, per_page } = params ?? {};
                const limit = Number(per_page ?? perPage);

                const filtered = mock[Entity]s.filter((item) => {
                    if (!search) return true;
                    // adapt search to the entity name/title field:
                    return item.<nameField>.toLowerCase().includes(search.toLowerCase());
                });

                const start = (Number(page) - 1) * limit;
                const items = filtered.slice(start, start + limit);

                resolve({
                    items,
                    perPage: limit,
                    currentPage: Number(page),
                    lastPage: Math.ceil(filtered.length / limit) || 1,
                    nextPageUrl: null,
                });
            }, 500);
        }),

    getById: async (id: string, _signal?: AbortSignal): Promise<[Entity]> =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                const item = mock[Entity]s.find((e) => e.id === id);
                if (!item) reject(new Error("[Entity] not found"));
                else resolve(item);
            }, 500);
        }),

    create: async (payload: any): Promise<[Entity]> =>
        new Promise((resolve) => {
            setTimeout(() => {
                const newItem: [Entity] = {
                    id: crypto.randomUUID(),
                    // map snake_case payload keys to camelCase model fields
                    ...payload,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                mock[Entity]s = [newItem, ...mock[Entity]s];
                resolve(newItem);
            }, 500);
        }),

    update: async (id: string, payload: any): Promise<[Entity]> =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mock[Entity]s.findIndex((e) => e.id === id);
                if (index === -1) { reject(new Error("[Entity] not found")); return; }
                mock[Entity]s[index] = {
                    ...mock[Entity]s[index],
                    // map snake_case payload keys to camelCase model fields
                    updatedAt: new Date().toISOString(),
                };
                resolve(mock[Entity]s[index]);
            }, 500);
        }),

    delete: async (id: string): Promise<void> =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mock[Entity]s.findIndex((e) => e.id === id);
                if (index === -1) { reject(new Error("[Entity] not found")); return; }
                mock[Entity]s = mock[Entity]s.filter((e) => e.id !== id);
                resolve();
            }, 500);
        }),
};
```

---

## File 2: `[feature].api.ts`

### Rules
- Import `api` from `@/shared/api/client` and `buildFilterParam` from `@/shared/api/client/apiHelpers`.
- Import `API_CONFIG` from `@/shared/api/config/env`.
- Declare `const BASE_URL = "/[api-path]"` and `const IS_MOCKDATA = true` at the top.
- Every method must check **`if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA)`** first and delegate to `mock[Entity]Api`.
- Always accept and forward an `AbortSignal` on GET operations.
- The `getList` method must build filter params using `buildFilterParam` and handle both array and single-filter shapes (copy the normalization logic from service-portfolio).
- Handle the response polymorphism for `getList` (array vs. `{ items }` shape) to support different backend styles.
- Throw typed errors when `response.error` is truthy or `response.data?.data` is absent.

### Template
```typescript
import { api } from "@/shared/api/client";
import { buildFilterParam } from "@/shared/api/client/apiHelpers";
import type { [Entity], [Entity]CreatePayload, [Entity]UpdatePayload } from "../types";
import type { ApiResponse, ListQueryParams, PaginatedData } from "@/shared/api";
import { mock[Entity]Api } from "./mock-data";
import { API_CONFIG } from "@/shared/api/config/env";

const BASE_URL = "/[api-path]";
const IS_MOCKDATA = true; // flip to true locally to force mock mode

export const [feature]Api = {
    getList: async (
        params?: ListQueryParams,
        signal?: AbortSignal,
    ): Promise<PaginatedData<[Entity]>> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) {
            return mock[Entity]Api.getList(params, signal);
        }

        const { page = 1, search, filter, advancedFilters, sort, perPage = 25, per_page } =
            (params ?? {}) as any;
        const perPageParam = per_page ?? perPage;
        const filterToFormat = advancedFilters ?? filter;

        const formattedFilter = Array.isArray(filterToFormat)
            ? filterToFormat.reduce(
                  (acc: any, f: any) => ({ ...acc, ...buildFilterParam(f.column, f.operator, f.value) }),
                  {},
              )
            : filterToFormat &&
                typeof filterToFormat === "object" &&
                "column" in filterToFormat &&
                "operator" in filterToFormat
              ? buildFilterParam(filterToFormat.column, filterToFormat.operator, filterToFormat.value)
              : filterToFormat;

        const response = await api.get<ApiResponse<PaginatedData<[Entity]>>>(BASE_URL, {
            params: {
                ...(page ? { page } : {}),
                ...(search ? { search } : {}),
                ...(formattedFilter ? { filter: formattedFilter } : {}),
                ...(sort ? { [`sort[${sort.column}]`]: sort.direction } : {}),
                ...(perPageParam ? { per_page: perPageParam } : {}),
            },
            signal,
        });

        if (response.error) throw response.error;

        const data = response.data?.data;
        if (!data) throw new Error("No data returned from server");

        // Handle flat array response
        if (Array.isArray(data)) {
            return { currentPage: 1, lastPage: 1, perPage: data.length, nextPageUrl: null, items: data };
        }
        // Handle paginated response
        if (data && Array.isArray((data as any).items)) {
            return data as unknown as PaginatedData<[Entity]>;
        }
        return { currentPage: 1, lastPage: 1, perPage: 10, nextPageUrl: null, items: [] };
    },

    getById: async (id: string, signal?: AbortSignal): Promise<[Entity]> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mock[Entity]Api.getById(id, signal);

        const response = await api.get<ApiResponse<[Entity]>>(`${BASE_URL}/${id}`, { signal });
        if (response.error || !response.data?.data) {
            throw new Error(response.error?.message ?? "No data returned from server");
        }
        return response.data.data;
    },

    create: async (payload: [Entity]CreatePayload): Promise<[Entity]> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mock[Entity]Api.create(payload);

        const response = await api.post<ApiResponse<[Entity]>>(BASE_URL, payload);
        if (response.error || !response.data?.data) {
            throw new Error(response.error?.message ?? "No data returned from server");
        }
        return response.data.data;
    },

    update: async (id: string, payload: [Entity]UpdatePayload): Promise<[Entity]> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mock[Entity]Api.update(id, payload);

        const response = await api.put<ApiResponse<[Entity]>>(`${BASE_URL}/${id}`, payload);
        if (response.error || !response.data?.data) {
            throw new Error(response.error?.message ?? "No data returned from server");
        }
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mock[Entity]Api.delete(id);

        const response = await api.delete(`${BASE_URL}/${id}`);
        if (response.error) throw new Error(response.error.message ?? "Failed to delete");
    },

    // -- Custom action example (e.g. toggleStatus) ---------------------------
    // toggleStatus: async (id: string): Promise<[Entity]> => {
    //     if (API_CONFIG.USE_MOCK_DATA || IS_MOCKDATA) return mock[Entity]Api.toggleStatus(id);
    //     const response = await api.post<ApiResponse<[Entity]>>(`${BASE_URL}/${id}/toggle-status`);
    //     if (response.error || !response.data?.data) {
    //         throw new Error(response.error?.message ?? "No data returned from server");
    //     }
    //     return response.data.data;
    // },
};
```

---

## File 3: `[feature].keys.ts`

### Rules
- Always export a typed query key factory object.
- Export a union type `[Feature]QueryKey` covering all key shapes for use in generic hooks.
- Key names follow the pattern: `all`, `lists()`, `list(params?)`, `details()`, `detail(id)`.

### Template
```typescript
export const [feature]Keys = {
    all: ["[feature-slug]"] as const,
    lists: () => [...[feature]Keys.all, "list"] as const,
    list: (params?: unknown) =>
        params ? [...[feature]Keys.lists(), params] as const : [feature]Keys.lists(),
    details: () => [...[feature]Keys.all, "detail"] as const,
    detail: (id: string) => [...[feature]Keys.details(), id] as const,
};

export type [Feature]QueryKey =
    | typeof [feature]Keys.all
    | ReturnType<typeof [feature]Keys.lists>
    | ReturnType<typeof [feature]Keys.list>
    | ReturnType<typeof [feature]Keys.details>
    | ReturnType<typeof [feature]Keys.detail>;
```

---

## File 4: `[feature].queries.ts`

### Rules
- Use `useQuery` from `@tanstack/react-query`.
- **Always** destructure `signal` from the query function context and forward it to the API call.
- Use `placeholderData: (prev) => prev` on list queries to prevent layout shift during pagination.
- Accept an optional `options` override of type `Partial<UseQueryOptions<...>>`.
- Guard `getById` queries with `enabled: !!id`.

### Template
```typescript
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { [feature]Keys } from "./[feature].keys";
import { [feature]Api } from "./[feature].api";
import type { [Entity] } from "../types";
import type { ListQueryParams, PaginatedData } from "@/shared/api";

export function use[Entity]List(
    params?: ListQueryParams,
    options?: Partial<UseQueryOptions<PaginatedData<[Entity]>, Error>>,
) {
    return useQuery({
        queryKey: [...[feature]Keys.list(), params],
        queryFn: ({ signal }) => [feature]Api.getList(params, signal),
        placeholderData: (prev) => prev,
        ...options,
    });
}

export function use[Entity](
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<[Entity], Error>>,
) {
    return useQuery({
        queryKey: [feature]Keys.detail(id ?? ""),
        queryFn: ({ signal }) => [feature]Api.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
```

---

## File 5: `[feature].mutations.ts`

### Rules
- Use `useMutation` + `useQueryClient` from `@tanstack/react-query`.
- On `create` / `delete`, invalidate `[feature]Keys.all` to refresh all related queries.
- On `update`, invalidate both `[feature]Keys.lists()` **and** `[feature]Keys.detail(variables.id)`.
- On `delete`, also call `queryClient.removeQueries` on the specific `detail` key to clear stale cache.
- Type mutations as `useMutation<ReturnType, ApiError, VariableType>`.

### Template
```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { [feature]Keys } from "./[feature].keys";
import { [feature]Api } from "./[feature].api";
import type { ApiError } from "@/shared/api";
import type { [Entity], [Entity]CreatePayload, [Entity]UpdatePayload } from "../types";

export function useCreate[Entity]() {
    const queryClient = useQueryClient();
    return useMutation<[Entity], ApiError, [Entity]CreatePayload>({
        mutationFn: [feature]Api.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [feature]Keys.all });
        },
    });
}

export function useUpdate[Entity]() {
    const queryClient = useQueryClient();
    return useMutation<[Entity], ApiError, { id: string; data: [Entity]UpdatePayload }>({
        mutationFn: ({ id, data }) => [feature]Api.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [feature]Keys.lists() });
            queryClient.invalidateQueries({ queryKey: [feature]Keys.detail(variables.id) });
        },
    });
}

export function useDelete[Entity]() {
    const queryClient = useQueryClient();
    return useMutation<void, ApiError, string>({
        mutationFn: (id) => [feature]Api.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: [feature]Keys.all });
            queryClient.removeQueries({ queryKey: [feature]Keys.detail(id) });
        },
    });
}

// -- Custom mutations (e.g. toggleStatus) -------------------------------------
// export function useToggle[Entity]Status() {
//     const queryClient = useQueryClient();
//     return useMutation<[Entity], ApiError, string>({
//         mutationFn: (id) => [feature]Api.toggleStatus(id),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: [feature]Keys.all });
//         },
//     });
// }
```

---

## File 6: `api/index.ts`

### Rules
- Re-export everything from all five files. This is the only import path UI components should use for the API layer.
- Re-export mock data arrays if they need to be used in Storybook or tests.

### Template
```typescript
export { [feature]Keys, type [Feature]QueryKey } from "./[feature].keys";
export { [feature]Api } from "./[feature].api";
export { use[Entity]List, use[Entity] } from "./[feature].queries";
export {
    useCreate[Entity],
    useUpdate[Entity],
    useDelete[Entity],
    // useToggle[Entity]Status,
} from "./[feature].mutations";
export * from "./mock-data";
```

## File 7: `pages/main.tsx` (UI Orchestration)

When implementing or updating the frontend component for the feature:

### Rules
- **Strict Data Types & Keys**: Ensure that the data types in `[feature].types.ts` EXACTLY match the keys provided by the backend API JSON response. Do not use legacy fields or mismatched camel/snake cases.
- **Preserve UI Layout**: When updating an existing UI to use the new JSON response keys, **DO NOT change the UI design, layout, or method of displaying data**. You should only change the variables/keys used to display the data.
- **Complete CRUD Integration**: Ensure the main page UI handles all available CRUD operations (Create, Read/View Details, Update/Edit, Delete) if they exist in the API layer.
- **Delete Confirmation Dialog**: You MUST handle deletes using a dedicated confirmation `<Dialog>` component from the design system to alert the user. **NEVER** use `window.alert` or `window.confirm`. Provide clear warning text that the action cannot be undone, and hook it up to the `useDelete` mutation.
- **Reference**: Always use `service-portfolio/pages/main.tsx` as a reference for structuring forms, tables, details views, and delete dialogs.

---

## Checklist Before Marking Complete

- [ ] Data types in `[feature].types.ts` strictly match the backend JSON response.
- [ ] UI in `pages/main.tsx` uses the exact keys from the response.
- [ ] All CRUD operations are wired up in the UI (if endpoints exist).
- [ ] Deletion uses a custom `<Dialog>`, not browser alerts.
- [ ] `IS_MOCKDATA = false` is the default in `[feature].api.ts`.
- [ ] Every GET function accepts and forwards an `AbortSignal`.
- [ ] `getList` handles both flat-array and paginated `{ items }` response shapes.
- [ ] All mock methods simulate a `500ms` delay.
- [ ] Query keys are centralized — no raw strings in queries/mutations.
- [ ] `update` invalidates both the list and the specific detail entry.
- [ ] `delete` calls `removeQueries` in addition to `invalidateQueries`.
- [ ] No Axios or `api` client imports in `mock-data.ts`.
- [ ] `api/index.ts` re-exports everything so consumers only import from `../api`.
- [ ] Types (`[Entity]CreatePayload`, `[Entity]UpdatePayload`) are defined in `types/[feature].types.ts` and imported — not redefined inline.

---

## Key Imports Reference

```typescript
// Shared API client
import { api } from "@/shared/api/client";
import { buildFilterParam } from "@/shared/api/client/apiHelpers";

// Shared types
import type { ApiResponse, ApiError, ListQueryParams, PaginatedData } from "@/shared/api";

// Config flag
import { API_CONFIG } from "@/shared/api/config/env";

// TanStack Query
import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
```
