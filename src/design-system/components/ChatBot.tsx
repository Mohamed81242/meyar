import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Cpu, X } from "lucide-react";
import { useState } from "react";

interface ChatBotProps {
    type?: "whatsapp" | "messenger";
    link?: string;
}

export const ChatBot = ({ type = "whatsapp", link = "" }: ChatBotProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");

    const suggestedQuestions = [
        "What services do you offer?",
        "How do I start a project?",
        "What is your tech stack?",
        "Tell me about SaaS architecture",
    ];

    const handleSend = (text?: string) => {
        const messageToSend = text || input;
        if (!messageToSend.trim() || !link) return;

        let url: string;
        if (type === "messenger") {
            url = link.startsWith("http") ? link : `https://m.me/${link}`;
        } else {
            const encodedMessage = encodeURIComponent(messageToSend);
            if (link.startsWith("http")) {
                const separator = link.includes("?") ? "&" : "?";
                url = `${link}${separator}text=${encodedMessage}`;
            } else {
                url = `https://wa.me/${link}?text=${encodedMessage}`;
            }
        }
        window.open(url, "_blank");

        setInput("");
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-8 right-8 z-100">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-24 right-0 w-[400px] h-auto bg-black/95 backdrop-blur-2xl rounded-lg border border-white/10 flex flex-col overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                                    style={{
                                        backgroundColor:
                                            type === "whatsapp"
                                                ? "#25D366"
                                                : "#0084FF",
                                    }}
                                >
                                    <Cpu className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold">
                                        Gostack AI
                                    </div>
                                    <div
                                        className="text-[10px] font-bold tracking-widest"
                                        style={{
                                            color:
                                                type === "whatsapp"
                                                    ? "#25D366"
                                                    : "#0084FF",
                                        }}
                                    >
                                        Online
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/40 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {/* 
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
                        >
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed ${
                                            msg.role === "user"
                                                ? "bg-brand-primary text-white rounded-tr-none shadow-lg shadow-brand-primary/10"
                                                : "bg-white/5 text-white/90 rounded-tl-none border border-white/10"
                                        }`}
                                    >
                                        <div className="markdown-body">
                                            <Markdown>{msg.text}</Markdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 p-5 rounded-2xl rounded-tl-none border border-white/10">
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 bg-brand-primary/60 rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-brand-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-2 h-2 bg-brand-primary/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div> */}

                        <div className="p-6 bg-white/5 border-t border-white/5 space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {suggestedQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(q)}
                                        className="text-[10px] px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && handleSend()
                                    }
                                    placeholder="Ask Gostack AI..."
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none transition-all pr-14"
                                    style={{ borderColor: undefined }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor =
                                            type === "whatsapp"
                                                ? "#25D366"
                                                : "#0084FF";
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor =
                                            "rgba(255,255,255,0.1)";
                                    }}
                                />
                                <button
                                    onClick={() => handleSend()}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 transition-colors"
                                    style={{
                                        color:
                                            type === "whatsapp"
                                                ? "#25D366"
                                                : "#0084FF",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = "#ffffff";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color =
                                            type === "whatsapp"
                                                ? "#25D366"
                                                : "#0084FF";
                                    }}
                                >
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 rounded-full text-white flex items-center justify-center shadow-2xl relative group overflow-hidden"
                style={{
                    backgroundColor:
                        type === "whatsapp" ? "#25D366" : "#0084FF",
                }}
            >
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                {isOpen ? (
                    <X size={24} />
                ) : type === "whatsapp" ? (
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.3A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                ) : (
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                    >
                        <path d="M12 2.04C6.5 2.04 2 6.09 2 11.08c0 2.68 1.32 5.08 3.38 6.63v3.29c0 .32.38.5.63.3l2.77-2.06c.93.26 1.92.4 2.94.4h.04c5.5 0 10-4.05 10-9.04S17.5 2.04 12 2.04zm1.03 7.54l-2.4 2.55-3.26-2.55-3.63 3.47 3.26-1.74 2.4 1.74 3.63-3.47z" />
                    </svg>
                )}
            </motion.button>
        </div>
    );
};
