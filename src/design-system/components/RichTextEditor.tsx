import { Button } from "@/design-system";
import { useLanguage } from "@/shared/hooks";
import { cn } from "@/utils";
import { Highlight } from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
    Bold,
    Code,
    Highlighter,
    Image as ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Quote,
    Redo,
    Underline as UnderlineIcon,
    Undo,
} from "lucide-react";
import { useState } from "react";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const MenuBar = ({
    editor,
    onLinkClick,
    onImageClick,
}: {
    editor: any;
    onLinkClick: () => void;
    onImageClick: () => void;
}) => {
    if (!editor) return null;

    const buttons = [
        {
            icon: Bold,
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: editor.isActive("bold"),
            label: "Bold",
            group: 0,
        },
        {
            icon: Italic,
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: editor.isActive("italic"),
            label: "Italic",
            group: 0,
        },
        {
            icon: UnderlineIcon,
            action: () => editor.chain().focus().toggleUnderline().run(),
            isActive: editor.isActive("underline"),
            label: "Underline",
            group: 0,
        },
        // ── NEW: Highlight button in group 0 ──
        {
            icon: Highlighter,
            action: () =>
                editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: "#c7d2fe" })
                    .run(),
            isActive: editor.isActive("highlight"),
            label: "Highlight",
            group: 0,
        },
        {
            icon: List,
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive("bulletList"),
            label: "Bullet List",
            group: 1,
        },
        {
            icon: ListOrdered,
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: editor.isActive("orderedList"),
            label: "Ordered List",
            group: 1,
        },
        {
            icon: Quote,
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: editor.isActive("blockquote"),
            label: "Quote",
            group: 2,
        },
        {
            icon: Code,
            action: () => editor.chain().focus().toggleCodeBlock().run(),
            isActive: editor.isActive("codeBlock"),
            label: "Code Block",
            group: 2,
        },
        {
            icon: LinkIcon,
            action: onLinkClick,
            isActive: editor.isActive("link"),
            label: "Link",
            group: 3,
        },
        {
            icon: ImageIcon,
            action: onImageClick,
            isActive: false,
            label: "Image",
            group: 3,
        },
    ];

    const groups = [0, 1, 2, 3];

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-dashboard-secondary/50 backdrop-blur-md border-b border-dashboard-border sticky top-0 z-10">
            {groups.map((groupId, gi) => (
                <div
                    key={groupId}
                    className={cn(
                        "flex items-center gap-1 px-2",
                        gi < groups.length - 1 &&
                            "border-r border-dashboard-border",
                    )}
                >
                    {buttons
                        .filter((b) => b.group === groupId)
                        .map((btn, i) => (
                            <Button
                                key={i}
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={btn.action}
                                className={cn(
                                    "h-8 w-8 p-0 rounded-lg transition-all",
                                    btn.isActive
                                        ? "bg-dashboard-primary text-dashboard-primary-foreground shadow-sm"
                                        : "text-dashboard-muted-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground",
                                )}
                                title={btn.label}
                            >
                                <btn.icon className="h-3.5 w-3.5" />
                            </Button>
                        ))}
                </div>
            ))}

            <div className="flex-1" />

            <div className="flex items-center gap-1 border-l border-dashboard-border pl-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="h-8 w-8 p-0 rounded-lg text-dashboard-muted-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground disabled:opacity-30"
                >
                    <Undo className="h-3.5 w-3.5" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="h-8 w-8 p-0 rounded-lg text-dashboard-muted-foreground hover:bg-dashboard-secondary hover:text-dashboard-foreground disabled:opacity-30"
                >
                    <Redo className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
};

