import { useCallback } from "react";
import * as React from "react";
import {
    RowActionsDropdown,
    renderContextMenuItems,
    type TableActionItem,
} from "../components/TableActions";

export type ActionListInput<T> =
    | TableActionItem<T>[]
    | ((item: T) => TableActionItem<T>[]);

export interface UseContextMenuActionsReturn<T> {
    /** Get list of actions for a given item */
    getActions: (item: T) => TableActionItem<T>[];
    /** Render context menu items for a given item (usable in DataTable or ContextMenuAdvanced) */
    renderContextMenu: (item: T) => React.ReactNode;
    /** Render row actions dropdown for a given item (usable in table action column) */
    renderRowActions: (item: T) => React.ReactNode;
}

/**
 * Custom hook to manage context menu & table row actions in one place,
 * preventing duplication between DataTable and standalone context menus.
 */
export function useContextMenuActions<T>(
    actionsInput?: ActionListInput<T>,
): UseContextMenuActionsReturn<T> {
    const getActions = useCallback(
        (item: T): TableActionItem<T>[] => {
            if (!actionsInput) return [];
            if (typeof actionsInput === "function") {
                return actionsInput(item);
            }
            return actionsInput;
        },
        [actionsInput],
    );

    const renderContextMenu = useCallback(
        (item: T) => {
            const actions = getActions(item);
            if (actions.length === 0) return null;
            return renderContextMenuItems(item, actions);
        },
        [getActions],
    );

    const renderRowActions = useCallback(
        (item: T) => {
            const actions = getActions(item);
            if (actions.length === 0) return null;
            return React.createElement(
                RowActionsDropdown as React.ComponentType<{
                    item: T;
                    actions: TableActionItem<T>[];
                }>,
                { item, actions },
            );
        },
        [getActions],
    );

    return {
        getActions,
        renderContextMenu,
        renderRowActions,
    };
}
