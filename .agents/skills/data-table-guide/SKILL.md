---
name: data-table-guide
description: A comprehensive guide on how to scaffold, refactor, and structure data tables using the centralized DataTable, useTableActions, and useContextMenuActions hooks.
---

# Data Table & Context Menu Architecture Guide

The `DataTable` suite (located in `@/design-system`) is the standardized, SOLID table architecture for all dashboard features in this application. It provides type-safe generics, declarative row actions, built-in delete confirm dialog integration, context menus, and cell presets.

When creating a new table or refactoring an existing table in any dashboard feature, you **MUST** use this architecture and **ALWAYS** implement right-click context menu handling.

## Component & Hook Anatomy

### 1. `DataTable<T>`
Generic data-driven table renderer component (`src/design-system/components/DataTable.tsx`).

```tsx
import { DataTable, type DataTableColumn } from "@/design-system";
```

- **Properties**:
  - `data: T[]` — Array of row objects.
  - `columns: DataTableColumn<T>[]` — Column configurations.
  - `getRowKey?: (item: T, index: number) => string | number` — Key extractor.
  - `onRowClick?: (item: T, index: number) => void` — Row click handler.
  - **`renderContextMenu?: (item: T, index: number) => React.ReactNode`** — **MANDATORY**: Context menu builder.
  - `isLoading?: boolean` — Loading state.
  - `emptyState?: React.ReactNode` — Empty state component.

---

### 2. `useContextMenuActions<T>` & `useTableActions<T>` Hooks

To eliminate action duplication between the table dropdown menu and the right-click context menu (and support standalone context menus without a table), use `useContextMenuActions` or `useTableActions`.

#### `useContextMenuActions<T>`
Single-sources action definitions for context menus and table dropdowns.

```tsx
import { useContextMenuActions, type TableActionItem } from "@/design-system";

const actions: TableActionItem<Member>[] = [
    { id: "edit", label: "Edit", icon: Edit2, onClick: (m) => openEdit(m) },
    { id: "delete", label: "Delete", icon: Trash2, variant: "destructive", onClick: (m) => openDelete(m) },
];

const { renderContextMenu, renderRowActions } = useContextMenuActions(actions);
```

- **When Table Exists**:
  - In column definition: `{ id: "actions", header: "Actions", variant: "actions", cell: (m) => renderRowActions(m) }`
  - In DataTable props: `<DataTable data={members} columns={columns} renderContextMenu={renderContextMenu} />`

- **When NO Table Exists (Standalone Grid / Cards / Context Menu)**:
  - Wrap any container with `ContextMenuAdvanced`:
    ```tsx
    <ContextMenuAdvanced menuContent={renderContextMenu(member)}>
        <CardContent member={member} />
    </ContextMenuAdvanced>
    ```

#### `useTableActions<T>`
Encapsulates table actions, selection state, delete modal confirmation, AND context menu rendering (`src/design-system/hooks/useTableActions.ts`).

```tsx
import { useTableActions } from "@/design-system";

const tableActions = useTableActions<Member>({
    actions: [
        { id: "edit", label: "Edit", onClick: (m) => openEdit(m) },
        { id: "delete", label: "Delete", variant: "destructive", onClick: (m) => openDelete(m) },
    ],
    entityName: "Member",
    labelKey: "name",
    isDeleting: deleteMutation.isPending,
    onDelete: (member) => deleteMutation.mutate(member.id),
});
```

- **Returns**:
  - `renderContextMenu(item)` / `renderRowActions(item)`
  - `selectedItem` / `openDetails` / `closeDetails` / `setSelectedItem`
  - `itemToDelete` / `isDeleteOpen` / `openDelete` / `closeDelete` / `confirmDelete`
  - `copyToClipboard(text, label)`
  - `deleteDialogProps` — Pre-built props ready for `<ConfirmDialog {...tableActions.deleteDialogProps} />`.

---

### 3. `TableActions` & `RowActionsDropdown`
Declarative single-source-of-truth for row actions (`src/design-system/components/TableActions.tsx`).

```tsx
import { RowActionsDropdown, renderContextMenuItems } from "@/design-system";
```

- Renders 3-dots dropdown in table column: `<RowActionsDropdown item={member} actions={actions} />`
- Renders right-click context menu in `DataTable`: `renderContextMenu={(member) => renderContextMenuItems(member, actions)}`

---

### 4. Standard Cell Presets
- `<EntityAvatarCell name={m.name} image={m.image} subtitle={m.email} />`
- `<StatusBadgeCell status={userStatus} />`
- `<BadgeCell label={roleCaption} />`

---

## Step-by-Step Scaffolding Checklist

1. **Define Actions**: Pass action definitions to `useContextMenuActions(actions)` or `useTableActions({ actions, ... })`.
2. **Table Integration**:
   - In Action column: `cell: (item) => renderRowActions(item)`
   - In `<DataTable>`: `renderContextMenu={renderContextMenu}`
3. **Non-Table / Grid Integration**:
   - Pass `renderContextMenu(item)` to `<ContextMenuAdvanced menuContent={renderContextMenu(item)}>` wrapping your grid item or card.
4. **Verify**:
   - Run `npx tsc --noEmit` to confirm zero compilation errors.
