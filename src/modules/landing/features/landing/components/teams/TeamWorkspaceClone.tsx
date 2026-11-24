import { Button, Input } from "@/design-system";
import {
    ContextMenuAdvanced,
    ContextMenuAdvancedItem,
    ContextMenuAdvancedSeparator,
} from "@/design-system/components/context menu core/contextMenuAdvanced";
import {
    BarChart2,
    Bookmark,
    CheckSquare,
    Clock,
    Copy,
    ExternalLink,
    FileText,
    Plus,
    Settings,
    Target,
    Trash2,
    Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TeamChartTabClone } from "./TeamChartTabClone";
import { TeamMembersTabClone } from "./TeamMembersTabClone";
import { TeamPrioritiesTabClone } from "./TeamPrioritiesTabClone";
import { TeamTimesheetTabClone } from "./TeamTimesheetTabClone";
import { TeamWorkloadTabClone } from "./TeamWorkloadTabClone";

export interface TeamBookmark {
    id: string;
    title: string;
    url: string;
}

export interface TeamActivity {
    id: string;
    content: string;
    timestamp: string;
}

export interface Team {
    id: string | number;
    name: string;
    handle: string;
    description?: string;
    members: string[];
    memberCount: number;
    bookmarks?: TeamBookmark[];
    feed?: TeamActivity[];
    priorities?: Record<string, string[]>;
    managers?: Record<string, string>;
    createdAt: string;
    updatedAt: string;
}

export interface MemberProfile {
    name: string;
    email: string;
    role: string;
    manager?: string;
    userStatus?: string;
    directReports?: string[];
    localTime?: string;
    avatarColor?: string;
}

export const getMemberProfile = (name: string): MemberProfile => {
    const email = name.toLowerCase().replace(/\s+/g, "") + "@gmail.com";
    let role = "Member";
    let avatarColor =
        "bg-dashboard-primary/10 text-dashboard-primary border border-dashboard-primary/20";
    const directReports: string[] = [];

    if (name.includes("Belal")) {
        role = "Owner";
        avatarColor =
            "bg-dashboard-primary/15 text-dashboard-primary border border-dashboard-primary/30";
    } else if (name.includes("Sarah")) {
        role = "Admin";
        avatarColor =
            "bg-dashboard-destructive/10 text-dashboard-destructive border border-dashboard-destructive/20";
    } else {
        avatarColor =
            "bg-dashboard-primary/10 text-dashboard-primary border border-dashboard-primary/20";
    }

    return {
        name,
        email,
        role,
        userStatus: "Active",
        directReports,
        localTime: "4:54 pm local time",
        avatarColor,
    };
};

interface TeamWorkspaceCloneProps {
    team: Team;
    allMembers: string[];
    onUpdateTeam: (payload: any) => void;
}

