---
name: nota-project-guide
description: Complete end-to-end guide, architectural blueprint, and operational playbook for the Nota Dashboard project. Use this skill to understand the system domains, backend API integration patterns (OpenAPI /system-managements), UI/UX design tokens, i18n localization, and step-by-step workflow for implementing or extending features.
---

# Nota Dashboard Complete Project & Integration Playbook

This skill serves as the comprehensive architectural guide and workflow handbook for developing, maintaining, and integrating features in the **Nota Dashboard** (`nota-dashboard`) codebase.

---

## 🏛️ 1. Project Domain & Business Architecture

**Nota** is a digital ecosystem tailored for Egyptian lawyers, legal advocates, and clients. The dashboard provides comprehensive administrative and operational oversight through specialized modules:

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                                 NOTA DASHBOARD                                     │
├─────────────────┬─────────────────┬─────────────────┬──────────────┬──────────────┤
│  Main Modules   │  Legal Services │  Communication  │ Monetization │ Platform Adm │
├─────────────────┼─────────────────┼─────────────────┼──────────────┼──────────────┤
│ • Users/Lawyers │ • Delegations   │ • Community     │ • Billing &  │ • Settings   │
│ • Bar Records   │   (الإنابات)    │   Discussions   │   Wallet     │ • Admin Roles│
│ • ID Cards      │ • Courts/Fees   │ • Violation     │ • Banners    │ • Security   │
│   Verification  │ • Moderation    │   Reports       │   & Ads      │   Policies   │
└─────────────────┴─────────────────┴─────────────────┴──────────────┴──────────────┘
```

### Core Business Modules & Endpoints (`/api/system-managements/*`)

1. **Authentication (`src/auth/`)**:
   - `POST /api/auth/login`: `{ identifier, password, deviceName }` -> `{ token, user }`.
   - Admin session with role, permissions, and token management in HTTP-only cookies / authStore.

2. **Lawyers & Users (`main/features/users/`)**:
   - `GET /system-managements/users`: Directory of lawyers and clients with syndicate branches, bar registration numbers, and verification status (`unverified`, `pending`, `verified`, `rejected`, `suspended`).
   - `POST /system-managements/verifications/{id}/approve` & `POST /system-managements/verifications/{id}/reject`: Review front/back syndicate ID cards and approve/reject applications.
   - `POST /system-managements/users/{id}/block`: Block user account with mandatory reason (`{ reason: string }`).
   - `POST /system-managements/users/{id}/unblock`: Unblock and reactivate user account.
   - `PATCH /system-managements/users/{id}`: Update user information (title, barBranch, etc.).

3. **Courtroom Delegations & Notas (`main/features/notas/`)**:
   - `GET /system-managements/delegations`: Courtroom hearing delegations, required legal actions, courts, categories, and fees.
   - `POST /system-managements/delegations/{id}/approve` & `POST /reject`: Moderation decisions before public listing.
   - `DELETE /system-managements/delegations/{id}`: Cancellation.

4. **Community & Legal Groups (`main/features/groups/`)**:
   - `GET /system-managements/community`: Top KPI stats (`postsThisMonth`, `openReports`, `totalComments`).
   - `GET /system-managements/community/posts`: Post moderation (`pending`, `published`, `rejected`).
   - `GET /system-managements/community/reports`: Content violation reports with resolution actions (`dismiss`, `warn`, `remove`).
   - `GET /system-managements/community/comments`: Comments control and deletion.

5. **Banners & Sponsored Ads (`main/features/banners/`)**:
   - `GET /system-managements/ads/campaigns`: Track campaigns, impressions, clicks, CTR, and advertiser budget.
   - `POST /system-managements/ads/campaigns`: Launch new campaigns.

6. **Billing & Wallet Finance (`main/features/billing/`)**:
   - `GET /system-managements/finance`: Overview metrics, monthly revenue trend chart, and transactions ledger.
   - `POST /system-managements/finance/wallets/{userId}/adjust`: Manual balance adjustments with reason audit.

7. **Settings & Governance (`settings/features/*`)**:
   - **System Settings (`system-settings/`)**: `GET` & `PATCH /system-managements/settings` (Maintenance mode, auto-logout, session timeout, commission %, gateway).
   - **Roles & Permissions (`roles-permissions/`)**:
     - `GET`, `POST`, `PATCH`, `DELETE /system-managements/roles` (Matrix of 7 modules: `users`, `community`, `finance`, `delegations`, `ads`, `analytics`, `settings` with levels `none`, `view`, `manage`).
     - `GET /system-managements/administrators`: List administrators.
     - `POST /system-managements/administrators`: Create new administrator (`firstName`, `lastName`, `email`, `phone`, `password`, `adminRoleId`, `title`, `isActive`).
     - `PATCH /system-managements/administrators/{id}/role`: Assign role to administrator.
   - **Frequently Asked Questions (`faq/`)**:
     - `GET /system-managements/faqs`: List questions with pagination (`page`, `per_page`, `search`, `category`, `is_published`).
     - `POST /system-managements/faqs`: Create question (`question`, `answer`, `category`, `isPublished`, `sortOrder`).
     - `GET /system-managements/faqs/{id}`: View question details.
     - `PATCH /system-managements/faqs/{id}`: Update question content, category, publication status, or sort order.
     - `DELETE /system-managements/faqs/{id}`: Remove question.
   - **Legal Services Catalog (`services/`)**:
     - `GET /system-managements/nota-types`: List legal services / consultation types (`name`, `slug`, `icon`, `baseFee`, `isActive`, `sortOrder`, `notasCount`).
     - `POST /system-managements/nota-types`: Create service (`name`, `slug`, `description`, `icon`, `baseFee`, `isActive`, `sortOrder`).
     - `GET /system-managements/nota-types/{id}`: View service details.
     - `PATCH /system-managements/nota-types/{id}`: Update service pricing, icon, description, or activation status.
     - `DELETE /system-managements/nota-types/{id}`: Remove service from active catalog.
   - **Courts & Geographic Hierarchy (`courts/`)**:
     - **Governorates**: `GET`, `POST /system-managements/locations/governorates`, `GET`, `PATCH`, `DELETE /system-managements/locations/governorates/{id}`.
     - **Cities / Districts**: `GET`, `POST /system-managements/locations/cities` (`governorateId`, `name`, `isActive`, `sortOrder`), `GET`, `PATCH`, `DELETE /system-managements/locations/cities/{id}`.
     - **Courts & Circuits**: `GET`, `POST /system-managements/locations/courts` (`governorateId`, `cityId`, `name`, `type`, `address`, `mapUrl`, `isActive`, `sortOrder`, `metadata: { circuits, workingHours }`), `GET`, `PATCH`, `DELETE /system-managements/locations/courts/{id}`.
   - **Profile (`profile/`)**: Password reset and credentials verification.

---

## 🏗️ 2. Standard Feature Directory Architecture

Every feature under `src/modules/dashboard/[module]/features/[feature-name]/` MUST strictly follow this self-contained structure:

```text
[feature-name]/
├── api/
│   ├── config.ts              # Mock toggle & feature configurations
│   ├── mock-data.ts           # Realistic in-memory dataset & simulated API latency
│   ├── [feature].api.ts       # 3-tier dual-mode pure API methods
│   ├── [feature].keys.ts      # TanStack Query keys factory
│   ├── [feature].queries.ts   # Custom useQuery hooks (forwarding AbortSignal)
│   ├── [feature].mutations.ts # Custom useMutation hooks (invalidating query cache)
│   └── index.ts               # Barrel export for API layer
├── components/                # Feature-specific subcomponents (Modals, Details, Filters)
│   └── index.ts
├── locales/
│   ├── en.json                # English strings
│   └── ar.json                # Arabic (RTL) strings
├── navigation/
│   ├── nav.ts                 # Sidebar navigation definition
│   ├── paths.ts               # Path routing constants
│   ├── routes.ts              # Route configuration array with lazy loading
│   └── index.ts
├── pages/
│   └── main.tsx               # Primary orchestrator page
├── types/
│   ├── [feature].types.ts     # TypeScript interfaces and request payloads
│   └── index.ts
└── index.ts                   # Feature root export
```

---

## ⚡ 3. The 3-Tier Dual-Mode API Pattern

All API integrations MUST support both a live backend and standalone mock mode seamlessly:

```typescript
// 1. In [feature].api.ts
import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/config/env";
import { mockFeatureApi } from "./mock-data";

const USE_MOCK_DATA = false; // Toggle for isolated testing
const BASE_URL = "/system-managements/[feature]";

export const featureApi = {
    getList: async (params?: QueryParams, signal?: AbortSignal) => {
        if (API_CONFIG.USE_MOCK_DATA || USE_MOCK_DATA) {
            return mockFeatureApi.getList(params);
        }
        const response = await api.get<ApiResponse<DataResponse>>(BASE_URL, { params, signal });
        if (response.error || !response.data?.data) {
            throw new Error(response.error?.message || "Failed to fetch data");
        }
        return response.data.data;
    },
};
```

```typescript
// 2. Centralized Query Keys in [feature].keys.ts
export const featureKeys = {
    all: ["[feature]"] as const,
    lists: () => [...featureKeys.all, "list"] as const,
    list: (params?: any) => (params ? [...featureKeys.lists(), params] as const : featureKeys.lists()),
    detail: (id: string | number) => [...featureKeys.all, "detail", id] as const,
};
```

```typescript
// 3. Custom Hooks in [feature].queries.ts & [feature].mutations.ts
export const useFeatureList = (params?: QueryParams) => {
    return useQuery({
        queryKey: featureKeys.list(params),
        queryFn: ({ signal }) => featureApi.getList(params, signal),
    });
};

export function useUpdateFeature() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string | number; payload: any }) =>
            featureApi.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: featureKeys.all });
        },
    });
}
```

---

## 🎨 4. Design System, Color Tokens & Layout Rules

### 4.1 Strict Dashboard Colors (CSS Variables)
Never hardcode hex colors or default Tailwind palettes in dashboard features. Exclusively use CSS custom properties from `src/index.css`:
- **Background**: `bg-dashboard-background` (`var(--color-dashboard-background)` = `#0F1010`)
- **Card / Surface**: `bg-dashboard-card` (`var(--color-dashboard-card)` = `#161618`)
- **Primary Accent**: `bg-dashboard-primary` (`var(--color-dashboard-primary)` = `#6975E2`)
- **Secondary / Hover / Active State**: `bg-dashboard-secondary` (`var(--color-dashboard-secondary)` = `#1D1D1F`). **Always** use this for hover effects and active list items (`hover:bg-dashboard-secondary`).
- **Border**: `border-dashboard-border` (`var(--color-dashboard-border)` = `#2A2A2C`)
- **Muted Text**: `text-dashboard-muted-foreground` (`#8E8E93`)

### 4.2 Data Tables & Scrolling Rules
- **Container**: Wrap data tables in `w-full overflow-x-auto custom-scrollbar`.
- **Column Widths**: Provide explicit `headerClassName="min-w-[140px]"` on each column to prevent narrow mobile truncation.
- **Actions Column**: Set `headerClassName="min-w-[100px] text-right"`, `cellClassName="text-right"`, `variant="actions"`.
- **Table Head Rule**: NEVER put `first:w-full` on `TableHead` in `src/design-system/components/table.tsx`.

### 4.3 Form Inputs & Modals Best Practices
- **No Dummy Pre-filled Data**: Initial states for creation forms must be clean empty strings `""` (or neutral booleans/unverified defaults).
- **Subtle Placeholders**: Use translated guidance hints with `placeholder:text-dashboard-muted-foreground/40` so they cannot be mistaken for filled values.
- **Confirmations**: Never use native `window.confirm()`. Always use `<ConfirmDialog>` with danger variant for destructive actions.

---

## 🌐 5. i18n Localization Guidelines

1. **Zero Hardcoded Strings**: All text rendered to the user must use `useLanguage("namespace")`.
2. **File Registration**: Locales in `src/modules/dashboard/.../[feature]/locales/en.json` and `ar.json` are automatically registered by glob pattern in `src/i18n/index.ts`.
3. **Dual Language Mirroring**: Every key added in `en.json` must be faithfully mirrored with natural Arabic in `ar.json`.

---

## 🚀 6. Step-by-Step New Feature Checklist

When requested to build, update, or integrate a dashboard feature:

1. **Review Spec**: Inspect the OpenAPI endpoint schemas (`Default module.openapi.json`, `setting.json`, `groups.json`, etc.).
2. **Update Types**: Define data models, query params, and mutation payloads in `types/[feature].types.ts`.
3. **Build Mock Dataset**: Mirror real backend response schemas in `api/mock-data.ts` with filtering and latency.
4. **Implement API Client**: Write pure dual-mode functions in `api/[feature].api.ts`.
5. **Implement React Query Layer**: Setup keys factory, query hooks (forwarding `signal`), and mutation hooks (invalidating query cache).
6. **Create Subcomponents & Modals**: Keep page clean by building specialized modals in `components/`.
7. **Assemble Main Page (`pages/main.tsx`)**:
   - Add KPI summary cards.
   - Tab switcher if multi-view workflow.
   - Search bar with debouncing: `const debouncedSearch = useDebounce(search, 400)`.
   - Filter dropdowns and `DataTable`.
   - Server-side pagination footer.
8. **Add Localization**: Add full key sets in `locales/en.json` and `locales/ar.json`.
9. **Typecheck & Verify**: Run `cmd.exe /c "npm run typecheck"` in powershell and ensure **0 errors**.
