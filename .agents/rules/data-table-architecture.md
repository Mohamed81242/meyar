# Data Table Architecture & SOLID Principles Guide

All table implementations, modifications, and new feature tables in this codebase MUST strictly follow the `DataTable` architecture detailed below.

---

## 1. Core Abstractions

Every feature table MUST use the centralized `DataTable` component suite from `@/design-system`:

1. **`DataTable<T>`**: Generic type-safe table renderer (`src/design-system/components/DataTable.tsx`).
   - Do NOT construct raw `<table>`, `<thead>`, or `<tbody>` loops manually in feature components.
   - Pass `data: T[]` and `columns: DataTableColumn<T>[]`.
   - **MANDATORY**: Always provide `renderContextMenu={(item) => renderContextMenuItems(item, actions)}` on every `<DataTable>`.

2. **`useTableActions<T>` Hook**: Centralized state management (`src/design-system/hooks/useTableActions.ts`).
   - Manages selected item (`selectedItem`, `openDetails`, `closeDetails`), delete confirm state (`itemToDelete`, `isDeleteOpen`, `openDelete`, `confirmDelete`), and clipboard actions.
   - Provides pre-configured `deleteDialogProps` to spread into `<ConfirmDialog {...tableActions.deleteDialogProps} />`.

3. **`TableActions` & `RowActionsDropdown`**: Declarative single-source-of-truth row action menu system (`src/design-system/components/TableActions.tsx`).
   - Define row actions as `TableActionItem<T>[]` once.
   - **MANDATORY**: Shared automatically between BOTH the 3-dots dropdown (`<RowActionsDropdown item={item} actions={actions} />`) in the actions column AND the right-click context menu (`renderContextMenu={(item) => renderContextMenuItems(item, actions)}`).

---

## 2. Default Styling & Column Variants

- **Default Cell Padding & Alignments**:
  - All `<TableCell>` elements automatically default to `py-3.5` and standard typography.
  - Column `id: "actions"` or `variant: "actions"` automatically receives header width `w-12 py-3`.
- **Column Variants**:
  - `variant: "muted"` applies secondary text styling (`text-xs text-dashboard-muted-foreground`).
- **Cell Presets**:
  - Use `<EntityAvatarCell name={...} image={...} />` for entity names with avatars.
  - Use `<StatusBadgeCell status={...} />` for active/pending status badges.
  - Use `<BadgeCell label={...} />` for pill badges (roles, categories).

---

## 3. Mandatory Pattern for Feature Tables

Every table MUST implement both action columns and right-click context menus using `TableActionItem<T>[]`:

```tsx
// 1. In Page Component (e.g. main.tsx):
const tableActions = useTableActions<Entity>({
    entityName: "EntityName",
    labelKey: "title",
    isDeleting: deleteMutation.isPending,
    onDelete: (item) => deleteMutation.mutate(item.id),
});

return (
    <>
        <FeatureList
            data={data}
            onRowClick={(item) => navigate(`/details/${item.id}`)}
            onDelete={tableActions.openDelete}
        />
        <ConfirmDialog {...tableActions.deleteDialogProps} />
    </>
);

// 2. In List Component (e.g. FeatureList.tsx):
const actions: TableActionItem<Entity>[] = [
    { id: "edit", label: "Edit / View", icon: Edit2, onClick: onRowClick, separator: true },
    { id: "delete", label: "Delete", icon: Trash2, variant: "destructive", onClick: onDelete },
];

const columns: DataTableColumn<Entity>[] = [
    { id: "title", header: "Title", cell: (item) => <EntityAvatarCell name={item.title} /> },
    { id: "status", header: "Status", cell: (item) => <StatusBadgeCell status={item.status} /> },
    { id: "actions", header: "", variant: "actions", cell: (item) => <RowActionsDropdown item={item} actions={actions} /> },
];

return (
    <DataTable
        data={data}
        columns={columns}
        onRowClick={onRowClick}
        renderContextMenu={(item) => renderContextMenuItems(item, actions)}
    />
);
```
