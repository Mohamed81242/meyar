import { ChevronDown, ChevronUp, Focus, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { getMemberProfile } from "./TeamWorkspaceClone";

interface TeamChartTabCloneProps {
    members: string[];
    teamName: string;
    managers: Record<string, string>;
    onUpdateManager: (
        memberName: string,
        managerName: string | undefined,
    ) => void;
    allMembers: string[];
    onToggleMember: (member: string) => void;
}

export function TeamChartTabClone({
    members,
    teamName,
    managers,
    onUpdateManager,
    allMembers,
    onToggleMember,
}: TeamChartTabCloneProps) {
    const [zoom, setZoom] = useState(100);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeSelectDropdown, setActiveSelectDropdown] = useState<
        string | null
    >(null);

    const roots: string[] = [];
    const childrenMap: Record<string, string[]> = {};

    members.forEach((member) => {
        const parent = managers[member];
        if (!parent || !members.includes(parent)) {
            roots.push(member);
        } else {
            if (!childrenMap[parent]) {
                childrenMap[parent] = [];
            }
            childrenMap[parent].push(member);
        }
    });

    const handleZoomIn = () => setZoom((z) => Math.min(z + 10, 160));
    const handleZoomOut = () => setZoom((z) => Math.max(z - 10, 40));
    const handleCenterView = () => {
        setPanOffset({ x: 0, y: 0 });
        setZoom(100);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
            target.closest("button") ||
            target.closest("select") ||
            target.closest(".z-50")
        )
            return;
        setIsDragging(true);
        setDragStart({
            x: e.clientX - panOffset.x,
            y: e.clientY - panOffset.y,
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setPanOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleManagerSelect = (
        member: string,
        manager: string | undefined,
    ) => {
        onUpdateManager(member, manager);
        setActiveSelectDropdown(null);
    };

    const renderNode = (member: string) => {
        const profile = getMemberProfile(member);
        const initials = member
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
        const children = childrenMap[member] || [];
        const isDropdownOpen = activeSelectDropdown === member;
        const potentialManagers = members.filter((m) => m !== member);

        return (
            <div
                key={member}
                className="flex flex-col items-center relative text-left"
            >
                <div className="w-56 bg-dashboard-popover border border-dashboard-border p-1.5 rounded-xl shadow-2xl z-20">
                    <div className="bg-dashboard-card border border-dashboard-border rounded-xl p-3 shadow-md w-52 text-left relative z-10 hover:border-dashboard-primary/30 transition-all">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative">
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold  shrink-0 border ${profile.avatarColor}`}
                                >
                                    {initials}
                                </div>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-dashboard-foreground truncate">
                                    {member}
                                </span>
                                <div className="relative mt-1">
                                    <button
                                        onClick={() =>
                                            setActiveSelectDropdown(
                                                isDropdownOpen ? null : member,
                                            )
                                        }
                                        className="flex items-center gap-1 text-[10px] text-dashboard-muted-foreground hover:text-dashboard-foreground font-semibold bg-transparent border-none p-0 cursor-pointer"
                                    >
                                        <span>
                                            {managers[member]
                                                ? `Manager: ${managers[member]}`
                                                : "Select manager"}
                                        </span>
                                        <ChevronDown size={10} />
                                    </button>

                                    {isDropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() =>
                                                    setActiveSelectDropdown(
                                                        null,
                                                    )
                                                }
                                            />
                                            <div className="absolute top-full left-0 mt-1.5 w-44 bg-dashboard-popover border border-dashboard-border rounded-lg shadow-xl py-1 z-50 max-h-36 overflow-y-auto custom-scrollbar">
                                                {managers[member] && (
                                                    <button
                                                        onClick={() =>
                                                            handleManagerSelect(
                                                                member,
                                                                undefined,
                                                            )
                                                        }
                                                        className="w-full text-left px-3 py-1.5 text-[11px] text-red-400 hover:bg-dashboard-secondary transition-colors cursor-pointer bg-transparent border-none"
                                                    >
                                                        Clear Manager
                                                    </button>
                                                )}
                                                {potentialManagers.map((m) => (
                                                    <button
                                                        key={m}
                                                        onClick={() =>
                                                            handleManagerSelect(
                                                                member,
                                                                m,
                                                            )
                                                        }
                                                        className="w-full text-left px-3 py-1.5 text-[11px] text-dashboard-foreground hover:bg-dashboard-secondary transition-colors cursor-pointer bg-transparent border-none"
                                                    >
                                                        {m}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {children.length > 0 && !isCollapsed && (
                    <div className="flex flex-col items-center mt-6 w-full relative">
                        <div className="w-px h-6 bg-dashboard-border absolute -top-6 left-1/2 -translate-x-1/2" />
                        {children.length > 1 && (
                            <div className="h-px bg-dashboard-border absolute top-0 w-[calc(100%-13rem)]" />
                        )}
                        <div className="flex gap-12 pt-6 relative">
                            {children.map((child) => (
                                <div key={child} className="relative">
                                    <div className="w-px h-6 bg-dashboard-border absolute -top-6 left-1/2 -translate-x-1/2" />
                                    {renderNode(child)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col select-none relative animate-in fade-in duration-300">
            {/* Top Toolbar */}
            <div className="flex justify-between items-center mb-3 bg-dashboard-card/60 p-2 rounded-xl border border-dashboard-border">
                <div className="flex items-center gap-1.5 bg-dashboard-background border border-dashboard-border rounded-lg p-1">
                    <button
                        onClick={handleZoomOut}
                        className="p-1.5 rounded hover:bg-dashboard-secondary text-dashboard-muted-foreground hover:text-dashboard-foreground bg-transparent border-none cursor-pointer"
                        title="Zoom Out"
                    >
                        <ZoomOut size={12} />
                    </button>
                    <span className="text-[10px] font-mono font-bold text-dashboard-muted-foreground min-w-[28px] text-center">
                        {zoom}%
                    </span>
                    <button
                        onClick={handleZoomIn}
                        className="p-1.5 rounded hover:bg-dashboard-secondary text-dashboard-muted-foreground hover:text-white bg-transparent border-none cursor-pointer"
                        title="Zoom In"
                    >
                        <ZoomIn size={12} />
                    </button>
                    <div className="h-3 w-px bg-dashboard-border mx-1" />
                    <button
                        onClick={handleCenterView}
                        className="p-1.5 rounded hover:bg-dashboard-secondary text-dashboard-muted-foreground hover:text-white bg-transparent border-none cursor-pointer"
                        title="Center View"
                    >
                        <Focus size={12} />
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: isDragging ? "grabbing" : "grab" }}
                className="flex-grow min-h-[300px] bg-dashboard-background/40 border border-dashboard-border rounded-2xl flex items-center justify-center overflow-hidden relative select-none"
            >
                <div
                    style={{
                        transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100})`,
                        transformOrigin: "center center",
                    }}
                    className="transition-transform duration-75 flex flex-col items-center py-6"
                >
                    <div className="flex flex-col items-center relative mb-6">
                        <div className="bg-dashboard-card border border-dashboard-primary text-dashboard-primary rounded-lg px-4 py-2 font-bold text-xs select-none relative z-10 shadow">
                            No manager
                        </div>

                        {roots.length > 0 && (
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="w-5 h-5 rounded-full bg-dashboard-card border border-dashboard-border flex items-center justify-center hover:bg-dashboard-secondary text-dashboard-muted-foreground hover:text-dashboard-foreground absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20 cursor-pointer text-[10px] p-0"
                            >
                                {isCollapsed ? (
                                    <ChevronDown size={11} />
                                ) : (
                                    <ChevronUp size={11} />
                                )}
                            </button>
                        )}

                        {roots.length > 0 && !isCollapsed && (
                            <div className="flex flex-col items-center mt-6 w-full relative">
                                <div className="w-px h-6 bg-dashboard-border absolute -top-6 left-1/2 -translate-x-1/2" />
                                {roots.length > 1 && (
                                    <div className="h-px bg-dashboard-border absolute top-0 w-[calc(100%-13rem)]" />
                                )}
                                <div className="flex gap-12 pt-6 relative">
                                    {roots.map((root) => (
                                        <div key={root} className="relative">
                                            <div className="w-px h-6 bg-dashboard-border absolute -top-6 left-1/2 -translate-x-1/2" />
                                            {renderNode(root)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