export default function RichTextEditor({
    content,
    onChange,
    placeholder,
}: RichTextEditorProps) {
    const { t } = useLanguage();
    const [linkModalOpen, setLinkModalOpen] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: { keepMarks: true, keepAttributes: false },
                orderedList: { keepMarks: true, keepAttributes: false },
            }),
            Underline,
            Highlight.configure({ multicolor: true }), // ← NEW
            Link.configure({ openOnClick: false }),
            Image.configure({ allowBase64: true }),
            Placeholder.configure({
                placeholder: placeholder || "Start writing...",
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "focus:outline-none min-h-[400px] p-8 max-w-none",
            },
        },
    });

    const handleLinkSubmit = () => {
        if (linkUrl && editor) {
            const url = linkUrl.startsWith("http")
                ? linkUrl
                : `https://${linkUrl}`;
            editor.chain().focus().setLink({ href: url }).run();
            setLinkUrl("");
            setLinkModalOpen(false);
        }
    };

    const handleImageSubmit = () => {
        if (imageUrl && editor) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
            setImageUrl("");
            setImageModalOpen(false);
        }
    };

    const characterCount = editor ? editor.getText().length : 0;

    return (
        <div className="w-full border-2 border-dashboard-border rounded-[2rem] bg-dashboard-card overflow-hidden focus-within:border-dashboard-primary/30 transition-all shadow-sm">
            <MenuBar
                editor={editor}
                onLinkClick={() => setLinkModalOpen(true)}
                onImageClick={() => setImageModalOpen(true)}
            />

            <EditorContent editor={editor} />

            <div className="flex justify-between items-center px-6 py-3 bg-dashboard-secondary/30 border-t border-dashboard-border text-xs text-dashboard-muted-foreground">
                <span>Characters: {characterCount}</span>
                <span>Rich Text Editor</span>
            </div>

            {/* Link Modal */}
            {linkModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-xs">
                    <div className="bg-dashboard-card border border-dashboard-border rounded-2xl p-6 w-96 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-black text-dashboard-foreground mb-4  tracking-tight">
                            Add Link
                        </h3>
                        <input
                            type="url"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleLinkSubmit()
                            }
                            placeholder="https://example.com"
                            className="w-full px-4 py-3 bg-dashboard-secondary/20 border border-dashboard-border rounded-xl focus:outline-none focus:ring-2 focus:ring-dashboard-primary/20 text-dashboard-foreground text-sm mb-4"
                            autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setLinkModalOpen(false);
                                    setLinkUrl("");
                                }}
                            >
                                {t("dashboard:common.cancel")}
                            </Button>
                            <Button onClick={handleLinkSubmit}>Add Link</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {imageModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-xs">
                    <div className="bg-dashboard-card border border-dashboard-border rounded-2xl p-6 w-96 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-black text-dashboard-foreground mb-4  tracking-tight">
                            Add Image
                        </h3>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleImageSubmit()
                            }
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-4 py-3 bg-dashboard-secondary/20 border border-dashboard-border rounded-xl focus:outline-none focus:ring-2 focus:ring-dashboard-primary/20 text-dashboard-foreground text-sm mb-4"
                            autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setImageModalOpen(false);
                                    setImageUrl("");
                                }}
                            >
                                {t("dashboard:common.cancel")}
                            </Button>
                            <Button onClick={handleImageSubmit}>
                                Add Image
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: var(--color-dashboard-muted-foreground);
                    opacity: 0.6;
                    pointer-events: none;
                    height: 0;
                }
                .ProseMirror { outline: none !important; }
                .ProseMirror p { margin: 0.5rem 0; color: var(--color-dashboard-foreground); opacity: 0.9; line-height: 1.75; }
                .ProseMirror strong { color: var(--color-dashboard-foreground); font-weight: 700; }
                .ProseMirror em { font-style: italic; color: var(--color-dashboard-foreground); opacity: 0.8; }
                .ProseMirror u {
                    text-decoration: underline;
                    text-decoration-color: var(--color-dashboard-primary);
                    text-underline-offset: 3px;
                    opacity: 0.8;
                }

                /* ── Highlight ── */
                .ProseMirror mark {
                    background-color: var(--color-dashboard-primary);
                    color: var(--color-dashboard-primary-foreground);
                    border-radius: 3px;
                    padding: 0.05em 0.2em;
                }

                .ProseMirror ul {
                    list-style-type: disc !important;
                    padding-left: 1.5rem !important;
                    margin: 0.75rem 0 !important;
                }
                .ProseMirror ol {
                    list-style-type: decimal !important;
                    padding-left: 1.5rem !important;
                    margin: 0.75rem 0 !important;
                }
                .ProseMirror li {
                    display: list-item !important;
                    margin: 0.25rem 0 !important;
                    color: var(--color-dashboard-foreground);
                    opacity: 0.9;
                }
                .ProseMirror li p { margin: 0 !important; }
                .ProseMirror blockquote {
                    border-left: 4px solid var(--color-dashboard-primary);
                    padding: 0.5rem 0 0.5rem 1rem;
                    margin: 1rem 0;
                    font-style: italic;
                    color: var(--color-dashboard-muted-foreground);
                    background: color-mix(in srgb, var(--color-dashboard-primary) 8%, transparent);
                    border-radius: 0 6px 6px 0;
                }
                .ProseMirror blockquote p { margin: 0.2rem 0 !important; }
                .ProseMirror code {
                    background: var(--color-dashboard-secondary);
                    color: var(--color-dashboard-primary);
                    font-family: 'Courier New', monospace;
                    font-size: 0.88em;
                    padding: 0.15em 0.45em;
                    border-radius: 5px;
                    border: 1px solid var(--color-dashboard-border);
                }
                .ProseMirror pre {
                    background: var(--color-dashboard-background);
                    border: 1px solid var(--color-dashboard-border);
                    border-radius: 10px;
                    padding: 1.25rem;
                    margin: 1rem 0;
                    overflow-x: auto;
                }
                .ProseMirror pre code {
                    background: none;
                    border: none;
                    padding: 0;
                    color: var(--color-dashboard-foreground);
                    font-size: 0.9rem;
                }
                .ProseMirror a {
                    color: var(--color-dashboard-primary);
                    text-decoration: underline;
                    text-underline-offset: 3px;
                    text-decoration-color: var(--color-dashboard-primary);
                    cursor: pointer;
                }
                .ProseMirror a:hover { opacity: 0.8; }
                .ProseMirror img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 1rem;
                    margin: 1.5rem 0;
                    border: 1px solid var(--color-dashboard-border);
                }
            `}</style>
        </div>
    );
}
