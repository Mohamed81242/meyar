---
trigger: always_on
---

# Nota Dashboard Feature & Module Rules

All new modules, dashboard features, and updates in this repository MUST strictly follow the guidelines detailed below.

---

## 1. Directory Structure & Feature Layout

Every feature under `src/modules/dashboard/main/features/` must be self-contained and organized as follows:

```text
src/modules/dashboard/main/features/[feature-name]/
├── api/                  # React Query hooks, API requests, & mock data
│   ├── config.ts         # USE_MOCK_DATA configurations
│   ├── mock-data.ts      # In-memory mock data arrays & simulated latency API
│   ├── [feature].api.ts  # Dual-mode (mock/real) API methods
│   ├── [feature].keys.ts # Centralized query key definitions
│   ├── [feature].queries.ts   # Custom useQuery hooks (forwarding AbortSignal)
│   ├── [feature].mutations.ts # Custom useMutation hooks (invalidating query cache)
│   └── index.ts          # Barrel export for all API-related hooks/methods
├── components/           # Reusable, feature-specific subcomponents
├── locales/              # i18n translation files
│   ├── en.json           # English localization
│   └── ar.json           # Arabic (RTL) localization
├── navigation/           # Route configuration & Sidebar Navigation Item
│   ├── index.ts          # Exports navigation & routes
│   ├── nav.ts            # Defines the sidebar NavItem
│   ├── paths.ts          # Exports path helper constants
│   └── routes.ts         # Defines the RouteConfig array
├── pages/                # Main view/page orchestrators
│   └── main.tsx          # Feature main container
├── types/                # Type definitions and interfaces
│   └── [feature].types.ts
└── index.ts              # Feature root entry (re-exports types/api)
```

---

## 2.  User Flows & Architecture

To deliver a high-end, premium workspace experience matching modern platforms, implement these UI and layout standards:

### 2.1 Color Palette & Styling
- **No Hardcoded Hex Colors**: You must exclusively use custom CSS variables defined in `src/index.css`.
- **Dashboard Variables**:
  - Background: `var(--color-dashboard-background)` (deep dark black: `#0F1010`)
  - Primary Accent: `var(--color-dashboard-primary)` (indigo/purple: `#6975E2`)
  - Secondary/Hover: `var(--color-dashboard-secondary)` (`#1D1D1F`). **Always** use this color for active states, lists items, and hover effects.
  - Border: `var(--color-dashboard-border)` (`#2A2A2C`)
  - Card/Popover: `var(--color-dashboard-card)` / `var(--color-dashboard-popover)`
- **Styling Edges**: Use extremely subtle borders (`border border-dashboard-border` or `border-white/5`) to match Linear's panel lines.
- **Buttons**: Footer/main actions must utilize pill-shaped buttons (`rounded-full`) for high-polish aesthetic.

### 2.2 Browser-Style Tabs & Navigation
For multi-view workflows, implement browser-style tabs at the top of the header:
- **Maximum Tabs Limit**: Define `MAX_TABS = 5` (typically 1 list tab + up to 4 detail/create tabs).
- **Auto-Close Rule**: When opening a 6th tab, programmatically close the oldest open item tab (index 1) to prevent layout overflow.
- **Drag-and-Drop Reordering**: Implement HTML5 drag-and-drop handles on tabs to allow manual reordering.
- **Hide Scrollbars**: Use `.hide-scrollbar` on the tab navigation container.

### 2.3 Context Menus & Interaction
- **List Quick Actions**: Wrap all data table rows (`TableRow`) in a `ContextMenu` from the design system. Right-clicking a row must show quick operations: **Open Tab**, **Delete**, **Change Status**.
- **Delete Confirmations**: NEVER use native `window.confirm` or `window.alert`. You MUST use the custom design system `<Dialog>` with confirmation buttons and clear, warnings that the action cannot be undone.

---

## 3. Strict Localization Rules (i18n)

- **Zero Hardcoded Texts**: Under no circumstances should plain strings be rendered in components. All titles, subtitles, headers, labels, placeholders, dropdown items, toast messages, and error descriptions must be translated.
- **The `useLanguage` Hook**: Import and use `const { t } = useLanguage("namespace")` (where the namespace corresponds to the feature name or `shared`).
- **Locales Registration**: Store translations inside `src/modules/dashboard/main/features/[feature]/locales/en.json` and `ar.json`. The application automatically registers these files using Vite glob imports in `src/i18n/index.ts`.

---

## 4. Nota Business Model Integration

Features and entities must reflect the business model rules defined in `BUSINESS_MODEL.md`:

### 4.1 Tenancy & Data Isolation
- Ensure all queries pass logical filters suited to tenant tiers:
  - **Pool (Standard)**: RLS logic (data filtered via PostgreSQL Row-Level Security).
  - **Bridge (Default)**: Schema-based division (`schema_slug`).
  - **Silo (Enterprise)**: Dedicated database instance context.
- UI elements must handle plan restrictions gracefully (e.g. disabling custom domain forms or checking storage limits when uploading assets).

### 4.2 Core ITIL Workflows
Understand and relate entity interactions:
- **Incidents**: Interruptions. Can lead to the creation of **Problems** (root cause analysis).
- **Service Requests**: Automated catalogs for standard items.
- **Changes**: Gatekept deployments requiring approval and rollback procedures.
- **Asset/CMDB**: Maps software, hardware, and relationship mappings.
- **SLA Policies**: Response and resolution timers. Ticket details must display current SLA status, countdowns, and breaches.

### 4.3 Omnichannel & AI
- **WhatsApp Helpdesk**: Support for chat integrations. Track inbound message mappings to senders.
- **AI Automation**: Track consumption logging (token audits) for AI-generated first responses and resolutions. Provide buttons or indicators when a resolution was proposed by the AI.

---

## 5. First-Time Module Group Setup

When creating a completely new dashboard layout/module group (like Settings or Projects) instead of a feature under an existing module:

### 5.1 Directory Layout
Create a root module folder under `src/modules/dashboard/[module-name]/` with:
- `features/`: Holds all self-contained feature subfolders.
- `layout/`: Houses the main layout (`[Module]DashboardLayout.tsx`), `sidebar/` (with `index.tsx`), `navbar/` (with `index.tsx`), and layout-specific styling assets/themes.
- `navigation/`: Houses paths registry (`paths.ts`), routes module registry (`routes.ts`), and nav module registry (`nav.ts`).

### 5.2 Layout Requirements
- The layout component (`[Module]DashboardLayout.tsx`) must:
  - Utilize `TemplateStyles` with `themeName="dashboard"` to apply CSS variable styling rules.
  - Setup a responsive, collapsible Sidebar that uses `const { sections } = useNavItems("dashboard-[module-name]")` to load layouts correctly.
  - Render an animated route viewport using Framer Motion (`AnimatePresence` and `motion.div`) wrapping standard React Router `<Outlet />` and `<Suspense />` tags.
  - Nest the global AI Assistant (`<AiAssistant />`) inside the parent layout view container.

### 5.3 Sidebar Integration
- Ensure the custom sidebar retrieves only navigation items registered for the specific module:
  ```typescript
  const { sections } = useNavItems("dashboard-[module-name]");
  ```