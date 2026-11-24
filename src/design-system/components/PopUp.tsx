import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface PopUpProps {
    title?: string;
    description?: string;
    image?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    onClose?: () => void;
}

function PopUp({
    title,
    description,
    image,
    primaryColor,
    secondaryColor,
    accentColor,
    onClose,
}: PopUpProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        onClose?.();
    };

    if (!title && !description && !image) return;

    return (
        <>
            <style>{`
                                    .banner-popup-bg-accent:hover {
                                       background-color: ${accentColor};
                                    }
                                    
                                `}</style>
            <AnimatePresence>
                {isVisible && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
                            onClick={handleClose}
                        />

                        {/* Popup Card */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            whileHover={{
                                y: -4,
                                boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
                            }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="fixed inset-0 z-100 flex items-center justify-center p-4"
                        >
                            <div
                                className="relative w-full h-auto max-w-162.5 sm:w-[450px] md:w-[550px] lg:w-[650px] bg-white rounded-[28px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={handleClose}
                                    className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary banner-popup-bg-accent hover:bg-[${accentColor}] hover:text-white transition-all shadow-lg`}
                                    style={{
                                        color: primaryColor,
                                    }}
                                >
                                    <X size={16} />
                                </button>

                                {/* Image */}
                                <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -50, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative w-full h-full"
                                >
                                    {image ? (
                                        <img
                                            src={image}
                                            alt={title || "Banner"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-linear-to-br from-dashboard-primary/20 via-dashboard-background to-dashboard-primary/10 flex items-center justify-center overflow-hidden">
                                            {/* Default placeholder illustration */}
                                            <svg
                                                width="300"
                                                height="200"
                                                viewBox="0 0 300 200"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="absolute top-0 left-0"
                                            >
                                                <defs>
                                                    <radialGradient
                                                        id="sky1"
                                                        cx="50%"
                                                        cy="30%"
                                                        r="70%"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="#1e4a5c"
                                                        />
                                                        <stop
                                                            offset="100%"
                                                            stopColor="#0a1e28"
                                                        />
                                                    </radialGradient>
                                                </defs>
                                                <rect
                                                    width="300"
                                                    height="200"
                                                    fill="url(#sky1)"
                                                />
                                                <circle
                                                    cx="240"
                                                    cy="35"
                                                    r="18"
                                                    fill="#c8d8e8"
                                                    opacity="0.18"
                                                />
                                                <circle
                                                    cx="240"
                                                    cy="35"
                                                    r="12"
                                                    fill="#c8d8e8"
                                                    opacity="0.28"
                                                />
                                                <polygon
                                                    points="150,30 210,140 90,140"
                                                    fill="#122535"
                                                    opacity="0.95"
                                                />
                                                <polygon
                                                    points="150,50 195,140 105,140"
                                                    fill="#0a1c28"
                                                    opacity="0.9"
                                                />
                                                <polygon
                                                    points="60,60 110,140 10,140"
                                                    fill="#152a38"
                                                    opacity="0.9"
                                                />
                                                <polygon
                                                    points="250,50 295,140 205,140"
                                                    fill="#152a38"
                                                    opacity="0.85"
                                                />
                                                <rect
                                                    x="0"
                                                    y="130"
                                                    width="300"
                                                    height="70"
                                                    fill="#0a1c26"
                                                    opacity="0.6"
                                                />
                                                <rect
                                                    x="0"
                                                    y="150"
                                                    width="300"
                                                    height="50"
                                                    fill="#0d2232"
                                                    opacity="0.7"
                                                />
                                                <line
                                                    x1="0"
                                                    y1="148"
                                                    x2="300"
                                                    y2="148"
                                                    stroke="#1a3a4a"
                                                    strokeWidth="0.5"
                                                    opacity="0.4"
                                                />
                                                <ellipse
                                                    cx="150"
                                                    cy="195"
                                                    rx="120"
                                                    ry="8"
                                                    fill="#0a1825"
                                                    opacity="0.5"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Card Body */}
                                <div className="p-5">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-2.5">
                                        <motion.h3
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.15 }}
                                            className="text-xl font-bold leading-tight"
                                            style={{
                                                color: primaryColor,
                                            }}
                                        >
                                            {title || "Special Offer"}
                                        </motion.h3>
                                    </div>

                                    {/* Description */}
                                    <motion.div
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.25 }}
                                        className="banner-popup-content text-[13px] leading-[1.55] mb-3.5"
                                        dangerouslySetInnerHTML={{
                                            __html: description || "",
                                        }}
                                        style={{
                                            color: secondaryColor,
                                        }}
                                    />
                                    <style>{`
                                    .banner-popup-content {
                                        color: #607080;
                                        font-size: 0.8125rem;
                                        line-height: 1.55;
                                    }
                                    .banner-popup-content p {
                                        margin: 0.5rem 0;
                                    }
                                    .banner-popup-content strong {
                                        font-weight: 700;
                                        color: #0f172a;
                                    }
                                    .banner-popup-content em {
                                        font-style: italic;
                                    }
                                    .banner-popup-content u {
                                        text-decoration: underline;
                                        text-underline-offset: 3px;
                                    }
                                    .banner-popup-content ul {
                                        list-style-type: disc;
                                        padding-left: 1.25rem;
                                        margin: 0.5rem 0;
                                    }
                                    .banner-popup-content ol {
                                        list-style-type: decimal;
                                        padding-left: 1.25rem;
                                        margin: 0.5rem 0;
                                    }
                                    .banner-popup-content li {
                                        display: list-item;
                                        margin: 0.25rem 0;
                                    }
                                    .banner-popup-content blockquote {
                                        border-left: 3px solid #C8A96A;
                                        padding: 0.5rem 0 0.5rem 0.75rem;
                                        margin: 0.75rem 0;
                                        font-style: italic;
                                        background: #f8f9fa;
                                        border-radius: 0 4px 4px 0;
                                    }
                                    .banner-popup-content a {
                                        color: #C8A96A;
                                        text-decoration: underline;
                                    }
                                    .banner-popup-content img {
                                        max-width: 100%;
                                        height: auto;
                                        border-radius: 0.5rem;
                                        margin: 0.5rem 0;
                                    }
                                `}</style>

                                    {/* Action Button */}
                                    <motion.button
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.35 }}
                                        onClick={handleClose}
                                        whileHover={{ opacity: 0.88 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3.5 rounded-2xl text-white text-[15px] font-bold transition-all"
                                        style={{
                                            backgroundColor: primaryColor,
                                        }}
                                    >
                                        Got it
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default PopUp;
