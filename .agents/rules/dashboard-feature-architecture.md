---
trigger: always_on
---

# Dashboard Feature Architecture & Integration Guidelines

This document outlines the standard architecture, file structure, API integration methods, and DRY principles to follow when creating or modifying features in the dashboard (e.g., `src/features/dashboard/[feature-name]`). 

It is based on the robust implementation found in the `leads` and `services` features.

## 1. Directory & File Structure

Every feature must be self-contained within its own folder under `src/features/dashboard/`. Follow this strict subdirectory pattern:

- **`api/`**: Contains all data-fetching and mutation logic.
  - `config.ts`: Contains the configuration for the feature's API, notably the `USE_MOCK_DATA` boolean flag.
  - `mock-data.ts`: Defines mock data arrays and mock API implementation methods.
  - `[feature].api.ts`: Pure Axios/API functions handling the dual-mode logic (mock vs real).
  - `[feature].keys.ts`: Centralized Query Keys for TanStack React Query.
  - `[feature].queries.ts`: Custom React Query hooks for fetching data (`useQuery`).
  - `[feature].mutations.ts`: Custom React Query hooks for modifying data (`useMutation`).
- **`components/`**: Feature-specific UI components (e.g., Modals, Cards, Forms). Keep components small and focused.
- **`pages/`**: The main views/screens. Usually contains `main.tsx` which acts as the orchestrator.
- **`types/`**: TypeScript interfaces and types for the feature (e.g., `[feature].types.ts`). Do not redefine types inline.
- **`utils/`**: Feature-specific utility functions, formatters, and constants (`index.ts`).
- **`navigation/`**: Routing configuration (`routes.ts`, `paths.ts`, `nav.ts`).
- **`locales/`**: i18n translation files.

## 2. API Integration Layer (Dual-Mode Strategy)

The `api` directory implements a dual-mode API strategy that seamlessly switches between mock data and a live backend. Do not make raw API calls directly inside UI components. Use the 3-tier API architecture:

### Tier 1: Pure API Functions (`[feature].api.ts`)
- Use the shared `api` client (`import { api } from "@/shared/api/client"`).
- Always accept and pass an `AbortSignal` for GET requests to allow request cancellation.
- Throw typed errors if the response fails.

**The `USE_MOCK_DATA` Pattern (CRITICAL):**
Your API methods must support a seamless development experience without a real backend. Every raw API method MUST begin with a check against the `USE_MOCK_DATA` configuration.

**Example**:
```typescript
import { FEATURE_API_CONFIG } from "./config";
import { mockFeatureApi } from "./mock-data";
import { api } from "@/shared/api/client"; // Shared API client

export const featureApi = {
    getList: async (params?: ListQueryParams, signal?: AbortSignal) => {
        // 1. Check for Mock Data Mode
        if (FEATURE_API_CONFIG.USE_MOCK_DATA) {
            return mockFeatureApi.getList(params, signal);
        }

        // 2. Real API implementation
        const response = await api.get('/endpoint', { params, signal });
        if (response.error) throw response.error;
        return response.data.data;
    }
};
```

### Tier 2: Query Keys (`keys.ts`)
- Centralize all query keys to avoid typos and make cache invalidation predictable.
- **Example**:
  ```typescript
  export const featureKeys = {
      all: ['feature'] as const,
      lists: () => [...featureKeys.all, 'list'] as const,
      list: (params?: any) => params ? [...featureKeys.lists(), params] as const : featureKeys.lists(),
      detail: (id: string | number) => [...featureKeys.all, 'detail', id] as const,
  };
  ```

### Tier 3: Custom Hooks (`queries.ts` & `mutations.ts`)
- **Queries**: Wrap the API functions in `useQuery`. Always use the `signal` provided by the query function context.
- **Mutations**: Wrap creation, updates, and deletions in `useMutation`.
- **Cache Invalidation**: On successful mutations, always invalidate the relevant query keys using `queryClient.invalidateQueries`.
- **Example**:
  ```typescript
  export function useFeatureList(params) {
      return useQuery({
          queryKey: featureKeys.list(params),
          queryFn: ({ signal }) => featureApi.getList(params, signal),
      });
  }
  ```

## 3. UI and Page Architecture (`pages/main.tsx`)

- **State Management**: Keep UI state (search queries, pagination, selected items, modal visibility) in the main page component.
- **Debouncing**: Always debounce search inputs using `useDebounce(searchQuery)`.
- **Layouts**: Use established design-system layouts like `MasterDetailLayout` for list/detail views.
- **Loading & Errors**: Handle loading and error states cleanly using shared `LoadingState` and `ErrorState` components before rendering the main UI.
- **Localization**: Never hardcode strings. Always use the `useLanguage` hook (`const { t } = useLanguage('featureName')`).
- **Feedback**: Provide user feedback via `toast.success` and `toast.error` during mutations.

## 4. Types, Utilities, and Best Practices

- **Types**: Define comprehensive types for models, API payloads (`CreatePayload`, `UpdatePayload`), and API responses (`PaginatedData`).
- **Utilities**: Extract complex mapping logic, status configurations, and string formatting into `utils/index.ts`.
  - Use a centralized configuration object for statuses (mapping statuses to colors, icons, and labels) to keep the UI components clean and DRY.
- **FormData Handling**: If endpoints require `multipart/form-data` (e.g., uploading images), provide a dedicated method in the API (like `addWithFormData`) and handle the `FormData` conversion there, cleanly separating it from the standard JSON methods.
- **Mock Data**: In `mock-data.ts`, structure your data identically to the expected backend response schemas. Implement filtering, pagination, and artificial delays inside the mock implementation so UI components don't have to know they are talking to a mock.

## 5. Key Principles (What is Important)
- **Separation of Concerns**: UI components should not know how data is fetched. They only consume hooks.
- **Server-Side Filtering/Pagination**: Pass page numbers, debounced search strings, and status filters down to the API hook. Do not filter large datasets on the client.
- **Performance**: The combination of `AbortSignal`, debouncing, and React Query caching ensures minimal network requests and fast UI updates.
