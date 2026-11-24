---
name: module-architecture-guide
description: A comprehensive guide on the standard architectural structure of modules (e.g., dashboard modules) in the nota application.
---

# Module Architecture Guide

This skill documents the standard architecture for creating top-level "modules" in the application (like `dashboard/main`, `dashboard/projects`, and `dashboard/settings`). Following this structure ensures consistency, scalable routing, and clean separation of concerns.

## 1. Directory Structure

A standard module is a self-contained domain bounded context located in `src/modules/<module-name>/`. It strictly follows this subdirectory pattern:

- **`layout/`**: Contains the shell layout wrapper for the entire module (e.g., `MainDashboardLayout.tsx`). This layout MUST include an `<Outlet />` from `react-router-dom` to render child feature routes.
- **`navigation/`**: Centralized routing and navigation definitions.
  - `routes.ts`: Aggregates and exports all feature routes as a `FeatureRouteModule`.
  - `nav.ts` (optional): Aggregates feature navigation items for sidebars as a `FeatureNavModule`.
  - `paths.ts`: Constant URL strings.
- **`features/`**: Contains multiple isolated features that belong to this module.

## 2. Layouts

Layouts are responsible for the structural shell (e.g., sidebars, navigation bars, global layout animations) without knowing the specific feature being rendered. 

**Rules:**
- A layout must render an `<Outlet />` for its children.
- It is registered in the main application router (`src/main.tsx`) wrapping the child routes fetched dynamically using `routesByLayout['layout-name']`.

## 3. Features

Inside `features/`, each sub-directory represents an isolated, self-contained functional area.
A standard feature within a module has:
- `api/`: Data fetching, React Query hooks, and mock data.
- `components/`: Feature-specific UI components.
- `pages/`: The views (e.g., `main.tsx`) representing the routes.
- `navigation/`: 
  - `routes.ts`: Defines the `RouteConfig[]` for this feature.
- `store/`: Zustand state management for the feature.

## 4. Navigation & Routing (The Registry Pattern)

Modules use a dynamic routing registry to avoid massive hardcoded routing files.

**Module Route Export (`src/modules/<module-name>/navigation/routes.ts`)**:
```typescript
import type { FeatureRouteModule } from "@/router/routes.types";
import { feature1Routes } from "../features/feature1/navigation/routes";
import { feature2Routes } from "../features/feature2/navigation/routes";

export const moduleRouteConfig: FeatureRouteModule = {
    id: "module-id",
    name: "Module Name",
    basePath: "/module-base-path",
    layout: "module-layout-name", // Maps to the key in main.tsx routesByLayout
    routes: {
        children: [
            ...feature1Routes,
            ...feature2Routes,
        ],
    },
};
```

This object is then registered via `routeRegistry.register(moduleRouteConfig)` either manually or automatically (via `featureLoader.ts`).

## 5. Summary Check-list for creating a new module
1. [ ] Create `src/modules/<new-module>/layout/<NewModule>Layout.tsx` with `<Outlet />`.
2. [ ] Register the layout wrapper in `src/main.tsx`.
3. [ ] Create your first feature under `src/modules/<new-module>/features/<feature-name>/`.
4. [ ] Define `routes.ts` in your feature.
5. [ ] Aggregate feature routes in `src/modules/<new-module>/navigation/routes.ts` returning a `FeatureRouteModule`.
6. [ ] Ensure the layout name matches the `layout` string in `FeatureRouteModule`.
