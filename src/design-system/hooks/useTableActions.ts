import { useCallback, useState } from "react";
import * as React from "react";
import { toast } from "sonner";
import type { ConfirmDialogProps } from "../components/ConfirmDialog";
import {
    useContextMenuActions,
    type ActionListInput,
} from "./useContextMenuActions";

export interface UseTableActionsOptions<T> {
    /** Declarative table actions array or callback */
    actions?: ActionListInput<T>;
    /** Callback when delete confirmation is confirmed */
    onDelete?: (item: T) => void | Promise<void>;
    /** Property name to use as entity label in delete dialog title/description, e.g. "name", "title" */
    labelKey?: keyof T;
    /** Custom entity name for dialog title, e.g. "Member", "User", "Incident" */
    entityName?: string;
    /** Is delete operation pending */
    isDeleting?: boolean;
}

export interface UseTableActionsReturn<T> {
    /** Currently selected item for detail view / drawer */
    selectedItem: T | null;
    /** Is detail view / drawer open */
    isDetailsOpen: boolean;
    /** Open detail view for item */
    openDetails: (item: T) => void;
    /** Close detail view */
    closeDetails: () => void;
    /** Set selected item directly */
    setSelectedItem: (item: T | null) => void;

    /** Currently targeted item for deletion */
    itemToDelete: T | null;
    /** Is delete confirm dialog open */
    isDeleteOpen: boolean;
    /** Open delete confirmation for item */
    openDelete: (item: T) => void;
    /** Close delete confirmation */
    closeDelete: () => void;
    /** Confirm delete action handler */
    confirmDelete: () => void;

    /** Helper to copy text to clipboard with toast notification */
    copyToClipboard: (text: string, label?: string) => void;

    /** Pre-configured props for ConfirmDialog component */
    deleteDialogProps: ConfirmDialogProps;

    /** Render context menu for an item (for DataTable or ContextMenuAdvanced) */
    renderContextMenu: (item: T) => React.ReactNode;
    /** Render row action dropdown for an item (for table action column) */
    renderRowActions: (item: T) => React.ReactNode;
}

export function useTableActions<T>({
    actions,
    onDelete,
    labelKey,
    entityName = "Item",
    isDeleting = false,
}: UseTableActionsOptions<T> = {}): UseTableActionsReturn<T> {
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const [itemToDelete, setItemToDelete] = useState<T | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { renderContextMenu, renderRowActions } = useContextMenuActions<T>(actions);

    const openDetails = useCallback((item: T) => {
        setSelectedItem(item);
        setIsDetailsOpen(true);
    }, []);

    const closeDetails = useCallback(() => {
        setIsDetailsOpen(false);
        setSelectedItem(null);
    }, []);

    const openDelete = useCallback((item: T) => {
        setItemToDelete(item);
        setIsDeleteOpen(true);
    }, []);

    const closeDelete = useCallback(() => {
        setIsDeleteOpen(false);
        setItemToDelete(null);
    }, []);

    const confirmDelete = useCallback(() => {
        if (itemToDelete && onDelete) {
            onDelete(itemToDelete);
        }
        closeDelete();
    }, [itemToDelete, onDelete, closeDelete]);

    const copyToClipboard = useCallback((text: string, label?: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success(
            label ? `${label} copied to clipboard!` : "Copied to clipboard!",
        );
    }, []);

    const itemLabel =
        itemToDelete && labelKey ? String(itemToDelete[labelKey] ?? "") : "";

    const deleteDialogProps: ConfirmDialogProps = {
        open: isDeleteOpen,
        onOpenChange: (open) => {
            if (!open) closeDelete();
        },
        variant: "danger",
        title: `Remove ${entityName}`,
        description: itemLabel
            ? `Are you sure you want to remove "${itemLabel}"? This action cannot be undone and will revoke all access privileges.`
            : `Are you sure you want to remove this ${entityName.toLowerCase()}? This action cannot be undone and will revoke all access privileges.`,
        confirmText: `Remove ${entityName}`,
        isLoading: isDeleting,
        onConfirm: confirmDelete,
    };

    return {
        selectedItem,
        isDetailsOpen,
        openDetails,
        closeDetails,
        setSelectedItem,

        itemToDelete,
        isDeleteOpen,
        openDelete,
        closeDelete,
        confirmDelete,

        copyToClipboard,

        deleteDialogProps,

        renderContextMenu,
        renderRowActions,
    };
}
