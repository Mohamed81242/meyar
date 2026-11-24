---
name: feature-layout-guide
description: A comprehensive guide on how to scaffold and structure new dashboard features using the unified FeatureLayout component suite.
---

# FeatureLayout Guide

The `FeatureLayout` component suite (found in `src/design-system/components/layout/FeatureLayout.tsx`) is the standardized layout system for all dashboard modules in this project. It ensures a consistent, modern, high-quality aesthetic with proper scroll-locking, animations, and toolbars across all pages.

When creating a new dashboard module or refactoring an old one, you **MUST** use this layout system instead of raw HTML divs for structural page setup.

## Component Anatomy

The `FeatureLayout` uses compound components to build up the view logically.

### 1. Root Container
```tsx
<FeatureLayout>
   {/* All content goes here */}
</FeatureLayout>
```
* **Purpose**: Acts as the main viewport wrapper. It uses `h-full flex flex-col overflow-hidden` to perfectly constrain the layout inside the parent dashboard view without causing global body scrollbars.

### 2. Header and Toolbar
```tsx
<FeatureLayout.Header className="px-6 py-4 border-b border-dashboard-border shrink-0 bg-dashboard-card z-10 flex flex-col md:flex-row gap-4 items-start md:items-center">
    {/* Left Side: Dynamic Browser-Style Tabs */}
    <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <div className="flex items-center rounded-full p-1 border border-dashboard-border bg-dashboard-background/50 overflow-x-auto hide-scrollbar max-w-full">
            {tabs.map((tab, index) => {
                const isActive = activeTabId === tab.id;
                const isDraggable = index !== 0;
                return (
                    <div
                        key={tab.id}
                        onClick={() => setActiveTabId(tab.id)}
                        draggable={isDraggable}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                            "px-4 py-1.5 text-[13px] font-semibold rounded-full transition-all outline-none flex items-center gap-2 select-none whitespace-nowrap shrink-0",
                            isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
                            isActive
                                ? "bg-dashboard-secondary text-dashboard-foreground shadow-sm"
                                : "bg-transparent text-dashboard-muted-foreground hover:bg-dashboard-secondary/40 hover:text-dashboard-foreground",
                            draggedIndex === index ? "opacity-30 scale-95 border border-dashed border-dashboard-border" : ""
                        )}
                    >
                        <span>{tab.label}</span>
                        {/* Close button for non-list tabs */}
                        {tab.type !== "list" && (
                            <button onClick={(e) => { e.stopPropagation(); handleCloseTab(tab.id); }}>
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                );
            })}
            <button onClick={handleAddTab} className="w-7 h-7 rounded-full flex items-center justify-center ..."><Plus/></button>
        </div>
    </div>
    
    {/* Right Side: Actions & Filters (Only show on list view) */}
    {activeTab.type === "list" && (
        <FeatureLayout.Toolbar>
            <FeatureLayout.Search value={search} onChange={setSearch} />
            <DropdownMenu>
               {/* Filter logic here */}
            </DropdownMenu>
        </FeatureLayout.Toolbar>
    )}
</FeatureLayout.Header>
```
* **Pattern Alert**: For complex modules, we strongly prefer the dynamic "Browser-Style Tabs" approach. We render the tabs manually and apply HTML5 `draggable` events (`onDragStart`, `onDragOver`, `onDragEnd`) to allow reordering. Note the `.hide-scrollbar` class to prevent ugly scroll tracks.

#### Drag & Drop Tab Handlers (Standard Snippet)
```typescript
const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

const handleDragStart = (e: React.DragEvent, index: number) => {
    if (index === 0) return; // Pin the first tab (usually the main list)
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
};

const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (index === 0) return;
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newTabs = [...tabs];
    const draggedItem = newTabs[draggedIndex];
    newTabs.splice(draggedIndex, 1);
    newTabs.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setTabs(newTabs);
};

const handleDragEnd = () => setDraggedIndex(null);
```

#### Tab Management (Max Tabs Limit & Auto-close)
To prevent the horizontal tab bar from overflowing, you must implement a `MAX_TABS` limit (typically 5, including the main list tab). When this limit is reached, automatically close the oldest open item tab (index 1) to make room for the new one.

