---
trigger: always_on
---

# Project Architecture & Codebase Structure Guide

All modifications and new developments MUST follow the established codebase architecture, styling patterns, and system guidelines described below.

---

## 1. Directory Structure & Key Modules

The codebase is organized as a structured, componentized React application:

- **`src/assets/`**: Static image assets, icons/graphics, etc.
- **`src/auth/`**: Authentication helpers, JWT verification, user session definitions.
- **`src/constants/`**: Predefined configurations, select options, global application limits.
- **`src/contexts/`**: Shared contexts including Language/Translation context, routing context.
- **`src/design-system/`**: Custom Tailwind-based UI components.
  - **Rules**: Always import predefined elements (e.g. `button`, `input`, `table`, `tabs`) rather than building raw, non-compliant HTML nodes.
- **`src/features/`**: Feature modules. Separated strictly into:
  - `auth/`: Login, register, forgot-password pages.
  - `dashboard/`: Highly modular subfolders (e.g., service-requests, and other dashboard modules).
  - `landing/`: Landing pages.
  - `not-found/`: Not found and error pages.
- **`src/layouts/`**: Core structural layouts:
  - `RootLayout.tsx`: Base container, handles direction (LTR/RTL) and initialization.
  - `AuthLayout.tsx`: Centered side-by-side design layout for registration workflows.
  - `DashboardLayout.tsx`: Sided navigation, headers, and dashboard content.

## 2. Page & Feature Architecture Guidelines

1. **SOLID Sub-Component Separation**:
   - DO NOT write large layout or logic chains in a single file.
   - Separate complex sections into modular, focused files (e.g. split forms, filters, details views, and tables into separate files).
2. **Path Helpers**:
   - NEVER hardcode URL redirect locations. Use the structured maps defined in `src/router/paths.ts` or path registries.
3. **Lazy Loading**:
   - Utilize Vite dynamic imports (e.g. `React.lazy`) to ensure bundle sizes stay split and load times fast.

---

## 3. UI, CSS Variables & Styling System

The application styling is based on CSS custom properties (variables) defined under `@theme` inside `src/index.css`.

- **Dashboard Variables**:
  - Always use the variables containing `dashboard` in their names when editing files inside `src/features/dashboard`.
  - **Background**: `var(--color-dashboard-background)`
  - **Primary**: `var(--color-dashboard-primary)`
  - **Secondary**: `var(--color-dashboard-secondary)` (compulsory for hover states, e.g. `hover:bg-dashboard-secondary`).
  - **Muted**: `var(--color-dashboard-muted)` and `var(--color-dashboard-muted-foreground)`.

---

## 4. Zustand State Management

The application state uses Zustand.
- **Selective Subscriptions**:
  - NEVER call a Zustand hook without a selector:
    - **BAD**: `const store = useStore()` (causes components to re-render on any store change).
    - **GOOD**: `const activeItem = useStore(state => state.activeItem)` (selects only what is needed).