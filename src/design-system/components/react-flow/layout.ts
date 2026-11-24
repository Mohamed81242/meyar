import type { FlowGraphLayoutConfig } from "./types";

export function computeVerticalPositions(
    count: number,
    { anchorX, centerY, spacing }: FlowGraphLayoutConfig,
): { x: number; y: number }[] {
    if (count <= 0) return [];

    const totalHeight = (count - 1) * spacing;
    const startY = centerY - totalHeight / 2;

    return Array.from({ length: count }, (_, index) => ({
        x: anchorX,
        y: startY + index * spacing,
    }));
}