```typescript
const MAX_TABS = 5; // 1 list tab + 4 open item tabs

const handleAddTab = () => {
    const existingCreateTab = tabs.find(t => t.type === "create");
    if (existingCreateTab) {
        setActiveTabId(existingCreateTab.id);
    } else {
        const newTabId = "create";
        setTabs(prev => {
            const nextTabs = [...prev];
            if (nextTabs.length >= MAX_TABS) {
                nextTabs.splice(1, 1); // Auto-close oldest open tab
            }
            return [...nextTabs, { id: newTabId, label: "New Item", type: "create" }];
        });
        setActiveTabId(newTabId);
    }
};

const handleOpenItem = (item: any) => {
    const existingEditTab = tabs.find(t => t.type === "edit" && t.itemId === item.id);
    if (existingEditTab) {
        setActiveTabId(existingEditTab.id);
    } else {
        const newTabId = `edit-${item.id}`;
        setTabs(prev => {
            const nextTabs = [...prev];
            if (nextTabs.length >= MAX_TABS) {
                nextTabs.splice(1, 1); // Auto-close oldest open tab
            }
            return [...nextTabs, { id: newTabId, label: item.name, type: "edit", itemId: item.id }];
        });
        setActiveTabId(newTabId);
    }
};
```

### 3. Body and List View (Content)
```tsx
<FeatureLayout.Body>
    {activeTab.type === "list" ? (
        <FeatureLayout.Content>
            <div className="p-6">
                <Table>
                   {/* Table configuration */}
                   <TableBody>
                        {data.map(item => (
                            <ContextMenu key={item.id}>
                                <ContextMenuTrigger asChild>
                                    <TableRow onClick={() => handleOpenItem(item)}>
                                        {/* Table Cells */}
                                    </TableRow>
                                </ContextMenuTrigger>
                                <ContextMenuContent>
                                    <ContextMenuItem onClick={() => handleOpenItem(item)}>Open Tab</ContextMenuItem>
                                    <ContextMenuItem onClick={() => delete(item)}>Delete</ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        ))}
                   </TableBody>
                </Table>
            </div>
        </FeatureLayout.Content>
    ) : (
        /* Form View */
    )}
</FeatureLayout.Body>
```
* **Context Menus**: All table rows must be wrapped in a `ContextMenu`. This allows users to right-click rows for quick actions (Open Tab, Delete) without needing to use the exact `MoreHorizontal` dropdown button.

### 4. Detail Views & Forms
For inline forms (create/edit tabs):

```tsx
<div className="flex flex-col flex-1 h-full min-h-0 overflow-hidden bg-dashboard">
    <div className="flex-1 overflow-y-auto pb-20">
        <FeatureLayout.DetailContent>
            {/* Left side (Main Form) */}
            <FeatureLayout.DetailMain>
                <div className="bg-dashboard-card rounded-[24px] border border-dashboard-border p-6 space-y-6">
                    <h2 className="text-lg font-bold text-dashboard-foreground">New Item</h2>
                    {/* Main inputs (Name, Description, etc.) */}
                </div>
            </FeatureLayout.DetailMain>
            
            {/* Right side (Quick Settings sidebar) */}
            <FeatureLayout.DetailSidebar>
                <div className="bg-dashboard-card rounded-[24px] border border-dashboard-border p-6 sticky top-6">
                    {/* Meta info, Status Switches, Category Dropdowns */}
                </div>
            </FeatureLayout.DetailSidebar>
        </FeatureLayout.DetailContent>
    </div>
    
    {/* Sticky Footer */}
    <FeatureLayout.Footer>
        <Button variant="outline" className="rounded-full">Cancel</Button>
        <Button className="rounded-full bg-dashboard-primary">Save Changes</Button>
    </FeatureLayout.Footer>
</div>
```
* **Important Layout Rule**: The `FeatureLayout.Footer` must be outside the `overflow-y-auto` scrolling container but inside the main flex column so that it sticks perfectly to the bottom of the viewport.

## Strict Styling Rules for the Dashboard
- **Never use hardcoded colors** (e.g. `#111`, `white/10`, `#2563EB`).
- **Always use CSS Variables**: `bg-dashboard-card`, `bg-dashboard-background`, `bg-dashboard-secondary`, `bg-dashboard-primary`, `text-dashboard-muted-foreground`, `border-dashboard-border`.
- **Inputs and Cards**: Use `bg-dashboard-background` inside panels to create depth against `bg-dashboard-card`.
- **Buttons**: Action buttons in footers should use `rounded-full` for a sleek, modern look.
