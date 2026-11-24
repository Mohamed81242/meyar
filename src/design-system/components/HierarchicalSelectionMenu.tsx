import { cn } from "@/utils";
import { Check, ChevronRight, Folder, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface HierarchicalItem {
    id: string;
    name: string;
    parentId: string | null;
    children?: HierarchicalItem[] | null;
    [key: string]: any;
}

export interface HierarchicalSelectionMenuProps {
    items: HierarchicalItem[];
    value: string | null;
    onChange: (id: string | null) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
}

export function HierarchicalSelectionMenu({
    items,
    value,
    onChange,
    placeholder = "Select classification...",
    searchPlaceholder = "Search classifications...",
    emptyMessage = "No classifications found.",
}: HierarchicalSelectionMenuProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    // Build parent maps for easy path traversal
    const itemMap = useMemo(() => {
        const map = new Map<string, HierarchicalItem>();
        const traverse = (item: HierarchicalItem) => {
            const idStr = String(item.id);
            const parentIdStr = item.parentId ? String(item.parentId) : null;
            const normalizedItem = {
                ...item,
                id: idStr,
                parentId: parentIdStr,
            };
            map.set(idStr, normalizedItem);
            if (item.children) {
                item.children.forEach(traverse);
            }
        };
        items.forEach(traverse);
        return map;
    }, [items]);

    // Track active path columns
    const [selectedPath, setSelectedPath] = useState<string[]>([]);

    // Sync selected path with external value changes
    useEffect(() => {
        if (!value) {
            setSelectedPath([]);
            return;
        }

        const valStr = String(value);
        const path: string[] = [];
        let current = itemMap.get(valStr);
        while (current) {
            path.unshift(current.id);
            const parentId: string | null = current.parentId;
            current = parentId ? itemMap.get(parentId) : undefined;
        }
        setSelectedPath(path);
    }, [value, itemMap]);

    // Compute path names for breadcrumbs display
    const activePathNames = useMemo(() => {
        if (!value) return [];
        const pathNames: string[] = [];
        let current = itemMap.get(String(value));
        while (current) {
            pathNames.unshift(current.name);
            const parentId = current.parentId;
            current = parentId ? itemMap.get(parentId) : undefined;
        }
        return pathNames;
    }, [value, itemMap]);

    // Flat search candidates with breadcrumb paths
    const flatSearchedItems = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const query = searchQuery.toLowerCase();
        const results: { item: HierarchicalItem; path: string }[] = [];

        const getPathString = (item: HierarchicalItem): string => {
            const pathArr: string[] = [];
            let curr: HierarchicalItem | undefined = item;
            while (curr) {
                pathArr.unshift(curr.name);
                const parentId: string | null = curr.parentId;
                curr = parentId ? itemMap.get(parentId) : undefined;
            }
            return pathArr.join(" > ");
        };

        itemMap.forEach((item) => {
            if (item.name.toLowerCase().includes(query)) {
                results.push({
                    item,
                    path: getPathString(item),
                });
            }
        });

        return results;
    }, [searchQuery, itemMap]);

    // Automatically scroll container to the right when path expands
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollLeft = containerRef.current.scrollWidth;
        }
    }, [selectedPath]);

    const handleSelectColumnItem = (level: number, itemId: string) => {
        const nextPath = selectedPath.slice(0, level);
        nextPath.push(itemId);
        setSelectedPath(nextPath);
        onChange(itemId);
    };

    const handleSelectSearchResult = (itemId: string) => {
        onChange(itemId);
        setSearchQuery("");
    };

    // Calculate columns data based on selected path
    const columns = useMemo(() => {
        const cols: HierarchicalItem[][] = [items];

        for (let i = 0; i < selectedPath.length; i++) {
            const currentId = selectedPath[i];
            const currentItem = itemMap.get(currentId);
            if (
                currentItem &&
                currentItem.children &&
                currentItem.children.length > 0
            ) {
                cols.push(currentItem.children);
            }
        }
        return cols;
    }, [items, selectedPath, itemMap]);

    const activeItem = value ? itemMap.get(String(value)) : null;

    return (
        <div className="flex flex-col w-full gap-3 bg-dashboard-card/25 border border-dashboard-border rounded-[24px] p-5 shadow-lg select-none">
            {/* Header / Active Selection display */}
            <div className="flex items-center justify-between pb-3 border-b border-dashboard-border/50">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-dashboard-muted-foreground tracking-widest">
                        Selected Classification
                    </span>
                    {activePathNames.length > 1 && (
                        <div className="flex items-center gap-1 text-xs text-dashboard-muted-foreground flex-wrap">
                            {activePathNames.map((name, i) => (
                                <span key={i} className="flex items-center gap-1">
                                    {i > 0 && (
                                        <ChevronRight className="w-3 h-3 text-dashboard-muted-foreground/60 shrink-0 rtl:rotate-180" />
                                    )}
                                    <span
                                        className={cn(
                                            i === activePathNames.length - 1
                                                ? "font-bold text-dashboard-primary"
                                                : "text-dashboard-muted-foreground font-medium",
                                        )}
                                    >
                                        {name}
                                    </span>
                                </span>
                            ))}
                        </div>
                    )}
                    {activePathNames.length <= 1 && (
                        <span className="text-sm font-semibold text-dashboard-foreground">
                            {activeItem ? (
                                activeItem.name
                            ) : (
                                <span className="text-dashboard-muted-foreground italic">
                                    {placeholder}
                                </span>
                            )}
                        </span>
                    )}
                </div>
                {activeItem && (
                    <button
                        onClick={() => onChange(null)}
                        className="text-xs font-semibold text-red-500 hover:underline cursor-pointer"
                    >
                        Clear Selection
                    </button>
                )}
            </div>

            {/* Search Input bar */}
            <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dashboard-muted-foreground" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    aria-label={searchPlaceholder}
                    className="w-full h-10 pl-10 pr-4 bg-dashboard-background border border-dashboard-border rounded-xl text-xs font-semibold text-dashboard-foreground placeholder-dashboard-muted-foreground outline-none focus:border-dashboard-primary transition-all"
                />
            </div>

            {/* Content view (Search Results OR Columns Selector) */}
            <div className="relative w-full">
                {searchQuery.trim() ? (
                    /* Search results dropdown listing */
                    <div className="w-full bg-dashboard-background border border-dashboard-border rounded-xl max-h-75 overflow-y-auto p-2 flex flex-col gap-1 z-10">
                        {flatSearchedItems.length > 0 ? (
                            flatSearchedItems.map(({ item, path }) => {
                                const isSelected = String(item.id) === String(value);
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() =>
                                            handleSelectSearchResult(String(item.id))
                                        }
                                        className={cn(
                                            "flex flex-col items-start w-full px-3.5 py-2.5 rounded-lg text-left transition-all border border-transparent cursor-pointer",
                                            isSelected
                                                ? "bg-dashboard-primary/10 border-dashboard-primary/20 text-dashboard-primary"
                                                : "hover:bg-dashboard-secondary/50 text-dashboard-foreground",
                                        )}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className="text-xs font-bold">
                                                {item.name}
                                            </span>
                                            {isSelected && (
                                                <Check className="w-3.5 h-3.5" />
                                            )}
                                        </div>
                                        <span className="text-[10px] text-dashboard-muted-foreground mt-0.5 font-medium truncate max-w-full">
                                            {path}
                                        </span>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-xs text-dashboard-muted-foreground">
                                {emptyMessage}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Cascading finder-style columns selector */
                    <div
                        ref={containerRef}
                        className="flex overflow-x-auto gap-4 border border-dashboard-border rounded-xl bg-dashboard-background p-3 scroll-smooth min-h-55"
                    >
                        {columns.map((columnItems, level) => (
                            <div
                                key={level}
                                className="w-56 shrink-0 border-r border-dashboard-border/30 pr-4 last:border-0 last:pr-0 overflow-y-auto max-h-65 flex flex-col gap-1 scrollbar-thin"
                            >
                                {columnItems.map((item) => {
                                    const itemIdStr = String(item.id);
                                    const isPathActive =
                                        selectedPath[level] === itemIdStr;
                                    const isLeafSelected =
                                        String(value) === itemIdStr;
                                    const hasChildren = !!(
                                        item.children &&
                                        item.children.length > 0
                                    );

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() =>
                                                handleSelectColumnItem(
                                                    level,
                                                    itemIdStr,
                                                )
                                            }
                                            className={cn(
                                                "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer text-left w-full",
                                                isLeafSelected
                                                    ? "bg-dashboard-primary/20 border-dashboard-primary/40 text-dashboard-primary font-bold shadow-sm"
                                                    : isPathActive
                                                      ? "bg-dashboard-primary/10 border-dashboard-primary/20 text-dashboard-primary font-semibold"
                                                      : "border-transparent hover:bg-dashboard-secondary/50 text-dashboard-foreground",
                                            )}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <Folder
                                                    className={cn(
                                                        "w-3.5 h-3.5 shrink-0 transition-colors",
                                                        isLeafSelected || isPathActive
                                                            ? "text-dashboard-primary"
                                                            : "text-dashboard-muted-foreground",
                                                    )}
                                                />
                                                <span className="truncate">
                                                    {item.name}
                                                </span>
                                            </div>
                                            {hasChildren ? (
                                                <ChevronRight
                                                    className={cn(
                                                        "w-3.5 h-3.5 shrink-0 transition-colors rtl:rotate-180",
                                                        isPathActive
                                                            ? "text-dashboard-primary"
                                                            : "text-dashboard-muted-foreground",
                                                    )}
                                                />
                                            ) : (
                                                isLeafSelected && (
                                                    <Check className="w-3.5 h-3.5 shrink-0 text-dashboard-primary" />
                                                )
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
