import type {
    Connection,
    Edge,
    Node,
    NodeTypes,
    OnEdgesChange,
    OnNodesChange,
} from "@xyflow/react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

export interface FlowGraphUIConfig {
    showBackground?: boolean;
    showControls?: boolean;
    showMiniMap?: boolean;
    fitView?: boolean;
    background?: {
        color?: string;
        gap?: number;
        size?: number;
    };
    controlsClassName?: string;
    miniMapClassName?: string;
    nodeColor?: string;
    maskColor?: string;
}

export interface FlowGraphHeaderAction {
    id: string;
    label: ReactNode;
    icon?: ReactNode;
    onClick: () => void;
    className?: string;
}

export interface FlowGraphHeaderConfig {
    show?: boolean;
    backButton?: {
        show?: boolean;
        onClick: () => void;
    };
    title?: ReactNode;
    badge?: ReactNode;
    actions?: FlowGraphHeaderAction[];
    children?: ReactNode;
    className?: string;
}

export interface RelationshipFlowProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect?: (connection: Connection) => void;
    nodeTypes: NodeTypes;
    ui?: FlowGraphUIConfig;
    header?: FlowGraphHeaderConfig;
    className?: string;
    canvasClassName?: string;
    children?: ReactNode;
    renderNodes?: (nodes: Node[]) => Node[];
    orientation?: "horizontal" | "vertical";
}

export interface FlowGraphState {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    setNodes: Dispatch<SetStateAction<Node[]>>;
    setEdges: Dispatch<SetStateAction<Edge[]>>;
    resetLayout: (nodes: Node[], edges?: Edge[]) => void;
}

export interface FlowGraphLayoutConfig {
    anchorX: number;
    centerY: number;
    spacing: number;
}

export interface BuildFlowGraphResult {
    nodes: Node[];
    edges: Edge[];
}

export interface UseFlowGraphSyncOptions<TData> {
    data: TData | null | undefined;
    isReady: boolean;
    syncKey?: string | number;
    buildGraph: (data: TData) => BuildFlowGraphResult;
    syncNodes: (currentNodes: Node[], data: TData) => Node[];
    syncEdges: (currentEdges: Edge[], data: TData) => Edge[];
    setNodes: Dispatch<SetStateAction<Node[]>>;
    setEdges: Dispatch<SetStateAction<Edge[]>>;
    resetKey?: string | number;
}

import { createContext, useContext } from "react";

export const FlowOrientationContext = createContext<"horizontal" | "vertical">("horizontal");

export function useFlowOrientation() {
    return useContext(FlowOrientationContext);
}
