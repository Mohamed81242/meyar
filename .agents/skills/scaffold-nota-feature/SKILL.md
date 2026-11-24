---
name: scaffold-nota-feature
description: Systematically scaffolds and registers a new nota dashboard module or feature, incorporating modern tabbed UI layouts, dark mode styling tokens, i18n translations, and nota business logic dependencies.
---

# Scaffold nota Feature Skill

This skill is invoked when generating a new dashboard module or feature inside the nota SaaS Platform  It ensures the feature strictly conforms to the 3-tier dual-mode API, modern styling, and translation systems.

---

## 1. Directory Structure

When creating a new feature named `[feature-name]` (use kebab-case, e.g., `service-requests`), create it under:
`src/modules/dashboard/main/features/[feature-name]/`

Ensure it contains the following subdirectories:
- `api/`
- `components/`
- `locales/`
- `navigation/`
- `pages/`
- `types/`
- `index.ts` (Root export file)

---

## 2. Step-by-Step Implementation

### Step 2.1: Types (`types/`)
Create `types/[feature].types.ts` defining the data model based on the business entity fields.
- Include standard fields: `id: string; createdAt: string; updatedAt: string;`
- Define the typescript interfaces for the entity, a `CreatePayload` interface, and an `UpdatePayload` interface.
- Export all of them from `types/index.ts`.

### Step 2.2: Locales (`locales/`)
Create `locales/en.json` (English) and `locales/ar.json` (Arabic/RTL) translation files.
- Translate every UI element (titles, subtitles, button labels, form labels, form placeholders, toasts, dialogs, status tags, priorities).
- Ensure the keys match exactly between languages.
- *Do not import translation files manually; they will auto-register via glob imports in `src/i18n/index.ts` using the directory name as the namespace.*

### Step 2.3: API Layer (`api/`)

Implement the "Dual-Mode Strategy" allowing the UI to work entirely with mock data when a flag is active.

1. **`api/config.ts`**:
   ```typescript
   export const [FEATURE_NAME]_API_CONFIG = {
       USE_MOCK_DATA: true, // true by default for local development
   };
   ```
2. **`api/mock-data.ts`**:
   - Define a mutable array of mock data (`export let mock[Entity]s: [Entity][] = [...]`).
   - Create `mock[Entity]Api` containing methods mirroring real endpoints: `getList`, `getById`, `create`, `update`, `delete`.
   - Use artificial delay (e.g., `setTimeout(..., 500)`) and `crypto.randomUUID()` for creates.
   - Implement mock search filtering on `getList`.
3. **`api/[feature].api.ts`**:
   - Implement the actual API requests using the shared client `import { api } from "@/shared/api/client"`.
   - Check the mock flag first: `if ([FEATURE_NAME]_API_CONFIG.USE_MOCK_DATA) return mock[Entity]Api.method(...)`.
   - Accept and forward `AbortSignal` for all GET requests.
   - Use `buildFilterParam` for query parameters.
4. **`api/[feature].keys.ts`**:
   - Centralize React Query keys:
     ```typescript
     export const [feature]Keys = {
         all: ["[feature-slug]"] as const,
         lists: () => [...[feature]Keys.all, "list"] as const,
         list: (params?: unknown) => params ? [...[feature]Keys.lists(), params] as const : [feature]Keys.lists(),
         details: () => [...[feature]Keys.all, "detail"] as const,
         detail: (id: string) => [...[feature]Keys.details(), id] as const,
     };
     ```
5. **`api/[feature].queries.ts`**:
   - Wrap API calls in `useQuery`.
   - Destructure `signal` from the query function context and pass it down.
   - Use `placeholderData: (prev) => prev` for list queries to prevent layout shifting.
6. **`api/[feature].mutations.ts`**:
   - Wrap mutation requests in `useMutation`.
   - On success: Invalidate list queries and detail queries, and call `queryClient.removeQueries` on deletes.
7. **`api/index.ts`**:
   - Barrel export all queries, mutations, API client objects, and mock data.

### Step 2.4: Navigation & Routes (`navigation/`)

1. **`navigation/paths.ts`**:
   - Export standard navigation path helpers.
2. **`navigation/routes.ts`**:
   - Define a `[feature]Routes` array of `RouteConfig`.
   - Set the route `path` and lazy-load the main page:
     ```typescript
     lazy: () => import("../pages/main").then((m) => ({ default: m.default }))
     ```
3. **`navigation/nav.ts`**:
   - Export a `[feature]NavItem` of type `NavItem`.
   - Map `labelKey` to `"[feature-namespace]:title"`.
4. **`navigation/index.ts`**:
   - Barrel export paths, routes, and nav items.

### Step 2.5: UI Main Page (`pages/main.tsx`)

Implement a highly polished page:
- **Layout**: Use the custom `FeatureLayout` container.
- **Header**: Contains:
  - Left side: Browser-Style Tab bar (reorderable via HTML5 drag-and-drop events, `draggable`, `onDragStart`, `onDragOver`, `onDragEnd`).
  - Max Tabs: Implement `MAX_TABS = 5`. Auto-close the oldest item tab (index 1) if a new tab exceeds the limit.
  - Right side: Search/Filters inside `FeatureLayout.Toolbar` (only rendered for the list view tab).
