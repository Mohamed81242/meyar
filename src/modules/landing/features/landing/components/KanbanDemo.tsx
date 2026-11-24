import { useLanguage } from "@/shared/hooks";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Ticket {
    id: string;
    number: string;
    titleKey: string;
    priority: "low" | "medium" | "high" | "critical";
    category: string;
}

export function KanbanDemo() {
    const { t, currentLanguage } = useLanguage("landing");
    const lang = currentLanguage as "en" | "ar";

    const [tickets, setTickets] = useState<Ticket[]>([
        {
            id: "t1",
            number: "INC-842",
            titleKey: "hero.alertDetails", // "VPN Gateway Loops..."
            priority: "critical",
            category: "Network",
        },
        {
            id: "t2",
            number: "INC-910",
            titleKey: "whatsapp.user2", // "Request New Laptop" / replacement info
            priority: "medium",
            category: "Hardware",
        },
        {
            id: "t3",
            number: "INC-502",
            titleKey: "whatsapp.user1", // "Report VPN Outage"
            priority: "high",
            category: "Access Management",
        },
    ]);

    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [columns, setColumns] = useState<Record<string, string[]>>({
        todo: ["t1", "t2"],
        inProgress: ["t3"],
        done: [],
    });

    const [activeDropCol, setActiveDropCol] = useState<string | null>(null);

    const handleDragStart = (id: string) => {
        setDraggedId(id);
    };

    const handleDragOver = (e: React.DragEvent, colId: string) => {
        e.preventDefault();
        if (activeDropCol !== colId) {
            setActiveDropCol(colId);
        }
    };

    const handleDragLeave = () => {
        setActiveDropCol(null);
    };

    const handleDrop = (colId: string) => {
        setActiveDropCol(null);
        if (!draggedId) return;

        // Find current column of the dragged card
        let sourceCol = "";
        Object.entries(columns).forEach(([key, list]) => {
            if (list.includes(draggedId)) {
                sourceCol = key;
            }
        });

        if (sourceCol === colId) return;

        setColumns((prev) => {
            const newSrc = prev[sourceCol].filter((id) => id !== draggedId);
            const newDst = [...prev[colId], draggedId];
            return {
                ...prev,
                [sourceCol]: newSrc,
                [colId]: newDst,
            };
        });

        // Trigger interactive toast notifications
        if (colId === "inProgress") {
            toast.info(
                t("kanban.investigatingToast") ||
                    "Incident linked to Problem Investigation #5842.",
            );
        } else if (colId === "done") {
            toast.success(
                t("kanban.resolvedToast") ||
                    "Hotfix deployed! Ticket resolved and archived.",
            );
        }

        setDraggedId(null);
    };

    const priorityColors = {
        low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        medium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        high: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        critical: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    };

    return (
        <div className="w-full bg-dashboard-card border border-dashboard-border rounded-3xl p-6 md:p-8 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-dashboard-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-dashboard-primary/15 transition-all duration-700" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <span className="text-xs font-bold text-dashboard-primary  tracking-widest block mb-2 px-1">
                        {t("kanban.title") || "Streamlined ITIL Workflows"}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-display font-extrabold text-dashboard-foreground tracking-tight">
                        {t("kanban.title") || "Streamlined ITIL Workflows"}
                    </h2>
                    <p className="text-sm text-dashboard-muted-foreground mt-2 max-w-xl">
                        {t("kanban.subtitle") ||
                            "Drag and drop incidents into Problem Analysis or the AI Resolver to investigate root causes and implement changes instantly."}
                    </p>
                </div>
            </div>

            {/* Kanban columns grid */}
            <div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
                dir={lang === "ar" ? "rtl" : "ltr"}
            >
                {(["todo", "inProgress", "done"] as const).map((colId) => {
                    const colTickets = columns[colId].map(
                        (tid) => tickets.find((t) => t.id === tid)!,
                    );
                    const isOver = activeDropCol === colId;

                    return (
                        <div
                            key={colId}
                            onDragOver={(e) => handleDragOver(e, colId)}
                            onDragLeave={handleDragLeave}
                            onDrop={() => handleDrop(colId)}
                            className={`flex flex-col bg-dashboard-background border rounded-2xl p-4 min-h-[300px] transition-all duration-300 ${
                                isOver
                                    ? "border-dashboard-primary/40 bg-dashboard-primary/5 shadow-[0_0_20px_rgba(105,117,226,0.05)]"
                                    : "border-dashboard-border"
                            }`}
                        >
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-4 border-b border-dashboard-border pb-3">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${
                                            colId === "todo"
                                                ? "bg-rose-500"
                                                : colId === "inProgress"
                                                  ? "bg-amber-500"
                                                  : "bg-emerald-500"
                                        }`}
                                    />
                                    <h3 className="text-xs font-bold text-dashboard-foreground  tracking-wider">
                                        {t(`kanban.${colId}`)}
                                    </h3>
                                </div>
                                <span className="bg-dashboard-secondary text-[10px] text-dashboard-muted-foreground font-semibold px-2 py-0.5 rounded-full">
                                    {colTickets.length}
                                </span>
                            </div>

                            {/* Drop Helper Outline when dragging */}
                            {colTickets.length === 0 && (
                                <div className="flex-1 border border-dashed border-dashboard-border rounded-xl flex items-center justify-center p-6 text-center text-xs text-dashboard-muted-foreground transition-all">
                                    {t("kanban.dropHere") ||
                                        "Drop ticket here to trigger auto-resolution"}
                                </div>
                            )}

                            {/* Column Cards */}
                            <div className="flex flex-col gap-3">
                                {colTickets.map((ticket) => {
                                    if (!ticket) return null;
                                    const isCardDragged =
                                        draggedId === ticket.id;

                                    return (
                                        <div
                                            key={ticket.id}
                                            draggable
                                            onDragStart={() =>
                                                handleDragStart(ticket.id)
                                            }
                                            className={`bg-dashboard-card border border-dashboard-border rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-dashboard-primary/30 transition-all select-none duration-300 relative overflow-hidden group/card ${
                                                isCardDragged
                                                    ? "opacity-35 scale-95 border-dashed"
                                                    : ""
                                            }`}
                                        >
                                            {/* Glow overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-dashboard-primary/0 via-dashboard-primary/5 to-dashboard-primary/0 translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none" />

                                            <div className="flex justify-between items-start gap-3 mb-2">
                                                <span className="text-[10px] font-mono font-bold text-dashboard-primary">
                                                    {ticket.number}
                                                </span>
                                                <span
                                                    className={`text-[9px]  tracking-wider font-bold border px-1.5 py-0.5 rounded-full ${
                                                        priorityColors[
                                                            ticket.priority
                                                        ]
                                                    }`}
                                                >
                                                    {ticket.priority}
                                                </span>
                                            </div>

                                            <p className="text-xs font-semibold text-dashboard-foreground leading-relaxed line-clamp-2">
                                                {t(ticket.titleKey) ||
                                                    ticket.titleKey}
                                            </p>

                                            <div className="flex justify-between items-center border-t border-dashboard-border mt-3 pt-2.5">
                                                <div className="flex items-center gap-1.5 text-[10px] text-dashboard-muted-foreground font-medium">
                                                    <AlertCircle
                                                        size={10}
                                                        className="text-dashboard-primary"
                                                    />
                                                    <span>
                                                        {ticket.category}
                                                    </span>
                                                </div>
                                                <span className="text-[9px] text-dashboard-muted-foreground italic group-hover/card:text-dashboard-foreground transition-colors">
                                                    {t("kanban.dragHint") ||
                                                        "Drag me"}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
