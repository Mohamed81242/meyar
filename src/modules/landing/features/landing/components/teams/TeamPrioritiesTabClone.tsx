import {
    ContextMenuAdvanced,
    ContextMenuAdvancedItem,
    ContextMenuAdvancedSeparator,
} from "@/design-system/components/context menu core/contextMenuAdvanced";
import { Check, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getMemberProfile } from "./TeamWorkspaceClone";

interface TeamPrioritiesTabCloneProps {
    members: string[];
    priorities: Record<string, string[]>;
    onUpdatePriorities: (newPriorities: Record<string, string[]>) => void;
    allMembers: string[];
    onToggleMember: (member: string) => void;
}

export function TeamPrioritiesTabClone({
    members,
    priorities,
    onUpdatePriorities,
    allMembers,
    onToggleMember,
}: TeamPrioritiesTabCloneProps) {
    const [activeAddingMember, setActiveAddingMember] = useState<string | null>(
        null,
    );
    const [inlineTaskInput, setInlineTaskInput] = useState("");

    const handleAddTask = (memberName: string, task: string) => {
        if (!task.trim()) return;
        const currentTasks = priorities[memberName] || [];
        const updated = {
            ...priorities,
            [memberName]: [...currentTasks, task.trim()],
        };
        onUpdatePriorities(updated);
        setInlineTaskInput("");
        setActiveAddingMember(null);
        toast.success("Task added to priorities!");
    };

    const handleDeleteTask = (memberName: string, idx: number) => {
        const currentTasks = priorities[memberName] || [];
        const updated = {
            ...priorities,
            [memberName]: currentTasks.filter((_, i) => i !== idx),
        };
        onUpdatePriorities(updated);
        toast.success("Priority task completed!");
    };

    return (
        <div className="space-y-5 animate-in fade-in duration-300">
            {/* Grid of member cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start text-left">
                {members.map((member) => {
                    const profile = getMemberProfile(member);
                    const initials = member
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();
                    const tasks = priorities[member] || [];
                    const isAdding = activeAddingMember === member;

                    const contextMenuContent = (
                        <>
                            <ContextMenuAdvancedItem
                                icon={Plus}
                                onClick={() => setActiveAddingMember(member)}
                            >
                                Add Priority Task
                            </ContextMenuAdvancedItem>
                            <ContextMenuAdvancedSeparator className="bg-dashboard-border" />
                            <ContextMenuAdvancedItem
                                variant="destructive"
                                icon={Trash2}
                                onClick={() => {
                                    onToggleMember(member);
                                    toast.success(
                                        `Removed ${member} from team.`,
                                    );
                                }}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                                Remove from Team
                            </ContextMenuAdvancedItem>
                        </>
                    );

                    return (
                        <ContextMenuAdvanced
                            key={member}
                            menuContent={contextMenuContent}
                            className="w-52 bg-dashboard-popover border border-dashboard-border p-1.5 rounded-xl shadow-2xl z-50 text-left"
                        >
                            <div className="bg-dashboard-card/40 border border-dashboard-border rounded-xl p-4 hover:border-dashboard-primary/20 transition-all flex flex-col min-h-[160px] cursor-context-menu">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-dashboard-border pb-3 mb-3">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold  shrink-0 border ${profile.avatarColor}`}
                                        >
                                            {initials}
                                        </div>
                                        <div className="flex flex-col min-w-0 text-left">
                                            <span className="text-xs font-bold text-dashboard-foreground truncate">
                                                {member}
                                            </span>
                                            <span className="text-[10px] text-dashboard-muted-foreground mt-0.5 capitalize">
                                                {profile.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tasks */}
                                <div className="flex-grow flex flex-col justify-between">
                                    <div className="space-y-2 mb-3">
                                        {tasks.map((task, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between p-2 rounded-lg bg-dashboard-secondary/15 border border-dashboard-border text-xs text-left"
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteTask(
                                                                member,
                                                                idx,
                                                            )
                                                        }
                                                        className="w-4 h-4 rounded border border-dashboard-border flex items-center justify-center hover:border-emerald-500 hover:bg-emerald-500/10 text-transparent hover:text-emerald-400 transition-colors cursor-pointer shrink-0 p-0 bg-transparent"
                                                    >
                                                        <Check size={10} />
                                                    </button>
                                                    <span className="text-dashboard-foreground font-medium truncate">
                                                        {task}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action row */}
                                    <div>
                                        {isAdding ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Task name..."
                                                    value={inlineTaskInput}
                                                    onChange={(e) =>
                                                        setInlineTaskInput(
                                                            e.target.value,
                                                        )
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            handleAddTask(
                                                                member,
                                                                inlineTaskInput,
                                                            );
                                                        }
                                                    }}
                                                    className="flex-grow bg-dashboard-background border border-dashboard-border rounded px-2 py-1 text-xs text-dashboard-foreground outline-none focus:border-dashboard-primary"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() =>
                                                        handleAddTask(
                                                            member,
                                                            inlineTaskInput,
                                                        )
                                                    }
                                                    className="px-2 py-1 bg-dashboard-primary hover:bg-dashboard-primary/90 text-dashboard-primary-foreground rounded text-[11px] font-bold cursor-pointer border-none"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    setActiveAddingMember(
                                                        member,
                                                    )
                                                }
                                                className="text-[11px] font-bold text-dashboard-muted-foreground hover:text-dashboard-foreground flex items-center gap-1 transition-colors cursor-pointer bg-transparent border-none py-1 px-0"
                                            >
                                                <Plus
                                                    size={12}
                                                    className="text-dashboard-primary"
                                                />
                                                <span>Add task</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ContextMenuAdvanced>
                    );
                })}
            </div>
        </div>
    );
}
