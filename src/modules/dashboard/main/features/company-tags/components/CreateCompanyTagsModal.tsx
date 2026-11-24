import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/design-system/components/dialog";
import { useCreateCompanyTags } from "../api";
import { toast } from "sonner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateCompanyTagsModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("أدمن");

    const createMutation = useCreateCompanyTags();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Name is required");
            return;
        }

        createMutation.mutate(
            { name, email: email || undefined, role },
            {
                onSuccess: () => {
                    toast.success("Company Tags created successfully");
                    setName("");
                    setEmail("");
                    onClose();
                },
                onError: () => {
                    toast.error("Failed to create Company Tags");
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white dark:bg-dashboard-card p-6 rounded-2xl border border-dashboard-border shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-dashboard-foreground">
                        Add New Company Tags
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter name"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-dashboard-border bg-gray-50/50 dark:bg-dashboard-background outline-none text-dashboard-foreground"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-dashboard-border bg-gray-50/50 dark:bg-dashboard-background outline-none text-dashboard-foreground"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                            Role
                        </label>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-dashboard-border bg-gray-50/50 dark:bg-dashboard-background outline-none text-dashboard-foreground"
                        />
                    </div>

                    <DialogFooter className="gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-dashboard-border text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="px-4 py-2 text-xs font-semibold rounded-xl bg-dashboard-primary hover:opacity-90 text-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {createMutation.isPending ? "Creating..." : "Save"}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
