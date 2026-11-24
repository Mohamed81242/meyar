import { DataCard, DataTable, type ColumnDef } from "@/design-system";
import {
    RowActionsDropdown,
    renderContextMenuItems,
    type TableActionItem,
} from "@/design-system/components/TableActions";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getMemberProfile } from "./TeamWorkspaceClone";

interface TeamTimesheetTabCloneProps {
    members: string[];
    teamName: string;
    onToggleMember?: (member: string) => void;
}

interface TimeEntry {
    taskTitle: string;
    project: string;
    hours: Record<string, number>;
}

export function TeamTimesheetTabClone({
    members,
    teamName,
    onToggleMember,
}: TeamTimesheetTabCloneProps) {
    const [selectedMember, setSelectedMember] = useState<string | null>(null);
    const [memberEntries, setMemberEntries] = useState<
        Record<string, TimeEntry[]>
    >({
        "Belal Esam Yosry": [
            {
                taskTitle: "VPN gateway investigation",
                project: "Incident Command / INC-842",
                hours: { "2026-07-06": 4, "2026-07-08": 2 },
            },
        ],
        "Sarah Connor": [
            {
                taskTitle: "LDAP connection fixes",
                project: "Incident Command / INC-502",
                hours: { "2026-07-07": 6, "2026-07-09": 2 },
            },
        ],
    });

    const [showAddTask, setShowAddTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    const startDate = new Date(2026, 6, 5); // July 5th, 2026
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const nextDate = new Date(startDate);
        nextDate.setDate(startDate.getDate() + i);
        dates.push(nextDate);
    }

    const formatDateStr = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getDayName = (d: Date) =>
        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
    const getMonthShortName = (d: Date) =>
        [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ][d.getMonth()];

    const getMemberTotalHours = (member: string) => {
        const entries = memberEntries[member] || [];
        let total = 0;
        entries.forEach((e) => {
            Object.values(e.hours).forEach((h) => {
                total += h;
            });
        });
        return total;
    };

    const getMemberDayHours = (member: string, dateStr: string) => {
        const entries = memberEntries[member] || [];
        let total = 0;
        entries.forEach((e) => {
            total += e.hours[dateStr] || 0;
        });
        return total;
    };

    const handleCellChange = (
        member: string,
        taskTitle: string,
        dateStr: string,
        value: string,
    ) => {
        const hoursNum = parseFloat(value) || 0;
        const current = memberEntries[member] || [];
        const updated = current.map((e) => {
            if (e.taskTitle === taskTitle) {
                return {
                    ...e,
                    hours: {
                        ...e.hours,
                        [dateStr]: hoursNum,
                    },
                };
            }
            return e;
        });
        setMemberEntries({
            ...memberEntries,
            [member]: updated,
        });
    };

    const handleAddTask = (member: string) => {
        if (!newTaskTitle.trim()) return;
        const current = memberEntries[member] || [];
        const updated = [
            ...current,
            {
                taskTitle: newTaskTitle.trim(),
                project: "Incident Command / General Tasks",
                hours: {},
            },
        ];
        setMemberEntries({
            ...memberEntries,
            [member]: updated,
        });
        setNewTaskTitle("");
        setShowAddTask(false);
        toast.success("Task added to timesheet!");
    };

    const summaryActions = (member: string): TableActionItem<string>[] => [
        {
            id: "open",
            label: "Open Timesheet",
            onClick: (m) => setSelectedMember(m),
        },
    ];

    const summaryColumns: ColumnDef<string>[] = [
        {
            id: "people",
            header: `People (${members.length})`,
            cell: (member) => {
                const profile = getMemberProfile(member);
                const initials = member
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                const totalHours = getMemberTotalHours(member);
                return (
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-extrabold  shrink-0 border ${profile.avatarColor}`}
                        >
                            {initials}
                        </div>
                        <div className="flex flex-col min-w-0 text-left">
                            <span className="font-bold text-dashboard-foreground truncate">
                                {member}
                            </span>
                            <span className="text-[10px] text-dashboard-muted-foreground">
                                {totalHours}h
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            id: "open",
            header: "Open",
            cell: (member) => (
                <div className="text-center">
                    <button
                        onClick={() => setSelectedMember(member)}
                        className="px-2.5 py-1 rounded bg-dashboard-secondary/40 hover:bg-dashboard-secondary text-dashboard-foreground text-[10px] font-bold transition-colors cursor-pointer border border-dashboard-border/60"
                    >
                        Open →
                    </button>
                </div>
            ),
        },
        ...dates.map((date) => {
            const dateStr = formatDateStr(date);
            return {
                id: dateStr,
                header: `${getDayName(date)}, ${getMonthShortName(date)} ${date.getDate()}`,
                cell: (member: string) => {
                    const hours = getMemberDayHours(member, dateStr);
                    return (
                        <div className="text-center text-dashboard-muted-foreground font-semibold">
                            {hours > 0 ? `${hours}h` : "0h"}
                        </div>
                    );
                },
            };
        }),
        {
            id: "total",
            header: "Total",
            cell: (member) => (
                <div className="text-center font-bold text-dashboard-foreground">
                    {getMemberTotalHours(member)}h
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            variant: "actions",
            cell: (member) => (
                <RowActionsDropdown
                    item={member}
                    actions={summaryActions(member)}
                />
            ),
        },
    ];

    const detailColumns: ColumnDef<TimeEntry>[] = [
        {
            id: "task",
            header: "Task / Location",
            cell: (entry) => (
                <div className="flex flex-col justify-center text-left">
                    <span className="font-bold text-dashboard-foreground truncate">
                        {entry.taskTitle}
                    </span>
                    <span className="text-[10px] text-dashboard-muted-foreground truncate">
                        {entry.project}
                    </span>
                </div>
            ),
        },
        ...dates.map((date) => {
            const dateStr = formatDateStr(date);
            return {
                id: dateStr,
                header: `${getDayName(date)}, ${getMonthShortName(date)} ${date.getDate()}`,
                cell: (entry: TimeEntry) => {
                    const hours = entry.hours[dateStr] || 0;
                    return (
                        <div className="text-center">
                            <input
                                type="text"
                                value={hours > 0 ? String(hours) : ""}
                                onChange={(e) =>
                                    handleCellChange(
                                        selectedMember!,
                                        entry.taskTitle,
                                        dateStr,
                                        e.target.value,
                                    )
                                }
                                placeholder="-"
                                className="w-12 h-7 bg-dashboard-secondary/25 border border-dashboard-border/60 focus:border-purple-500 rounded text-center text-xs text-dashboard-foreground outline-none transition-all"
                            />
                        </div>
                    );
                },
            };
        }),
        {
            id: "total",
            header: "Total",
            cell: (entry) => {
                let rowTotal = 0;
                dates.forEach((d) => {
                    rowTotal += entry.hours[formatDateStr(d)] || 0;
                });
                return (
                    <div className="text-center font-bold text-dashboard-foreground">
                        {rowTotal > 0 ? `${rowTotal}h` : "0h"}
                    </div>
                );
            },
        },
    ];

    return (
        <div className="h-full flex flex-col select-none text-xs bg-dashboard-background text-dashboard-foreground animate-in fade-in duration-300 text-left">
            {selectedMember && (
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-dashboard-border/60 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSelectedMember(null)}
                            className="h-7 w-7 rounded-lg border border-dashboard-border bg-dashboard-card hover:bg-dashboard-secondary text-dashboard-muted-foreground hover:text-dashboard-foreground transition-colors flex items-center justify-center cursor-pointer bg-transparent"
                        >
                            <ChevronLeft size={14} className="rtl:rotate-180"/>
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-dashboard-foreground">
                                {selectedMember}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Date Switcher & Filtering bar */}
            <div className="flex items-center justify-between p-2.5 bg-dashboard-card/25 border border-dashboard-border/40 rounded-xl mb-4 shrink-0 gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-dashboard-secondary rounded text-dashboard-muted-foreground hover:text-dashboard-foreground cursor-pointer bg-transparent border-none">
                            <ChevronLeft size={14} className="rtl:rotate-180"/>
                        </button>
                        <button className="p-1 hover:bg-dashboard-secondary rounded text-dashboard-muted-foreground hover:text-dashboard-foreground cursor-pointer bg-transparent border-none">
                            <ChevronRight size={14} className="rtl:rotate-180" />
                        </button>
                        <span className="font-bold text-dashboard-foreground ml-1.5">
                            Jul 5 - Jul 11
                        </span>
                    </div>
                </div>
            </div>

            {/* Grid Container */}
            <div className="flex-grow overflow-auto custom-scrollbar border border-dashboard-border rounded-2xl bg-dashboard-card/5 min-h-[260px]">
                {!selectedMember ? (
                    <DataTable
                        data={members}
                        columns={summaryColumns}
                        showSearch={false}
                        onRowClick={(m) => setSelectedMember(m)}
                        renderContextMenu={(m) =>
                            renderContextMenuItems(m, summaryActions(m))
                        }
                        renderGridItem={(m) => (
                            <DataCard
                                key={m}
                                item={m}
                                actions={summaryActions(m)}
                                title={m}
                                subtitle={`${getMemberTotalHours(m)}h Total`}
                                onClick={() => setSelectedMember(m)}
                            />
                        )}
                    />
                ) : (
                    <div className="flex flex-col h-full text-left">
                        <DataTable
                            data={memberEntries[selectedMember] || []}
                            columns={detailColumns}
                            showSearch={false}
                        />

                        <div className="p-3.5 border-t border-dashboard-border bg-dashboard-card/5 mt-auto flex relative items-center gap-2">
                            {showAddTask ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add task title..."
                                        value={newTaskTitle}
                                        onChange={(e) =>
                                            setNewTaskTitle(e.target.value)
                                        }
                                        className="bg-dashboard-background border border-dashboard-border rounded px-2.5 py-1 text-xs text-dashboard-foreground outline-none"
                                    />
                                    <button
                                        onClick={() =>
                                            handleAddTask(selectedMember)
                                        }
                                        className="bg-dashboard-primary hover:bg-dashboard-primary/90 text-dashboard-primary-foreground rounded text-xs font-bold px-3 py-1 cursor-pointer border-none"
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowAddTask(true)}
                                    className="bg-dashboard-primary hover:bg-dashboard-primary/90 text-dashboard-primary-foreground rounded-lg text-xs font-bold px-3.5 py-1.5 border-transparent cursor-pointer flex items-center gap-1 transition-all"
                                >
                                    <Plus size={13} />
                                    <span>Add task</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