- **Body (`FeatureLayout.Body`)**:
  - List View Tab: Renders a `Table` where each `TableRow` is wrapped in a custom `ContextMenu` (providing quick right-click actions: Open Tab, Delete, Change Status).
  - Create/Edit Tabs: Renders `FeatureLayout.DetailContent` divided into:
    - `FeatureLayout.DetailMain` (primary form fields, titles, descriptions).
    - `FeatureLayout.DetailSidebar` (dropdowns for status, assignee, priority, stickily placed on the right).
    - `FeatureLayout.Footer` (sticky bottom action bar containing pill buttons like Cancel and Submit).
- **Translation**: Exclusively translate all labels, texts, and alerts using `const { t } = useLanguage("[feature-namespace]")`. Do not hardcode strings.
- **Delete Dialog**: Wire up deletion to trigger a custom design system `<Dialog>` with confirmation and cancel buttons.

### Step 2.6: Registration / Integration

To activate the feature in the application, register its routes and sidebar navigation:

1. **Routing Registration**:
   - Open `src/modules/dashboard/main/navigation/routes.tsx`.
   - Import `[feature]Routes` from your feature.
   - Spread `...[feature]Routes` inside the `children` array of `dashboardRouteModule`.

2. **Sidebar Navigation Registration**:
   - Open `src/modules/dashboard/main/navigation/nav.ts`.
   - Import `[feature]NavItem` from your feature.
   - Place `[feature]NavItem` inside the appropriate section of the dashboard navigation (e.g. `serviceDeskNav` or `serviceManagementNav`).

---

## 3. First-Time Module Group Setup & Integration

When creating a completely new dashboard layout/module group (like Settings or Projects) instead of a feature under an existing module:

### Step 3.1: Create Module Folder Structure
Create the following hierarchy under `src/modules/dashboard/[module-name]/`:
- `features/` (to hold self-contained feature subfolders)
- `layout/`
  - `sidebar/index.tsx` (the layout-specific sidebar calling `useNavItems`)
  - `navbar/index.tsx` (the layout-specific header)
  - `[Module]DashboardLayout.tsx` (the layout container that wraps Outlet and Suspense)
- `navigation/`
  - `paths.ts` (module-specific path configurations)
  - `routes.ts` (module-specific routes manager)
  - `nav.ts` (module-specific nav section registration)
  - `index.ts` (barrel export)

### Step 3.2: Configure Navigation & Routes Registries
1. **`navigation/paths.ts`**:
   - Define and export path constants for the new module.
2. **`navigation/routes.ts`**:
   - Import all child feature routes.
   - Export `[module]RouteModule` of type `FeatureRouteModule`:
     ```typescript
     export const [module]RouteModule: FeatureRouteModule = {
         id: "[module-name]",
         name: "[Module Name]",
         basePath: "/dashboard/[module-path]",
         layout: "dashboard-[module-name]",
         routes: {
             children: [
                 ...feature1Routes,
                 ...feature2Routes,
             ],
         },
     };
     ```
3. **`navigation/nav.ts`**:
   - Import child feature nav items.
   - Export `[module]NavModule` of type `FeatureNavModule`:
     ```typescript
     export const [module]NavModule: FeatureNavModule = {
         featureId: "[module-name]-workspace",
         section: "Settings", // or the logical grouping section
         order: 1,
         module: "dashboard-[module-name]",
         items: [feature1NavItem, feature2NavItem],
     };
     ```
4. **`navigation/index.ts`**:
   - Barrel export everything: `export * from "./nav"; export * from "./paths"; export * from "./routes";`

### Step 3.3: Register Layout and Module Types
1. **Sidebar Filtration**:
   - In `layout/sidebar/index.tsx`, load the filtered navigation:
     ```typescript
     const { sections } = useNavItems("dashboard-[module-name]");
     ```
2. **Sidebar Module Key**:
   - Add your module string key (e.g. `"dashboard-[module-name]"`) to `NavModuleKey` union type in `src/navigation/nav.types.ts`.
3. **Router Main Configuration**:
   - Open `src/main.tsx`.
   - Import the new layout: `import [Module]DashboardLayout from "./modules/dashboard/[module-name]/layout/[Module]DashboardLayout";`
   - Register it under the router provider:
     ```tsx
     {
         element: (
             <ProtectedRoute>
                 <[Module]DashboardLayout />
             </ProtectedRoute>
         ),
         children: routesByLayout['dashboard-[module-name]'] || [],
       },
     ```
4. **Glob Loader**:
   - Note that Vite glob imports in `src/router/featureLoader.ts` automatically scan `src/modules/dashboard/*/navigation/` to discover and register your new module routes and navigation files.

---

## 4. Checklist for Completion

- [ ] Directory structure is created correctly.
- [ ] TypeScript interfaces match the schema exactly.
- [ ] Language translation JSON files are created for both `en` and `ar`.
- [ ] i18n variables are used in the UI; no hardcoded strings remain.
- [ ] The API layer uses the dual-mode config with `USE_MOCK_DATA: true` for local development.
- [ ] React Query keys are centralized and mutations properly invalidate cache.
- [ ] The main page utilizes `FeatureLayout` and styling variables (`--color-dashboard-*`).
- [ ] Drag-and-drop browser-style tabs are implemented with a maximum limit of 5.
- [ ] Context menus are wired to table rows.
- [ ] Deletion uses a confirmation `<Dialog>`.
- [ ] Feature routes are imported and spread in `src/modules/dashboard/main/navigation/routes.tsx` or the custom module's routes file.
- [ ] Feature navigation item is registered under the correct sidebar section.
- [ ] If creating a new module, Sidebar filters by `"dashboard-[module-name]"` and layout is registered in `src/main.tsx` and `src/navigation/nav.types.ts`.