export function TeamWorkspaceClone({
    team,
    allMembers,
    onUpdateTeam,
}: TeamWorkspaceCloneProps) {
    const [activeSubTab, setActiveSubTab] = useState<string>("overview");
    const [description, setDescription] = useState(team.description || "");
    const [showAddBookmark, setShowAddBookmark] = useState(false);
    const [bTitle, setBTitle] = useState("");
    const [bUrl, setBUrl] = useState("");

    const handleSaveDescription = () => {
        onUpdateTeam({ description });
    };

    const handleMemberToggle = (member: string) => {
        const updated = team.members.includes(member)
            ? team.members.filter((m) => m !== member)
            : [...team.members, member];
        onUpdateTeam({ members: updated });
    };

    const handleAddBookmark = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bTitle.trim() || !bUrl.trim()) return;
        const newBookmark: TeamBookmark = {
            id: `b-${Date.now()}`,
            title: bTitle.trim(),
            url: bUrl.trim().startsWith("http")
                ? bUrl.trim()
                : `https://${bUrl.trim()}`,
        };
        const updated = [...(team.bookmarks || []), newBookmark];
        const updatedFeed = [
            {
                id: `f-${Date.now()}`,
                content: `Added bookmark: "${bTitle}"`,
                timestamp: "Just now",
            },
            ...(team.feed || []),
        ];
        onUpdateTeam({ bookmarks: updated, feed: updatedFeed });
        setBTitle("");
        setBUrl("");
        setShowAddBookmark(false);
    };

    const handleRemoveBookmark = (bId: string) => {
        const bookmark = team.bookmarks?.find((b) => b.id === bId);
        const updated = team.bookmarks?.filter((b) => b.id !== bId) || [];
        const updatedFeed = [
            {
                id: `f-${Date.now()}`,
                content: `Removed bookmark: "${bookmark?.title || "Unknown"}"`,
                timestamp: "Just now",
            },
            ...(team.feed || []),
        ];
        onUpdateTeam({ bookmarks: updated, feed: updatedFeed });
    };

    const subTabs = [
        {
            id: "overview",
            label: "Overview",
            icon: FileText,
            color: "bg-dashboard-muted",
        },
        {
            id: "priorities",
            label: "Priorities",
            icon: Target,
            color: "bg-dashboard-destructive",
        },
        {
            id: "team",
            label: "Team",
            icon: Users,
            color: "bg-dashboard-primary",
        },
        {
            id: "chart",
            label: "Team Chart",
            icon: BarChart2,
            color: "bg-dashboard-primary",
        },
        {
            id: "workload",
            label: "Workload",
            icon: CheckSquare,
            color: "bg-dashboard-muted",
        },
        {
            id: "timesheet",
            label: "Timesheet",
            icon: Clock,
            color: "bg-dashboard-primary",
        },
    ];

    return (
        <div className="flex flex-col flex-1 h-full min-h-0 bg-dashboard-background overflow-hidden animate-in fade-in duration-300">
            {/* Top Workspace Header Bar */}
            <div className="px-6 py-4 bg-dashboard-card border-b border-dashboard-border flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-dashboard-primary/10 text-dashboard-primary flex items-center justify-center font-bold border border-dashboard-primary/20 text-sm">
                        {team.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col text-left">
                        <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-dashboard-foreground">
                                {team.name}
                            </span>
                            <Settings
                                size={14}
                                className="text-dashboard-muted-foreground hover:text-dashboard-foreground cursor-pointer transition-colors"
                            />
                        </div>
                        <span className="text-xs text-dashboard-muted-foreground mt-0.5">
                            @{team.handle}
                        </span>
                    </div>
                </div>
            </div>

            {/* Sub-navigation Tabs with Colored Indicators */}
            <div className="px-6 bg-dashboard-card border-b border-dashboard-border/85 flex items-center overflow-x-auto hide-scrollbar shrink-0">
                <div className="flex gap-6">
                    {subTabs.map((tab) => {
                        const isActive = activeSubTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSubTab(tab.id)}
                                className={`flex items-center gap-2 pb-3 pt-3 text-xs font-semibold border-b-2 transition-all cursor-pointer bg-transparent border-none ${
                                    isActive
                                        ? "border-dashboard-primary text-dashboard-foreground font-bold"
                                        : "border-transparent text-dashboard-muted-foreground hover:text-dashboard-foreground"
                                }`}
                            >
                                <div
                                    className={`w-2 h-2 rounded ${tab.color} shrink-0`}
                                />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex overflow-hidden min-h-0 relative text-left">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {activeSubTab === "overview" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mx-auto">
                            {/* Left Column */}
                            <div className="lg:col-span-8 space-y-6">
                                {/* Description */}
                                <div className="bg-dashboard-card border border-dashboard-border rounded-xl p-5 hover:border-dashboard-primary/30 transition-all">
                                    <textarea
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        onBlur={handleSaveDescription}
                                        placeholder='Add "Team description", information, and wiki'
                                        className="w-full min-h-[90px] bg-transparent border-none text-xs text-dashboard-foreground outline-none resize-none placeholder-dashboard-muted-foreground/60 leading-relaxed"
                                    />
                                </div>

                                {/* Bookmarks */}
                                <div className="bg-dashboard-card border border-dashboard-border rounded-xl p-5 space-y-4 hover:border-dashboard-primary/20 transition-all">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold  tracking-wider text-dashboard-muted-foreground">
                                            Bookmarks
                                        </h3>
                                        <button
                                            onClick={() =>
                                                setShowAddBookmark(
                                                    !showAddBookmark,
                                                )
                                            }
                                            className="p-1 rounded hover:bg-dashboard-secondary text-dashboard-muted-foreground hover:text-dashboard-foreground transition-colors cursor-pointer bg-transparent border-none"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    {showAddBookmark && (
                                        <form
                                            onSubmit={handleAddBookmark}
                                            className="bg-dashboard-background border border-dashboard-border rounded-lg p-3 space-y-3"
                                        >
                                            <Input
                                                placeholder="Bookmark Title"
                                                value={bTitle}
                                                onChange={(e) =>
                                                    setBTitle(e.target.value)
                                                }
                                                className="bg-dashboard-card border-dashboard-border text-xs h-8"
                                            />
                                            <Input
                                                placeholder="URL (e.g. google.com)"
                                                value={bUrl}
                                                onChange={(e) =>
                                                    setBUrl(e.target.value)
                                                }
                                                className="bg-dashboard-card border-dashboard-border text-xs h-8"
                                            />
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="h-7 text-[11px] rounded"
                                                    onClick={() =>
                                                        setShowAddBookmark(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    className="h-7 text-[11px] rounded bg-dashboard-primary text-dashboard-primary-foreground border-transparent"
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </form>
                                    )}

                                    {team.bookmarks &&
                                    team.bookmarks.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {team.bookmarks.map((b) => {
                                                const bookmarkMenuContent = (
                                                    <>
                                                        <ContextMenuAdvancedItem
                                                            icon={ExternalLink}
                                                            onClick={() =>
                                                                window.open(
                                                                    b.url,
                                                                    "_blank",
                                                                    "noopener,noreferrer",
                                                                )
                                                            }
                                                        >
                                                            Open Link
                                                        </ContextMenuAdvancedItem>
                                                        <ContextMenuAdvancedItem
                                                            icon={Copy}
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(
                                                                    b.url,
                                                                );
                                                                toast.success(
                                                                    "Link address copied!",
                                                                );
                                                            }}
                                                        >
                                                            Copy Link Address
                                                        </ContextMenuAdvancedItem>
                                                        <ContextMenuAdvancedSeparator className="bg-dashboard-border" />
                                                        <ContextMenuAdvancedItem
                                                            variant="destructive"
                                                            icon={Trash2}
                                                            onClick={() =>
                                                                handleRemoveBookmark(
                                                                    b.id,
                                                                )
                                                            }
                                                            className="text-dashboard-destructive hover:text-dashboard-destructive hover:bg-dashboard-destructive/10"
                                                        >
                                                            Delete Bookmark
                                                        </ContextMenuAdvancedItem>
                                                    </>
                                                );

                                                return (
                                                    <ContextMenuAdvanced
                                                        key={b.id}
                                                        menuContent={
                                                            bookmarkMenuContent
                                                        }
                                                        className="w-56 bg-dashboard-popover border border-dashboard-border p-1.5 rounded-xl shadow-2xl z-50"
                                                    >
                                                        <div className="flex items-center justify-between p-3 rounded-lg border border-dashboard-border bg-dashboard-background/40 hover:bg-dashboard-background/70 transition-colors group text-xs cursor-context-menu">
                                                            <a
                                                                href={b.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="font-medium text-dashboard-foreground hover:underline flex items-center gap-2 truncate flex-1"
                                                            >
                                                                <Bookmark
                                                                    size={12}
                                                                    className="text-dashboard-primary shrink-0"
                                                                />
                                                                <span>
                                                                    {b.title}
                                                                </span>
                                                            </a>
                                                            <button
                                                                onClick={() =>
                                                                    handleRemoveBookmark(
                                                                        b.id,
                                                                    )
                                                                }
                                                                className="text-dashboard-muted-foreground hover:text-dashboard-destructive opacity-0 group-hover:opacity-100 transition-opacity ml-2 cursor-pointer text-[10px] bg-transparent border-none"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </ContextMenuAdvanced>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="py-12 border border-dashed border-dashboard-border rounded-lg flex flex-col items-center justify-center text-center p-4">
                                            <div className="w-12 h-12 rounded-full border border-dashboard-border flex items-center justify-center text-dashboard-muted-foreground/30 mb-3 bg-dashboard-secondary/50">
                                                <Bookmark size={20} />
                                            </div>
                                            <p className="text-xs text-dashboard-muted-foreground max-w-sm">
                                                Bookmarks make it easy to save
                                                ClickUp items or any URL from
                                                around the web.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Feed / Activity Log */}
                                <div className="bg-dashboard-card border border-dashboard-border rounded-xl p-5 space-y-4 hover:border-dashboard-primary/20 transition-all">
                                    <div className="flex items-center justify-between border-b border-dashboard-border/50 pb-2">
                                        <h3 className="text-xs font-bold  tracking-wider text-dashboard-muted-foreground">
                                            Feed
                                        </h3>
                                    </div>
                                    {team.feed && team.feed.length > 0 ? (
                                        <div className="space-y-4 text-left">
                                            {team.feed.map((f) => (
                                                <div
                                                    key={f.id}
                                                    className="flex justify-between items-start gap-4 text-xs"
                                                >
                                                    <div className="flex gap-2.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-dashboard-primary mt-1.5 shrink-0" />
                                                        <span className="text-dashboard-muted-foreground">
                                                            {f.content}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] text-dashboard-muted-foreground/75 shrink-0">
                                                        {f.timestamp}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-16 text-center flex flex-col items-center justify-center">
                                            <span className="text-xs font-bold text-dashboard-foreground">
                                                No matching activity
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column (Sidebar widgets) */}
                            <div className="lg:col-span-4 space-y-6">
                                {/* Members sidebar */}
                                <div className="bg-dashboard-card border border-dashboard-border rounded-xl p-5 space-y-4 hover:border-dashboard-primary/20 transition-all">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold  tracking-wider text-dashboard-muted-foreground">
                                            Members
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {team.members.map((member) => (
                                            <div
                                                key={member}
                                                title={member}
                                                className="w-8 h-8 rounded-full bg-dashboard-primary/10 text-dashboard-primary border border-dashboard-primary/20 text-xs font-bold flex items-center justify-center  shrink-0 cursor-context-menu hover:border-dashboard-primary/50 transition-colors"
                                            >
                                                {member.charAt(0)}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Capacity Stats / Trial widget */}
                                <div className="bg-dashboard-card border border-dashboard-border rounded-xl p-5 space-y-3 hover:border-dashboard-primary/20 transition-all text-left">
                                    <h3 className="text-xs font-bold  tracking-wider text-dashboard-muted-foreground">
                                        Time off
                                    </h3>
                                    <div className="bg-dashboard-secondary/40 border border-dashboard-border rounded-lg p-4 flex flex-col gap-2 shadow-inner">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-dashboard-foreground">
                                                Business Plus
                                            </span>
                                            <span className="text-[10px] bg-dashboard-primary/10 text-dashboard-primary border border-dashboard-primary/20 font-bold px-1.5 py-0.5 rounded">
                                                TRIAL
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-dashboard-muted-foreground leading-normal">
                                            Try FREE for 14 days
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeSubTab === "priorities" ? (
                        <TeamPrioritiesTabClone
                            members={team.members}
                            priorities={team.priorities || {}}
                            onUpdatePriorities={(newPriorities) =>
                                onUpdateTeam({ priorities: newPriorities })
                            }
                            allMembers={allMembers}
                            onToggleMember={handleMemberToggle}
                        />
                    ) : activeSubTab === "team" ? (
                        <TeamMembersTabClone
                            members={team.members}
                            teamName={team.name}
                            allMembers={allMembers}
                            onToggleMember={handleMemberToggle}
                        />
                    ) : activeSubTab === "chart" ? (
                        <TeamChartTabClone
                            members={team.members}
                            teamName={team.name}
                            managers={team.managers || {}}
                            onUpdateManager={(memberName, managerName) => {
                                const current = team.managers || {};
                                const updated = { ...current };
                                if (managerName === undefined) {
                                    delete updated[memberName];
                                } else {
                                    updated[memberName] = managerName;
                                }
                                onUpdateTeam({ managers: updated });
                            }}
                            allMembers={allMembers}
                            onToggleMember={handleMemberToggle}
                        />
                    ) : activeSubTab === "workload" ? (
                        <TeamWorkloadTabClone
                            members={team.members}
                            teamName={team.name}
                        />
                    ) : (
                        <TeamTimesheetTabClone
                            members={team.members}
                            teamName={team.name}
                            onToggleMember={handleMemberToggle}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
