import {
    Button,
    ConfirmDialog,
    Dialog,
    DialogContent,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Textarea,
} from "@/design-system";
import { cn } from "@/utils";
import {
    Calendar,
    CheckSquare,
    ChevronDown,
    Clock,
    FileText,
    MessageSquare,
    Paperclip,
    Plus,
    Send,
    Smile,
    Sparkles,
    Tag,
    Trash2,
    UserPlus,
    Users,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";

export interface TaskNote {
    id: string;
    author: string;
    avatar?: string;
    text: string;
    createdAt: string;
}

export interface TaskSubtask {
    id: string;
    title: string;
    completed: boolean;
}

export interface ClickUpTaskData {
    id: string;
    title: string;
    description?: string;
    status: string;
    owner: string;
    assignees?: string[];
    dueDate?: string;
    startDate?: string;
    priority?: string;
    tags?: string[];
    subtasks?: TaskSubtask[];
    notes?: TaskNote[];
}

interface ClickUpTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: ClickUpTaskData | null;
    onSave?: (updatedTask: ClickUpTaskData) => void;
    onDelete?: (taskId: string) => void;
    onAddNote?: (content: string) => void;
}

export function ClickUpTaskModal({
    isOpen,
    onClose,
    task,
    onSave,
    onDelete,
    onAddNote,
}: ClickUpTaskModalProps) {
    if (!task) return null;

    // Form states synchronized with task prop
    const [title, setTitle] = useState(
        task.title || task.description || "New Task",
    );
    const [description, setDescription] = useState(task.description || "");
    const [status, setStatus] = useState(task.status || "Pending");
    const [priority, setPriority] = useState(task.priority || "Normal");
    const [owner, setOwner] = useState(task.owner || "Platform Owner");
    const [assignees, setAssignees] = useState<string[]>(
        task.assignees || [task.owner || "Platform Owner"],
    );
    const [startDate, setStartDate] = useState(task.startDate || "");
    const [dueDate, setDueDate] = useState(task.dueDate || "");
    const [tags, setTags] = useState<string[]>(task.tags || []);
    const [newTagInput, setNewTagInput] = useState("");
    const [showTagInput, setShowTagInput] = useState(false);

    // Subtasks
    const [subtasks, setSubtasks] = useState<TaskSubtask[]>(
        task.subtasks || [],
    );
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

    // Notes / Comments Activity Timeline
    const [notes, setNotes] = useState<TaskNote[]>(
        task.notes || [],
    );
    const [newNoteText, setNewNoteText] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Sync state only when the modal opens
    useEffect(() => {
        if (isOpen && task) {
            setTitle(task.title || task.description || "New Task");
            setDescription(task.description || "");
            setStatus(task.status || "Pending");
            setPriority(task.priority || "Normal");
            setOwner(task.owner || "Platform Owner");
            setAssignees(task.assignees || [task.owner || "Platform Owner"]);
            setStartDate(task.startDate || "");
            setDueDate(task.dueDate || "");
            setTags(task.tags || []);
            setSubtasks(task.subtasks || []);
            setNotes(task.notes || []);
        }
    }, [isOpen]);

    // Available user options
    const availableUsers = [
        "Platform Owner",
        "Admin User",
        "DevOps Engineer",
        "Database Administrator",
        "Security Lead",
    ];

    const handleAddAssignee = (user: string) => {
        if (!assignees.includes(user)) {
            setAssignees([...assignees, user]);
        }
    };

    const handleRemoveAssignee = (user: string) => {
        setAssignees(assignees.filter((u) => u !== user));
    };

    const handleToggleSubtask = (subtaskId: string) => {
        setSubtasks(
            subtasks.map((st) =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st,
            ),
        );
    };

    const handleAddSubtask = () => {
        if (!newSubtaskTitle.trim()) return;
        setSubtasks([
            ...subtasks,
            {
                id: Date.now().toString(),
                title: newSubtaskTitle,
                completed: false,
            },
        ]);
        setNewSubtaskTitle("");
    };

    const handleDeleteSubtask = (subtaskId: string) => {
        setSubtasks(subtasks.filter((st) => st.id !== subtaskId));
    };

    const handleAddTag = () => {
        if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
            setTags([...tags, newTagInput.trim()]);
            setNewTagInput("");
            setShowTagInput(false);
        }
    };

    const handleAddNote = () => {
        if (!newNoteText.trim()) return;
        const newNote: TaskNote = {
            id: Date.now().toString(),
            author: owner || "Platform Owner",
            avatar: (owner || "PO").substring(0, 2).toUpperCase(),
            text: newNoteText,
            createdAt: "Just now",
        };
        setNotes([...notes, newNote]);
        if (onAddNote) {
            onAddNote(newNoteText);
        }
        setNewNoteText("");
    };

    const handleSaveTask = () => {
        const updatedTask: ClickUpTaskData = {
            ...task,
            title,
            description,
            status,
            priority,
            owner,
            assignees,
            startDate,
            dueDate,
            tags,
            subtasks,
            notes,
        };
        if (onSave) {
            onSave(updatedTask);
        }
        onClose();
    };

    const statusColors: Record<string, string> = {
        Pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        "In Progress": "bg-blue-500/10 text-blue-400 border-blue-500/30",
        Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        Blocked: "bg-red-500/10 text-red-400 border-red-500/30",
    };

    const priorityColors: Record<string, string> = {
        Critical: "bg-red-500/20 text-red-400 border-red-500/30",
        High: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        Medium: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        Low: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-5xl max-w-5xl h-[85vh] max-h-[85vh] p-0! bg-dashboard-card border-dashboard-border text-dashboard-foreground overflow-hidden rounded-2xl shadow-2xl flex flex-col"
            >
                {/* Modal Top Header Bar */}
                <div className="px-6 py-3.5 border-b border-dashboard-border bg-dashboard-card flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 text-xs text-dashboard-muted-foreground">
                        <span className="font-semibold text-dashboard-foreground flex items-center gap-1.5">
                            <CheckSquare className="w-4 h-4 text-emerald-400" />
                            Task Workspace
                        </span>
                        <span>/</span>
                        <span className="truncate max-w-50 text-dashboard-muted-foreground">
                            Change Tasks
                        </span>
                        <span>/</span>
                        <span className="text-dashboard-foreground font-bold font-mono">
                            {String(task.id).length >= 10 &&
                            !isNaN(Number(task.id)) &&
                            Number(task.id) > 1000000000
                                ? "New Task"
                                : `#${task.id}`}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {onDelete && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="h-8 px-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg flex items-center gap-1"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                            </Button>
                        )}
                        <Button
                            type="button"
                            onClick={handleSaveTask}
                            className="h-8 px-4 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                        >
                            Save Changes
                        </Button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-dashboard-muted-foreground hover:text-dashboard-foreground p-1 rounded-lg hover:bg-dashboard-secondary transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* ClickUp Split Body: Left Main Content (2/3) + Right Activity Sidebar (1/3) */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row min-h-0 bg-dashboard-card">
                    {/* Left Main Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 border-r border-dashboard-border hide-scrollbar">
                        {/* Task Title input */}
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Task Title..."
                                className="w-full bg-transparent text-xl font-bold text-dashboard-foreground outline-none border-b border-transparent hover:border-dashboard-border focus:border-dashboard-primary pb-1 transition-colors"
                            />
                            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 text-xs text-emerald-400">
                                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                                <span>
                                    AI Assistant: Write description, checklist,
                                    or summarize notes
                                </span>
                            </div>
                        </div>

                        {/* Metadata Key-Value Property Block */}
                        <div className="grid grid-cols-2 gap-4 bg-dashboard-secondary/60 border border-dashboard-border rounded-xl p-4 text-xs">
                            {/* Status Selector */}
                            <div className="flex items-center gap-3">
                                <span className="w-20 text-dashboard-muted-foreground font-medium flex items-center gap-1.5 shrink-0">
                                    <Clock className="w-3.5 h-3.5" /> Status
                                </span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className={cn("px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1.5 cursor-pointer transition-all outline-none", statusColors[status] || "bg-dashboard-card text-dashboard-foreground border-dashboard-border")}>
                                        <span>{status}</span>
                                        <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-36 min-w-36 bg-dashboard-card border-dashboard-border text-dashboard-foreground">
                                        {["Pending", "In Progress", "Completed", "Blocked"].map((st) => (
                                            <DropdownMenuItem
                                                key={st}
                                                onClick={() => setStatus(st)}
                                                className="flex items-center gap-2 text-xs cursor-pointer"
                                            >
                                                <span className={cn("w-2 h-2 rounded-full", st === "Pending" ? "bg-amber-400" : st === "In Progress" ? "bg-blue-400" : st === "Completed" ? "bg-emerald-400" : "bg-red-400")} />
                                                <span>{st}</span>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Priority Selector */}
                            <div className="flex items-center gap-3">
                                <span className="w-20 text-dashboard-muted-foreground font-medium flex items-center gap-1.5 shrink-0">
                                    <Tag className="w-3.5 h-3.5" /> Priority
                                </span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className={cn("px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1.5 cursor-pointer transition-all outline-none", priorityColors[priority] || "bg-dashboard-card text-dashboard-foreground border-dashboard-border")}>
                                        <span>{priority}</span>
                                        <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-36 min-w-36 bg-dashboard-card border-dashboard-border text-dashboard-foreground">
                                        {["Low", "Medium", "High", "Critical"].map((pr) => (
                                            <DropdownMenuItem
                                                key={pr}
                                                onClick={() => setPriority(pr)}
                                                className="flex items-center gap-2 text-xs cursor-pointer"
                                            >
                                                <span className={cn("w-2 h-2 rounded-full", pr === "Critical" ? "bg-red-400" : pr === "High" ? "bg-amber-400" : pr === "Medium" ? "bg-blue-400" : "bg-slate-400")} />
                                                <span>{pr}</span>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Assignees */}
                            <div className="flex items-start gap-3 col-span-2 pt-2 border-t border-dashboard-border/60">
                                <span className="w-20 text-dashboard-muted-foreground font-medium flex items-center gap-1.5 shrink-0 pt-1">
                                    <Users className="w-3.5 h-3.5" /> Assignees
                                </span>
                                <div className="flex-1 flex items-center gap-2 flex-wrap">
                                    {assignees.map((user) => (
                                        <div
                                            key={user}
                                            className="flex items-center gap-1.5 bg-dashboard-card border border-dashboard-border px-2.5 py-1 rounded-full text-[11px] font-medium text-dashboard-foreground"
                                        >
                                            <div className="w-4 h-4 rounded-full bg-dashboard-primary/30 text-dashboard-primary flex items-center justify-center text-[9px] font-bold">
                                                {user
                                                    .substring(0, 2)
                                                    .toUpperCase()}
                                            </div>
                                            <span>{user}</span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveAssignee(user)
                                                }
                                                className="text-dashboard-muted-foreground hover:text-red-400 ml-0.5"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}

                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="px-2.5 py-1 rounded-full bg-dashboard-card hover:bg-dashboard-secondary border border-dashed border-dashboard-border text-[11px] text-dashboard-muted-foreground hover:text-dashboard-foreground flex items-center gap-1 cursor-pointer transition-colors outline-none">
                                            <UserPlus className="w-3 h-3" />
                                            <span>Add Assignee</span>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-48 min-w-48 bg-dashboard-card border-dashboard-border text-dashboard-foreground">
                                            {availableUsers.map((u) => (
                                                <DropdownMenuItem
                                                    key={u}
                                                    onClick={() =>
                                                        handleAddAssignee(u)
                                                    }
                                                    className="text-xs cursor-pointer"
                                                >
                                                    {u}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="flex items-center gap-3 col-span-2 pt-2 border-t border-dashboard-border/60">
                                <span className="w-20 text-dashboard-muted-foreground font-medium flex items-center gap-1.5 shrink-0">
                                    <Calendar className="w-3.5 h-3.5" /> Dates
                                </span>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-dashboard-muted-foreground text-[11px]">
                                            Start:
                                        </span>
                                        <input
                                            type="date"
                                            value={startDate}
                                            min={new Date().toISOString().split("T")[0]}
                                            onChange={(e) => {
                                                const newStartDate = e.target.value;
                                                setStartDate(newStartDate);
                                                if (dueDate && newStartDate > dueDate) {
                                                    setDueDate(newStartDate);
                                                }
                                            }}
                                            className="bg-dashboard-card border border-dashboard-border rounded-lg px-2.5 py-1 text-xs text-dashboard-foreground outline-none focus:border-dashboard-primary"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-dashboard-muted-foreground text-[11px]">
                                            Due:
                                        </span>
                                        <input
                                            type="date"
                                            value={dueDate}
                                            min={startDate || new Date().toISOString().split("T")[0]}
                                            onChange={(e) =>
                                                setDueDate(e.target.value)
                                            }
                                            className="bg-dashboard-card border border-dashboard-border rounded-lg px-2.5 py-1 text-xs text-dashboard-foreground outline-none focus:border-dashboard-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex items-center gap-3 col-span-2 pt-2 border-t border-dashboard-border/60">
                                <span className="w-20 text-dashboard-muted-foreground font-medium flex items-center gap-1.5 shrink-0">
                                    <Tag className="w-3.5 h-3.5" /> Tags
                                </span>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {tags.map((tg) => (
                                        <span
                                            key={tg}
                                            className="px-2.5 py-0.5 rounded-lg bg-dashboard-primary/10 text-dashboard-primary border border-dashboard-primary/20 text-[11px] font-medium"
                                        >
                                            #{tg}
                                        </span>
                                    ))}
                                    {showTagInput ? (
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="text"
                                                value={newTagInput}
                                                onChange={(e) =>
                                                    setNewTagInput(
                                                        e.target.value,
                                                    )
                                                }
                                                onKeyDown={(e) =>
                                                    e.key === "Enter" &&
                                                    handleAddTag()
                                                }
                                                placeholder="Tag name..."
                                                className="bg-dashboard-card border border-dashboard-border rounded-lg px-2 py-0.5 text-xs text-dashboard-foreground w-24 outline-none"
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddTag}
                                                className="text-emerald-400 hover:text-emerald-300 text-xs font-bold px-1"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowTagInput(true)
                                            }
                                            className="text-xs text-dashboard-muted-foreground hover:text-dashboard-foreground flex items-center gap-1"
                                        >
                                            <Plus className="w-3 h-3" /> Add Tag
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-dashboard-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                                Description
                            </label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add detailed instructions, technical scope, or prerequisites..."
                                className="min-h-28 bg-dashboard-secondary border-dashboard-border text-dashboard-foreground placeholder:text-dashboard-muted-foreground rounded-xl text-xs leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* Right Activity & Notes Sidebar (ClickUp 1/3 Panel) */}
                    <div className="w-full md:w-80 bg-dashboard-card flex flex-col shrink-0 min-h-0 border-t md:border-t-0 md:border-l border-dashboard-border">
                        {/* Sidebar Header */}
                        <div className="px-4 py-3.5 border-b border-dashboard-border flex items-center justify-between shrink-0 bg-dashboard-card">
                            <span className="text-xs font-bold text-dashboard-foreground flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                                Activity & Notes ({notes.length})
                            </span>
                        </div>

                        {/* Scrollable Notes List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 hide-scrollbar bg-dashboard-card">
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    className="bg-dashboard-secondary border border-dashboard-border rounded-xl p-3 space-y-2 text-xs"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-dashboard-primary/30 text-dashboard-primary flex items-center justify-center font-bold text-[9px]">
                                                {note.avatar || "PO"}
                                            </div>
                                            <span className="font-semibold text-dashboard-foreground">
                                                {note.author}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-dashboard-muted-foreground">
                                            {note.createdAt}
                                        </span>
                                    </div>
                                    <p className="text-dashboard-muted-foreground leading-relaxed">
                                        {note.text}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Note Composer Box */}
                        <div className="p-3 border-t border-dashboard-border bg-dashboard-card shrink-0 space-y-2">
                            <Textarea
                                value={newNoteText}
                                onChange={(e) => setNewNoteText(e.target.value)}
                                placeholder="Mention @user or write note..."
                                className="min-h-16 bg-dashboard-secondary border-dashboard-border text-dashboard-foreground placeholder:text-dashboard-muted-foreground text-xs rounded-xl p-2.5"
                            />
                            <div className="flex items-center justify-end">
                                {/* <div className="flex items-center gap-1 text-dashboard-muted-foreground">
                                    <button
                                        type="button"
                                        className="p-1 hover:text-dashboard-foreground"
                                    >
                                        <Paperclip className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        className="p-1 hover:text-dashboard-foreground"
                                    >
                                        <Smile className="w-3.5 h-3.5" />
                                    </button>
                                </div> */}
                                <Button
                                    type="button"
                                    onClick={handleAddNote}
                                    className="h-7 px-3 text-xs  font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-1"
                                >
                                    <Send className="w-3 h-3" />
                                    <span>Send</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                title="Delete Task"
                description={`Are you sure you want to delete "${title || "this task"}"? This action cannot be undone.`}
                variant="danger"
                confirmText="Delete Task"
                cancelText="Cancel"
                onConfirm={() => {
                    if (onDelete && task) {
                        onDelete(task.id);
                    }
                    setShowDeleteConfirm(false);
                    onClose();
                }}
            />
        </Dialog>
    );
}
