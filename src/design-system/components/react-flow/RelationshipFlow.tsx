import { cn } from "@/utils";
import { FlowGraphHeader } from "./FlowGraphHeader";
import { ReactFlowCanvas } from "./ReactFlowCanvas";
import { FlowOrientationContext } from "./types";
import type { RelationshipFlowProps } from "./types";

export function RelationshipFlow({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    nodeTypes,
    ui,
    header,
    className,
    canvasClassName,
    children,
    renderNodes,
    orientation = "horizontal",
}: RelationshipFlowProps) {
    return (
        <FlowOrientationContext.Provider value={orientation}>
            <div
                className={cn(
                    "h-full flex flex-col bg-dashboard-background relative overflow-hidden",
                    className,
                )}
            >
                {header && <FlowGraphHeader {...header} />}

                <div className="flex-1 w-full h-full">
                    <ReactFlowCanvas
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        ui={ui}
                        canvasClassName={canvasClassName}
                        renderNodes={renderNodes}
                    >
                        {children}
                    </ReactFlowCanvas>
                </div>
            </div>
        </FlowOrientationContext.Provider>
    );
}
