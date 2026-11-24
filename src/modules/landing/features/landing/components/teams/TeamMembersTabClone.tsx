import { DataCard } from "@/design-system";
import {
    DataTable,
    type ColumnDef,
} from "@/design-system/components/DataTable";
import {
    RowActionsDropdown,
    renderContextMenuItems,
    type TableActionItem,
} from "@/design-system/components/TableActions";
import { Copy, LayoutGrid, List, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getMemberProfile } from "./TeamWorkspaceClone";

interface TeamMembersTabCloneProps {
    members: string[];
    teamName: string;
    allMembers: string[];
    onToggleMember: (member: string) => void;
}

export function TeamMembersTabClone({
    members,
    teamName,
    allMembers,
    onToggleMember,
}: TeamMembersTabCloneProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [showAddInline, setShowAddInline] = useState(false);

    const filteredMembers = members.filter((m) =>
        m.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleAddMemberClick = (member: string) => {
        onToggleMember(member);
        setShowAddInline(false);
        toast.success(`Added ${member} to the team!`);
    };

    const memberActions = (member: string): TableActionItem<string>[] => [
        {
            id: "copy-email",
            label: "Copy Email Address",
            icon: Copy,
            onClick: (m) => {
                const profile = getMemberProfile(m);
                navigator.clipboard.writeText(profile.email);
                toast.success("Email address copied!");
            },
        },
        {
            id: "remove",
            label: "Remove from Team",
            icon: Trash2,
            variant: "destructive",
            onClick: (m) => {
                onToggleMember(m);
                toast.success(`Removed ${m} from the team.`);
            },
        },
    ];

    const columns: ColumnDef<string>[] = [
        {
            id: "name",
            header: "Name",
            cell: (member) => {
                const profile = getMemberProfile(member);
                const initials = member
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                return (
                    <div className="flex items-center gap-2.5 min-w-0 font-medium text-dashboard-foreground">
                        <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold  shrink-0 border ${profile.avatarColor}`}
                        >
                            {initials}
                        </div>
                        <span className="truncate">{member}</span>
                    </div>
                );
            },
        },
        {
            id: "manager",
            header: "Manager",
            cell: () => (
                <span className="text-dashboard-muted-foreground">-</span>
            ),
        },
        {
            id: "teams",
            header: "Teams",
            cell: () => (
                <span className="w-5 h-5 rounded bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-[9px] ">
                    {teamName.charAt(0).toUpperCase()}
                </span>
            ),
        },
        {
            id: "email",
            header: "Email",
            cell: (member) => {
                const profile = getMemberProfile(member);
                return (
                    <span className="text-dashboard-muted-foreground select-all">
                        {profile.email}
                    </span>
                );
            },
        },
        {
            id: "role",
            header: "Role",
            cell: (member) => {
                const profile = getMemberProfile(member);
                return (
                    <span className="text-dashboard-foreground font-semibold">
                        {profile.role}
                    </span>
                );
            },
        },
        {
            id: "userStatus",
            header: "User Status",
            cell: (member) => {
                const profile = getMemberProfile(member);
                return (
                    <span className="text-dashboard-muted-foreground">
                        {profile.userStatus}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            variant: "actions",
            cell: (member) => (
                <RowActionsDropdown
                    item={member}
                    actions={memberActions(member)}
                />
            ),
        },
    ];

    const renderGridItem = (member: string) => {
        const profile = getMemberProfile(member);
        return (
            <DataCard
                key={member}
                item={member}
                actions={memberActions(member)}
                title={member}
                subtitle={profile.role}
                properties={[
                    { label: "Email", value: profile.email },
                    { label: "Status", value: profile.userStatus },
                ]}
            />
        );
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-dashboard-card/40 p-2 rounded-xl border border-dashboard-border">
                {/* Left: Filters & Add Inline Button */}
                <div className="flex items-center gap-2 relative">
                    <button
                        onClick={() => setShowAddInline(!showAddInline)}
                        className="bg-dashboard-primary hover:bg-dashboard-primary/90 text-dashboard-primary-foreground text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow border-none cursor-pointer"
                    >
                        <Plus size={12} />
                        <span>Add Member</span>
                    </button>

                    {showAddInline && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowAddInline(false)}
                            />
                            <div className="absolute top-full left-0 mt-1.5 w-52 bg-dashboard-popover border border-dashboard-border rounded-lg shadow-xl py-1 z-50 max-h-36 overflow-y-auto custom-scrollbar">
                                {allMembers
                                    .filter((m) => !members.includes(m))
                                    .map((m) => (
                                        <button
                                            key={m}
                                            onClick={() =>
                                                handleAddMemberClick(m)
                                            }
                                            className="w-full text-left px-3 py-1.5 text-[11px] text-dashboard-foreground hover:bg-dashboard-secondary transition-colors cursor-pointer bg-transparent border-none"
                                        >
                                            {m}
                                        </button>
                                    ))}
                                {allMembers.filter((m) => !members.includes(m))
                                    .length === 0 && (
                                    <span className="block px-3 py-1.5 text-[10px] text-dashboard-muted-foreground">
                                        All members already added
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Right: Search and view options */}
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center">
                        <Search
                            size={13}
                            className="text-dashboard-muted-foreground absolute left-2.5 pointer-events-none"
                        />
                        <input
                            type="text"
                            placeholder="Search People"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-8 bg-dashboard-card border border-dashboard-border focus:border-dashboard-primary rounded-lg pl-8 pr-3 text-xs text-dashboard-foreground placeholder:text-dashboard-muted-foreground/60 transition-all outline-none w-44 focus:w-52"
                        />
                    </div>

                    <div className="flex items-center border border-dashboard-border rounded-lg p-0.5 bg-dashboard-background">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-1 rounded shrink-0 cursor-pointer border-none bg-transparent transition-colors ${
                                viewMode === "list"
                                    ? "text-dashboard-foreground bg-dashboard-secondary"
                                    : "text-dashboard-muted-foreground hover:text-dashboard-foreground"
                            }`}
                        >
                            <List size={14} />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-1 rounded shrink-0 cursor-pointer border-none bg-transparent transition-colors ${
                                viewMode === "grid"
                                    ? "text-dashboard-foreground bg-dashboard-secondary"
                                    : "text-dashboard-muted-foreground hover:text-dashboard-foreground"
                            }`}
                        >
                            <LayoutGrid size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* List / Grid Content */}
            <DataTable
                view={viewMode}
                hideViewToggle={true}
                defaultView={viewMode}
                showSearch={false}
                data={filteredMembers}
                columns={columns}
                renderContextMenu={(m) =>
                    renderContextMenuItems(m, memberActions(m))
                }
                renderGridItem={renderGridItem}
            />
        </div>
    );
}
