import { Edge, MarkerType } from "@xyflow/react";

export interface StyledEdgeOptions {
    animated?: boolean;
    strokeColor?: string;
    strokeWidth?: number;
    data?: any;
}

export function createStyledEdge(
    id: string,
    source: string,
    target: string,
    options: StyledEdgeOptions = {},
): Edge {
    const {
        animated = true,
        strokeColor = "var(--color-dashboard-primary)",
        strokeWidth = 2,
        data,
    } = options;

    return {
        id,
        source,
        target,
        type: "glow",
        animated,
        style: {
            stroke: strokeColor,
            strokeWidth,
        },
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: strokeColor,
        },
        data,
    };
}
