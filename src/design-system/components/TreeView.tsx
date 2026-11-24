import {
    ChevronDown,
    ChevronRight,
    Edit2,
    Plus,
    Trash2,
    Users,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import {
    ContextMenuAdvanced,
    ContextMenuAdvancedItem,
    ContextMenuAdvancedSeparator,
    ContextMenuAdvancedSub,
} from "./context menu core/contextMenuAdvanced";
export interface TreeTeam {
    id: string | number;
    name: string;
    [key: string]: any;
}

export interface TreeItem {
    id: string | number;
    name: string;
    code?: string;
    children?: TreeItem[] | null;
    teams?: TreeTeam[] | null;
    [key: string]: any;
}

export interface TreeViewProps<T extends TreeItem = TreeItem> {
    items: T[];
    onAction: (action: "create" | "edit" | "delete", item: T | null) => void;
    level?: number;
    teams?: TreeTeam[];
    onAssignTeam?: (
        item: T,
        teamId: string | number | null,
        teamIds?: (string | number)[],
    ) => void;
    renderNodeIcon?: (
        item: T,
        hasChildren: boolean,
        isExpanded: boolean,
    ) => ReactNode;
    emptyMessage?: string;
    labels?: {
        createSub?: string;
        editItem?: string;
        assignTeams?: string;
        unlinkAllTeams?: string;
        deleteItem?: string;
    };
    renderContextMenu?: (item: T) => ReactNode;
}

export function TreeView<T extends TreeItem = TreeItem>({
    items,
    onAction,
    level = 0,
    teams = [],
    onAssignTeam,
    renderNodeIcon,
    emptyMessage = "No items found.",
    labels = {
        createSub: "Add Sub-item",
        editItem: "Edit Item",
        assignTeams: "Assign to Teams",
        unlinkAllTeams: "Unlink All Teams",
        deleteItem: "Delete Item",
    },
    renderContextMenu,
}: TreeViewProps<T>) {
    if (!items || items.length === 0) {
        if (level === 0) {
            return (
                <div className="p-6 text-sm text-center text-dashboard-muted-foreground">
                    {emptyMessage}
                </div>
            );
        }
        return null;
    }

    const resolvedLabels = {
        createSub: labels?.createSub ?? "Add Sub-item",
        editItem: labels?.editItem ?? "Edit Item",
        assignTeams: labels?.assignTeams ?? "Assign to Teams",
        unlinkAllTeams: labels?.unlinkAllTeams ?? "Unlink All Teams",
        deleteItem: labels?.deleteItem ?? "Delete Item",
    };

    return (
        <div className="flex flex-col w-full animate-in fade-in duration-300">
            {items.map((item) => (
                <TreeNodeComponent
                    key={item.id}
                    item={item}
                    level={level}
                    onAction={onAction}
                    teams={teams}
                    onAssignTeam={onAssignTeam}
                    renderNodeIcon={renderNodeIcon}
                    labels={resolvedLabels}
                    renderContextMenu={renderContextMenu}
                />
            ))}
        </div>
    );
}

function TreeNodeComponent<T extends TreeItem>({
    item,
    level,
    onAction,
    teams,
    onAssignTeam,
    renderNodeIcon,
    labels,
    renderContextMenu,
}: {
    item: T;
    level: number;
    onAction: TreeViewProps<T>["onAction"];
    teams: TreeTeam[];
    onAssignTeam?: TreeViewProps<T>["onAssignTeam"];
    renderNodeIcon?: TreeViewProps<T>["renderNodeIcon"];
    labels: Required<NonNullable<TreeViewProps<T>["labels"]>>;
    renderContextMenu?: TreeViewProps<T>["renderContextMenu"];
}) {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = !!(item.children && item.children.length > 0);

    const assignedIds = item.teams ? item.teams.map((t) => t.id) : [];
    const isTeamAssigned = (teamId: string | number) =>
        assignedIds.some((id: any) => String(id) === String(teamId));

    const toggleTeamAssignment = (teamId: string | number) => {
        if (!onAssignTeam) return;
        const isAssigned = isTeamAssigned(teamId);
        let newTeamIds: (string | number)[] = [];
        if (isAssigned) {
            newTeamIds = assignedIds.filter(
                (id: any) => String(id) !== String(teamId),
            );
        } else {
            newTeamIds = [...assignedIds, teamId];
        }
        onAssignTeam(item, newTeamIds[0] || null, newTeamIds);
    };

    const contextMenuContent = (
        <>
            <ContextMenuAdvancedItem
                icon={Plus}
                onClick={() => onAction("create", item)}
            >
                {labels.createSub}
            </ContextMenuAdvancedItem>
            <ContextMenuAdvancedItem
                icon={Edit2}
                onClick={() => onAction("edit", item)}
            >
                {labels.editItem}
            </ContextMenuAdvancedItem>

            {teams.length > 0 && onAssignTeam && (
                <ContextMenuAdvancedSub icon={Users} label={labels.assignTeams}>
                    {teams.map((t) => {
                        const assigned = isTeamAssigned(t.id);
                        return (
                            <ContextMenuAdvancedItem
                                key={t.id}
                                onClick={() => toggleTeamAssignment(t.id)}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="w-3 text-xs font-bold text-dashboard-primary">
                                        {assigned ? "✓" : ""}
                                    </span>
                                    <span>{t.name}</span>
                                </span>
                            </ContextMenuAdvancedItem>
                        );
                    })}
                </ContextMenuAdvancedSub>
            )}
            {assignedIds.length > 0 && onAssignTeam && (
                <ContextMenuAdvancedItem
                    onClick={() => onAssignTeam(item, null, [])}
                >
                    {labels.unlinkAllTeams}
                </ContextMenuAdvancedItem>
            )}

            <ContextMenuAdvancedSeparator />
            <ContextMenuAdvancedItem
                icon={Trash2}
                variant="destructive"
                onClick={() => onAction("delete", item)}
            >
                {labels.deleteItem}
            </ContextMenuAdvancedItem>
        </>
    );

    return (
        <div className="flex flex-col w-full border-b border-dashboard-border">
            <ContextMenuAdvanced
                menuContent={
                    renderContextMenu
                        ? renderContextMenu(item)
                        : contextMenuContent
                }
                className="w-48"
            >
                <div
                    className="flex items-center justify-between py-2.5 hover:bg-dashboard-secondary/50 transition-colors cursor-pointer group px-4 border-b border-dashboard-border/30 last:border-0"
                    style={{ paddingLeft: `calc(1rem + ${level * 1.5}rem)` }}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 flex items-center justify-center shrink-0">
                            {renderNodeIcon ? (
                                renderNodeIcon(item, hasChildren, isExpanded)
                            ) : hasChildren ? (
                                isExpanded ? (
                                    <ChevronDown className="w-3.5 h-3.5 text-dashboard-muted-foreground" />
                                ) : (
                                    <ChevronRight className="w-3.5 h-3.5 text-dashboard-muted-foreground rtl:rotate-180" />
                                )
                            ) : (
                                <span className="w-3.5 h-3.5" />
                            )}
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-dashboard-foreground text-sm group-hover:text-dashboard-primary transition-colors">
                                    {item.name}
                                </h3>
                                {item.code && (
                                    <span className="px-1.5 py-0.5 rounded-dashboard-radius bg-dashboard-background border border-dashboard-border/50 text-[9px] font-bold text-dashboard-muted-foreground  tracking-wider font-mono">
                                        {item.code}
                                    </span>
                                )}
                                {item.teams &&
                                    item.teams.length > 0 &&
                                    item.teams.map((t, idx) => (
                                        <span
                                            key={idx}
                                            className="px-1.5 py-0.5 rounded-dashboard-radius bg-dashboard-primary/10 border border-dashboard-primary/20 text-[9px] font-bold text-dashboard-primary  tracking-wider"
                                        >
                                            {t.name}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </ContextMenuAdvanced>

            {isExpanded && hasChildren && (
                <TreeView
                    items={item.children as T[]}
                    level={level + 1}
                    onAction={onAction}
                    teams={teams}
                    onAssignTeam={onAssignTeam}
                    renderNodeIcon={renderNodeIcon}
                    labels={labels}
                    renderContextMenu={renderContextMenu}
                />
            )}
        </div>
    );
}
