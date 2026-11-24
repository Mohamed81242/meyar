import React, { useState, useContext } from "react";
import {
    EdgeLabelRenderer,
    getBezierPath,
    useReactFlow,
    type EdgeProps,
} from "@xyflow/react";
import { Unlink, X } from "lucide-react";
import { FlowEventsContext } from "./ReactFlowCanvas";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    Button,
} from "@/design-system";
import { useLanguage } from "@/shared/hooks";

export function GlowEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
}: EdgeProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [buttonPos, setButtonPos] = useState<{ x: number; y: number } | null>(null);
    
    const { screenToFlowPosition } = useReactFlow();
    const events = useContext(FlowEventsContext);
    const edgeData = data as any;

    const { t } = useLanguage("shared");

    const defaultTooltip = edgeData?.isClassificationLink
        ? t("deleteClassification", "Delete Classification")
        : edgeData?.isTeamLink
          ? t("unlinkTeam", "Unlink Team")
          : t("unlinkConnection", "Unlink Connection");
    const tooltipText = edgeData?.tooltip || defaultTooltip;

    const defaultConfirmTitle = edgeData?.isClassificationLink
        ? t("deleteClassification", "Delete Classification")
        : t("unlinkTeamAssignment", "Unlink Team Assignment");
    const confirmTitle = edgeData?.confirmTitle || defaultConfirmTitle;

    const defaultConfirmDescription = edgeData?.isClassificationLink
        ? t("deleteClassificationConfirm", "Are you sure you want to delete this classification? This will permanently delete the classification and all its children. This action cannot be undone.")
        : t("unlinkTeamConfirm", "Are you sure you want to remove this team assignment?");
    const confirmDescription = edgeData?.confirmDescription || defaultConfirmDescription;

    const defaultConfirmText = edgeData?.isClassificationLink
        ? t("delete", "Delete")
        : t("unlink", "Unlink");
    const confirmText = edgeData?.confirmText || defaultConfirmText;

    const defaultCancelText = t("cancel", "Cancel");
    const cancelText = edgeData?.cancelText || defaultCancelText;

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const handleMouseEnter = (event: React.MouseEvent) => {
        if (isConfirmOpen) return;
        const flowPos = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });
        setButtonPos(flowPos);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        if (isConfirmOpen) return;
        setIsHovered(false);
    };

    const onUnlink = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (edgeData?.isTeamLink || edgeData?.isClassificationLink) {
            setIsConfirmOpen(true);
        } else {
            if (events?.onEdgesChange) {
                events.onEdgesChange([{ id, type: "remove" }]);
            }
        }
    };

    const posX = buttonPos?.x ?? labelX;
    const posY = buttonPos?.y ?? labelY;

    return (
        <>
            {/* Glowing trace background under the main path on hover */}
            {isHovered && (
                <path
                    d={edgePath}
                    fill="none"
                    stroke={style.stroke || "var(--color-dashboard-primary)"}
                    strokeWidth={(Number(style.strokeWidth) || 2) + 6}
                    className="transition-opacity duration-300 opacity-40 animate-pulse"
                    style={{
                        filter: `drop-shadow(0 0 6px ${style.stroke || "var(--color-dashboard-primary)"})`,
                    }}
                />
            )}
            
            {/* Main visible path */}
            <path
                id={id}
                d={edgePath}
                fill="none"
                stroke={style.stroke || "var(--color-dashboard-primary)"}
                strokeWidth={isHovered ? (Number(style.strokeWidth) || 2) + 1 : style.strokeWidth || 2}
                className="transition-opacity duration-300"
                style={{
                    ...style,
                    opacity: isHovered ? 1 : 0.7,
                    strokeDasharray: isHovered ? "5" : "none",
                    animation: isHovered ? "react-flow__dashdelay 0.6s linear infinite" : "none",
                }}
                markerEnd={markerEnd}
            />

            {/* Invisible thick path to capture hover/mouse events easily */}
            <path
                d={edgePath}
                fill="none"
                stroke="transparent"
                strokeWidth={16}
                className="cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />

            {/* Hover-spawned Unlink Button positioned at entry point */}
            {isHovered && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: "absolute",
                            transform: `translate(-50%, -50%) translate(${posX}px, ${posY}px)`,
                            pointerEvents: "all",
                        }}
                        className="nodrag nopan"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Button
                            onClick={onUnlink}
                            className="w-4 h-4 p-0 rounded-full bg-dashboard-destructive hover:bg-dashboard-destructive/90 text-white flex items-center justify-center shadow-lg border border-white/10 transition-all duration-200 hover:scale-110 active:scale-95"
                            title={tooltipText}
                            aria-label={tooltipText}
                            tooltip={tooltipText}
                        >
                            <Unlink className="size-2.5 stroke-[2.5]" />
                        </Button>
                    </div>
                </EdgeLabelRenderer>
            )}

            {/* Confirmation Dialog */}
            {(edgeData?.isTeamLink || edgeData?.isClassificationLink) && (
                <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                    <DialogContent className="sm:max-w-md bg-dashboard-background border-dashboard-border text-dashboard-foreground">
                        <DialogHeader className="pb-4 border-b border-dashboard-border/50">
                            <DialogTitle className="text-dashboard-foreground">
                                {confirmTitle}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="py-4 text-sm text-dashboard-muted-foreground">
                            {confirmDescription}
                        </div>
                        <DialogFooter className="pt-4 border-t border-dashboard-border/50 gap-2">
                            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>{cancelText}</Button>
                            <Button
                                onClick={() => {
                                    setIsConfirmOpen(false);
                                    setIsHovered(false); // Reset hover state
                                    if (edgeData.isTeamLink && edgeData.onUnlink) {
                                        edgeData.onUnlink();
                                    } else if (edgeData.isClassificationLink && edgeData.onDelete) {
                                        edgeData.onDelete();
                                    }
                                }}
                                className="bg-dashboard-destructive hover:bg-dashboard-destructive/90 text-white border-0"
                            >
                                {confirmText}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
