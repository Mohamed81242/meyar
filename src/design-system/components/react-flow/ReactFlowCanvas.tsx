import {
    Background,
    Controls,
    MiniMap,
    ReactFlow,
    ReactFlowProvider,
    useReactFlow,
    type OnEdgesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/utils";
import type { RelationshipFlowProps } from "./types";
import { useEffect, createContext } from "react";
import { GlowEdge } from "./GlowEdge";

export const FlowEventsContext = createContext<{
    onEdgesChange?: OnEdgesChange;
} | null>(null);

const edgeTypes = {
    glow: GlowEdge,
};

const DEFAULT_UI = {
    showBackground: true,
    showControls: true,
    showMiniMap: true,
    fitView: true,
    background: {
        color: "var(--color-dashboard-border)",
        gap: 24,
        size: 2,
    },
    controlsClassName:
        "bg-dashboard-card border border-dashboard-border rounded-lg overflow-hidden",
    miniMapClassName:
        "bg-dashboard-card border border-dashboard-border rounded-lg overflow-hidden",
    nodeColor: "var(--color-dashboard-primary)",
    maskColor: "var(--color-dashboard-background)",
} as const;

function ReactFlowCanvasInner({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    nodeTypes,
    ui,
    canvasClassName,
    children,
    renderNodes,
}: Omit<
    RelationshipFlowProps,
    "header" | "className"
>) {
    const config = { ...DEFAULT_UI, ...ui };
    const renderedNodes = renderNodes ? renderNodes(nodes) : nodes;
    const { fitView } = useReactFlow();

    useEffect(() => {
        const handleFit = () => {
            setTimeout(() => {
                fitView({ duration: 400, padding: 0.2 });
            }, 100);
        };
        window.addEventListener("reactflow-fitview", handleFit);
        return () => window.removeEventListener("reactflow-fitview", handleFit);
    }, [fitView]);

    return (
        <FlowEventsContext.Provider value={{ onEdgesChange }}>
            <ReactFlow
                nodes={renderedNodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView={config.fitView}
                className={cn("bg-dashboard-background", canvasClassName)}
            >
                {config.showBackground && (
                    <Background
                        color={config.background?.color}
                        gap={config.background?.gap}
                        size={config.background?.size}
                    />
                )}
                {config.showControls && (
                    <Controls className={config.controlsClassName} />
                )}
                {config.showMiniMap && (
                    <MiniMap
                        nodeColor={config.nodeColor}
                        maskColor={config.maskColor}
                        className={config.miniMapClassName}
                    />
                )}
                {children}
            </ReactFlow>
        </FlowEventsContext.Provider>
    );
}

export function ReactFlowCanvas(props: Omit<RelationshipFlowProps, "header" | "className">) {
    return (
        <ReactFlowProvider>
            <ReactFlowCanvasInner {...props} />
        </ReactFlowProvider>
    );
}
