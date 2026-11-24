interface TeamWorkloadTabCloneProps {
    members: string[];
    teamName: string;
}

export function TeamWorkloadTabClone({
    members,
    teamName,
}: TeamWorkloadTabCloneProps) {
    const mockWorkloads = [
        { name: "Belal Esam Yosry", points: 8, max: 10, status: "Optimal" },
        { name: "Sarah Connor", points: 12, max: 10, status: "Overloaded" },
        { name: "John Doe", points: 4, max: 10, status: "Under-utilized" },
        { name: "Ahmad Ali", points: 2, max: 10, status: "Under-utilized" },
    ];

    return (
        <div className="space-y-4 animate-in fade-in duration-300 text-left">
            <div className="border-b border-dashboard-border pb-2 mb-2">
                <h4 className="text-xs font-bold text-dashboard-foreground  tracking-wider">
                    Member Workload & Resource Capacities
                </h4>
            </div>

            <div className="space-y-4">
                {members.map((member) => {
                    const workload = mockWorkloads.find(
                        (w) => w.name === member,
                    ) || { points: 5, max: 10, status: "Optimal" };
                    const pct = Math.min(
                        (workload.points / workload.max) * 100,
                        100,
                    );

                    return (
                        <div
                            key={member}
                            className="bg-dashboard-card/40 border border-dashboard-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-dashboard-secondary flex items-center justify-center text-dashboard-primary border border-dashboard-border shrink-0 font-bold ">
                                    {member.charAt(0)}
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-xs font-bold text-dashboard-foreground">
                                        {member}
                                    </span>
                                    <span className="text-[10px] text-dashboard-muted-foreground mt-0.5">
                                        Capacity Status:{" "}
                                        <strong
                                            className={
                                                workload.status === "Overloaded"
                                                    ? "text-rose-400"
                                                    : workload.status ===
                                                        "Optimal"
                                                      ? "text-emerald-400"
                                                      : "text-amber-400"
                                            }
                                        >
                                            {workload.status}
                                        </strong>
                                    </span>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="flex items-center gap-4 min-w-[200px]">
                                <div className="flex-1 bg-dashboard-background/40 rounded-full h-2 overflow-hidden border border-dashboard-border">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            workload.status === "Overloaded"
                                                ? "bg-rose-500"
                                                : workload.status === "Optimal"
                                                  ? "bg-emerald-500"
                                                  : "bg-amber-500"
                                        }`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-mono font-bold text-dashboard-foreground shrink-0">
                                    {workload.points} / {workload.max} pts
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
