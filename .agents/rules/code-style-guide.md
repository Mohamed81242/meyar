---
trigger: always_on
---

# Dashboard Rules

When working on the dashboard for this project (`src/features/dashboard` and related files), you MUST ALWAYS adhere to the following rules:

1. **Strict Color Palette**:
    - DO NOT use any raw hex codes or Tailwind default colors.
    - You must exclusively use the variables defined in `src/index.css`.
    - Specifically, ALWAYS ensure that all colors used in dashboard-related files and design systems use the variables with `dashboard` in the middle (e.g., `var(--color-dashboard-background)`, `var(--color-dashboard-primary)`, `var(--color-dashboard-muted)`, `var(--color-dashboard-card)`, etc.). Do not use the non-dashboard variables for dashboard components.
    - For any hover effects, ALWAYS use the `dashboard-secondary` color (e.g., `bg-dashboard-secondary`, `hover:bg-dashboard-secondary`, or `var(--color-dashboard-secondary)`).

2. **UI Implementation**:
    - ALWAYS clone the UI exactly from the attached images if provided. Do not use placeholders or deviate from the visual design.

3. **Code Quality & Architecture**:
    - DO NOT break the existing project structure. Follow the established patterns.
    - ALWAYS follow Clean Code and SOLID principles.
    - ALWAYS separate pages in features into smaller, focused components rather than keeping large amounts of layout or logic in a single page file.
