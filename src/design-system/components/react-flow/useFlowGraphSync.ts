import { useEffect, useRef, type MutableRefObject } from "react";
import type { UseFlowGraphSyncOptions } from "./types";

export function useFlowGraphSync<TData>({
    data,
    isReady,
    syncKey,
    buildGraph,
    syncNodes,
    syncEdges,
    setNodes,
    setEdges,
    resetKey,
}: UseFlowGraphSyncOptions<TData>) {
    const initialized = useRef(false);
    const buildGraphRef = useRef(buildGraph);
    const syncNodesRef = useRef(syncNodes);
    const syncEdgesRef = useRef(syncEdges);
    const dataRef = useRef(data);
    const lastResetKeyRef = useRef(resetKey);

    useEffect(() => {
        buildGraphRef.current = buildGraph;
        syncNodesRef.current = syncNodes;
        syncEdgesRef.current = syncEdges;
        dataRef.current = data;
    });

    useEffect(() => {
        if (resetKey !== undefined && resetKey !== lastResetKeyRef.current) {
            initialized.current = false;
            lastResetKeyRef.current = resetKey;
        }
    }, [resetKey]);

    useEffect(() => {
        const currentData = dataRef.current;
        if (!isReady || !currentData) return;

        if (!initialized.current) {
            const { nodes, edges } = buildGraphRef.current(currentData);
            setNodes(nodes);
            setEdges(edges);
            initialized.current = true;
            return;
        }

        setNodes((currentNodes) =>
            syncNodesRef.current(currentNodes, currentData),
        );
        setEdges((currentEdges) =>
            syncEdgesRef.current(currentEdges, currentData),
        );
    }, [syncKey, isReady, setNodes, setEdges]);
}

export function useStableCallbacks<T extends object>(
    callbacks: T,
): MutableRefObject<T> {
    const callbacksRef = useRef(callbacks);

    useEffect(() => {
        callbacksRef.current = callbacks;
    }, [callbacks]);

    return callbacksRef;
}
