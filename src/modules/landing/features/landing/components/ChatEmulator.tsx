import { useLanguage } from "@/shared/hooks";
import {
    CheckCheck,
    Loader2,
    MoreVertical,
    Phone,
    Send,
    ShieldAlert,
    Video,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface Message {
    id: string;
    sender: "user" | "bot" | "system";
    textKey: string;
    time: string;
}

export function ChatEmulator() {
    const { t, currentLanguage } = useLanguage("landing");
    const lang = currentLanguage as "en" | "ar";

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "m0",
            sender: "system",
            textKey: "whatsapp.typePrompt",
            time: "",
        },
    ]);

    const [isTyping, setIsTyping] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isEscalating, setIsEscalating] = useState(false);
    const [showEscalateBtn, setShowEscalateBtn] = useState(false);

    const handleOptionSelect = (option: "opt1" | "opt2") => {
        setSelectedOption(option);
        setShowEscalateBtn(false);

        // Add user message
        const userMsg: Message = {
            id: `u-${Date.now()}`,
            sender: "user",
            textKey: option === "opt1" ? "whatsapp.user1" : "whatsapp.user2",
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setMessages([userMsg]);
        setIsTyping(true);

        // Simulate AI response delay
        setTimeout(() => {
            setIsTyping(false);
            const botMsg1: Message = {
                id: `b1-${Date.now()}`,
                sender: "bot",
                textKey: option === "opt1" ? "whatsapp.bot1" : "whatsapp.bot2",
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };
            setMessages((prev) => [...prev, botMsg1]);

            if (option === "opt1") {
                // If VPN loop, simulate AI hotfix deploy after another short delay
                setIsTyping(true);
                setTimeout(() => {
                    setIsTyping(false);
                    const botMsg2: Message = {
                        id: `b2-${Date.now()}`,
                        sender: "bot",
                        textKey: "hero.resolved", // AI suggested Hotfix deployed
                        time: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                    };
                    setMessages((prev) => [...prev, botMsg2]);
                    setShowEscalateBtn(true);
                }, 1500);
            } else {
                setShowEscalateBtn(true);
            }
        }, 1200);
    };

    const handleEscalate = () => {
        setIsEscalating(true);
        setTimeout(() => {
            setIsEscalating(false);
            setShowEscalateBtn(false);

            const sysMsg: Message = {
                id: `s-${Date.now()}`,
                sender: "system",
                textKey: "whatsapp.escalated",
                time: "",
            };

            setMessages((prev) => [...prev, sysMsg]);
            toast.success(
                t("whatsapp.escalated") || "Ticket escalated successfully.",
            );
        }, 1500);
    };

    return (
        <div className="w-full bg-dashboard-card border border-dashboard-border rounded-3xl p-6 md:p-8 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-dashboard-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-dashboard-primary/15 transition-all duration-700" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* 3D Phone mockup on Left */}
                <div className="lg:col-span-5 flex justify-center [perspective:1000px]">
                    <motion.div
                        className="w-full max-w-[320px] h-[500px] bg-dashboard-background border border-dashboard-border rounded-[36px] flex flex-col overflow-hidden shadow-2xl relative [transform:rotateY(10deg)_rotateX(5deg)]"
                        style={{
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
                        }}
                    >
                        {/* Status bar */}
                        <div className="bg-dashboard-secondary px-6 py-2 flex justify-between items-center border-b border-dashboard-border select-none">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                <span className="text-[10px] font-bold text-dashboard-foreground tracking-wide">
                                    {t("whatsapp.whatsappActive") ||
                                        "WhatsApp active"}
                                </span>
                            </div>
                        </div>

                        {/* WhatsApp Header */}
                        <div
                            className="bg-dashboard-card px-4 py-3 flex justify-between items-center"
                            dir={lang === "ar" ? "rtl" : "ltr"}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-dashboard-secondary flex items-center justify-center font-bold text-dashboard-primary border border-dashboard-border">
                                    AI
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-xs font-bold text-dashboard-foreground leading-none">
                                        NOTA Helpdesk
                                    </span>
                                    <span className="text-[9px] text-dashboard-muted-foreground mt-0.5">
                                        {t("whatsapp.online") || "Online"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-dashboard-muted-foreground">
                                <Video size={14} />
                                <Phone size={12} />
                                <MoreVertical size={14} />
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 bg-dashboard-background p-4 overflow-y-auto flex flex-col gap-3 min-h-0 select-none">
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => {
                                    if (msg.sender === "system") {
                                        return (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="self-center bg-dashboard-secondary/50 border border-dashboard-border rounded-lg px-3 py-1.5 text-[9px] font-mono text-dashboard-muted-foreground text-center max-w-[85%] leading-relaxed"
                                            >
                                                {t(msg.textKey) || msg.textKey}
                                            </motion.div>
                                        );
                                    }

                                    const isUser = msg.sender === "user";

                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{
                                                opacity: 0,
                                                scale: 0.9,
                                                y: 15,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                y: 0,
                                            }}
                                            className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs flex flex-col relative ${
                                                isUser
                                                    ? "self-end bg-dashboard-primary text-dashboard-primary-foreground rounded-tr-none"
                                                    : "self-start bg-dashboard-secondary text-dashboard-foreground rounded-tl-none border border-dashboard-border"
                                            }`}
                                        >
                                            <p className="leading-relaxed font-medium">
                                                {t(msg.textKey) || msg.textKey}
                                            </p>
                                            <div className="flex justify-end items-center gap-1 mt-1 text-[8px] text-dashboard-muted-foreground">
                                                <span>{msg.time}</span>
                                                {isUser && (
                                                    <CheckCheck
                                                        size={10}
                                                        className="text-sky-400"
                                                    />
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                {isTyping && (
                                    <motion.div
                                        key="typing"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="self-start bg-dashboard-secondary rounded-2xl px-4 py-2.5 flex items-center gap-1 border border-dashboard-border"
                                    >
                                        <span className="w-1.5 h-1.5 bg-dashboard-muted-foreground rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-dashboard-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <span className="w-1.5 h-1.5 bg-dashboard-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Chat input box */}
                        <div className="bg-dashboard-secondary px-4 py-3 flex items-center gap-3 border-t border-dashboard-border select-none">
                            <div className="flex-1 bg-dashboard-background rounded-full px-4 py-1.5 text-xs text-dashboard-muted-foreground font-medium truncate">
                                Type message...
                            </div>
                            <button className="bg-dashboard-primary hover:bg-dashboard-primary/90 text-dashboard-primary-foreground p-2 rounded-full cursor-not-allowed border-none">
                                <Send size={12} />
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Info and Option Selectors on Right */}
                <div
                    className="lg:col-span-7 flex flex-col justify-center"
                    dir={lang === "ar" ? "rtl" : "ltr"}
                >
                    <span className="text-xs font-bold text-dashboard-primary  tracking-widest block mb-2 px-1">
                        {t("whatsapp.title") || "Inbound WhatsApp Support"}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-display font-extrabold text-dashboard-foreground tracking-tight">
                        {t("whatsapp.title") || "Inbound Omnichannel Helpdesk"}
                    </h2>
                    <p className="text-sm text-dashboard-muted-foreground mt-2 max-w-xl">
                        {t("whatsapp.subtitle") ||
                            "Employees report issues instantly via WhatsApp. The AI responder resolves tickets or routes them to specialized IT agents with Break-Glass access protocols."}
                    </p>

                    {/* Option Select Buttons */}
                    <div className="mt-8 flex flex-col gap-3 max-w-md">
                        <button
                            onClick={() => handleOptionSelect("opt1")}
                            className={`w-full text-left p-4 rounded-2xl border text-xs font-bold transition-all flex justify-between items-center ${
                                selectedOption === "opt1"
                                    ? "bg-dashboard-primary/10 border-dashboard-primary text-dashboard-foreground"
                                    : "bg-dashboard-background border-dashboard-border text-dashboard-muted-foreground hover:text-dashboard-foreground hover:border-dashboard-border/80"
                            }`}
                        >
                            <span>{t("whatsapp.option1")}</span>
                            <span className="text-[10px] bg-dashboard-secondary px-2 py-0.5 rounded-full font-mono font-normal">
                                INCIDENT
                            </span>
                        </button>

                        <button
                            onClick={() => handleOptionSelect("opt2")}
                            className={`w-full text-left p-4 rounded-2xl border text-xs font-bold transition-all flex justify-between items-center ${
                                selectedOption === "opt2"
                                    ? "bg-dashboard-primary/10 border-dashboard-primary text-dashboard-foreground"
                                    : "bg-dashboard-background border-dashboard-border text-dashboard-muted-foreground hover:text-dashboard-foreground hover:border-dashboard-border/80"
                            }`}
                        >
                            <span>{t("whatsapp.option2")}</span>
                            <span className="text-[10px] bg-dashboard-secondary px-2 py-0.5 rounded-full font-mono font-normal">
                                REQUEST
                            </span>
                        </button>
                    </div>

                    {/* Human Escalation Action */}
                    <AnimatePresence>
                        {showEscalateBtn && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="mt-6"
                            >
                                <button
                                    onClick={handleEscalate}
                                    disabled={isEscalating}
                                    className="bg-dashboard-destructive/10 border border-dashboard-destructive/20 hover:bg-dashboard-destructive/20 text-dashboard-destructive font-bold px-5 py-2.5 rounded-full text-xs flex items-center gap-2 transition-all cursor-pointer"
                                >
                                    {isEscalating ? (
                                        <>
                                            <Loader2
                                                size={12}
                                                className="animate-spin"
                                            />
                                            <span>
                                                {t("whatsapp.escalating") ||
                                                    "Escalating..."}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <ShieldAlert size={14} />
                                            <span>
                                                {t("whatsapp.escalate") ||
                                                    "Escalate to Agent"}
                                            </span>
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
