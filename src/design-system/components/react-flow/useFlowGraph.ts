import {
    useEdgesState,
    useNodesState,
    type Edge,
    type Node,
} from "@xyflow/react";
import { useCallback } from "react";
import type { FlowGraphState } from "./types";

export function useFlowGraph(
    initialNodes: Node[] = [],
    initialEdges: Edge[] = [],
): FlowGraphState {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

    const resetLayout = useCallback(
        (nextNodes: Node[], nextEdges?: Edge[]) => {
            setNodes(nextNodes);
            if (nextEdges) {
                setEdges(nextEdges);
            }
        },
        [setNodes, setEdges],
    );

    return {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        setNodes,
        setEdges,
        resetLayout,
    };
}
