import {
    Dialog,
    DialogOverlay,
    DialogPortal,
} from "@/design-system/components/dialog";
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Grid3x3,
    ImageIcon,
    Play,
    Share2,
    X,
    ZoomIn,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface MediaItem {
    url: string;
    type?: "image" | "video";
    title?: string;
}

function isVideo(url: string, type?: string): boolean {
    if (type === "video") return true;
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".mkv"];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some((ext) => lowerUrl.includes(ext));
}

export function GalleryCarouselDialog({
    images,
    media,
    initialIndex,
    open,
    onClose,
    galleryId,
}: {
    images?: string[];
    media?: MediaItem[];
    initialIndex: number;
    open: boolean;
    onClose: () => void;
    galleryId?: number;
}) {
    // Normalize media array (support both images and media props)
    const mediaItems: MediaItem[] =
        media || images?.map((url) => ({ url, type: "image" })) || [];
    const [current, setCurrent] = useState(initialIndex);
    const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showThumbs, setShowThumbs] = useState(true);
    const [zoom, setZoom] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const thumbsRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const total = mediaItems.length;
    const currentItem = mediaItems[current];
    const currentIsVideo = currentItem
        ? isVideo(currentItem.url, currentItem.type)
        : false;

    useEffect(() => {
        if (open) {
            setCurrent(initialIndex);
            setZoom(false);
        }
    }, [open, initialIndex]);

    useEffect(() => {
        if (!thumbsRef.current) return;
        const active =
            thumbsRef.current.querySelector<HTMLButtonElement>(
                `[data-active="true"]`,
            );
        active?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }, [current]);

    const navigate = useCallback(
        (dir: "prev" | "next") => {
            if (isAnimating || zoom) return;
            setAnimDir(dir === "next" ? "left" : "right");
            setIsAnimating(true);
            setTimeout(() => {
                setCurrent((c) =>
                    dir === "next" ? (c + 1) % total : (c - 1 + total) % total,
                );
                setAnimDir(null);
                setTimeout(() => setIsAnimating(false), 50);
            }, 220);
        },
        [isAnimating, zoom, total],
    );

    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") navigate("next");
            if (e.key === "ArrowLeft") navigate("prev");
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, navigate, onClose]);

    const touchStart = useRef<number | null>(null);
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart.current === null) return;
        const diff = touchStart.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) navigate(diff > 0 ? "next" : "prev");
        touchStart.current = null;
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentItem?.url) return;

        let downloadUrl = currentItem.url;
        try {
            const urlObj = new URL(downloadUrl);
            // If it's a backend storage URL, make it relative so it goes through our Vite proxy (or same-origin in prod) to bypass CORS
            if (urlObj.pathname.startsWith('/storage/')) {
                downloadUrl = urlObj.pathname + urlObj.search;
            }
        } catch (err) {
            // Ignore invalid URLs
        }
        
        const toastId = toast.loading("Downloading media...");
        try {
            const response = await fetch(downloadUrl);
            if (!response.ok) throw new Error("Failed to fetch");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = currentItem.url.split('/').pop() || "download";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success("Download complete", { id: toastId });
        } catch (error) {
            console.error("Failed to download media", error);
            toast.error("Download failed. The file might have CORS restrictions.", { id: toastId });
        }
    };

    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />

                <div className="fixed inset-0 z-50 flex flex-col data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between px-6 py-4 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                                <ImageIcon
                                    size={16}
                                    className="text-white/70"
                                />
                            </div>
                            <div>
                                <p className="text-white font-display font-bold text-sm leading-none mb-0.5">
                                    Gallery #{galleryId}
                                </p>
                                <p className="text-white/40 text-xs font-bold tabular-nums">
                                    {current + 1}{" "}
                                    <span className="text-white/20">/</span>{" "}
                                    {total}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setZoom((v) => !v)}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${zoom ? "bg-secondary/20 border-secondary/50 text-secondary" : "bg-white/10 border-white/10 text-white/60 hover:bg-white/15 hover:text-white"}`}
                                title="Toggle zoom"
                            >
                                <ZoomIn size={16} />
                            </button>
                            <button
                                onClick={() => setShowThumbs((v) => !v)}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${showThumbs ? "bg-white/20 border-white/20 text-white" : "bg-white/10 border-white/10 text-white/60 hover:bg-white/15 hover:text-white"}`}
                                title="Toggle thumbnails"
                            >
                                <Grid3x3 size={16} />
                            </button>
                            <button
                                onClick={handleDownload}
                                className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/15 hover:text-white transition-all"
                                title="Download"
                            >
                                <Download size={16} />
                            </button>
                            <button
                                onClick={() =>
                                    navigator.clipboard?.writeText(
                                        currentItem?.url || "",
                                    )
                                }
                                className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/15 hover:text-white transition-all"
                                title="Copy URL"
                            >
                                <Share2 size={16} />
                            </button>
                            <div className="w-px h-6 bg-white/10 mx-1" />
                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-all"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Main Image Stage */}
                    <div
                        className="flex-1 relative flex items-center justify-center px-4 min-h-0 overflow-hidden"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Ambient glow */}
                        <div
                            className="absolute inset-0 pointer-events-none opacity-20 transition-all duration-1000"
                            style={{
                                background: `radial-gradient(ellipse 60% 60% at 50% 50%, var(--color-secondary), transparent)`,
                            }}
                        />

                        {/* Prev */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate("prev");
                            }}
                            disabled={isAnimating || zoom}
                            className="absolute left-4 z-10 w-12 h-12 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all disabled:opacity-30 group"
                        >
                            <ChevronLeft
                                size={22}
                                className="group-hover:-translate-x-0.5 transition-transform rtl:rotate-180"
                            />
                        </button>

                        {/* Media - Image or Video */}
                        <div
                            className={`relative w-[calc(100%-10rem)] md:w-[calc(100%-20rem)] mx-auto rounded-2xl overflow-hidden transition-all duration-500 select-none ${zoom && !currentIsVideo ? "cursor-zoom-out" : currentIsVideo ? "" : "cursor-zoom-in"}`}
                            style={{
                                opacity: isAnimating ? 0 : 1,
                                transform: isAnimating
                                    ? `translateX(${animDir === "left" ? "-40px" : "40px"}) scale(0.97)`
                                    : "translateX(0) scale(1)",
                                transition:
                                    "opacity 0.22s ease, transform 0.22s ease",
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isAnimating && !currentIsVideo)
                                    setZoom((v) => !v);
                            }}
                        >
                            {currentIsVideo ? (
                                <video
                                    ref={videoRef}
                                    src={currentItem?.url}
                                    className="block w-full max-h-[60vh] object-contain rounded-2xl"
                                    controls
                                    autoPlay={isPlaying}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                />
                            ) : (
                                <img
                                    src={currentItem?.url}
                                    alt={
                                        currentItem?.title ||
                                        `Image ${current + 1}`
                                    }
                                    className={`block w-full max-h-[60vh] object-contain rounded-2xl transition-all duration-500 ${zoom ? "scale-[2.5]" : "scale-100"}`}
                                    draggable={false}
                                />
                            )}
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5 pointer-events-none" />
                        </div>

                        {/* Next */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate("next");
                            }}
                            disabled={isAnimating || zoom}
                            className="absolute right-4 z-10 w-12 h-12 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all disabled:opacity-30 group"
                        >
                            <ChevronRight
                                size={22}
                                className="group-hover:translate-x-0.5 transition-transform rtl:rotate-180"
                            />
                        </button>

                        {/* Progress bar */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-secondary rounded-full transition-all duration-300"
                                style={{
                                    width: `${((current + 1) / total) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Thumbnails Strip */}
                    <div
                        className={`shrink-0 transition-all duration-500 overflow-hidden ${showThumbs ? "max-h-32 opacity-100" : "max-h-0 opacity-0"}`}
                    >
                        <div className="px-6 pt-4 pb-5">
                            <div className="relative">
                                <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />
                                <div
                                    ref={thumbsRef}
                                    className="flex gap-2 overflow-x-auto pb-1 scroll-smooth"
                                    style={{ scrollbarWidth: "none" }}
                                >
                                    {mediaItems.map((item, i) => {
                                        const itemIsVideo = isVideo(
                                            item.url,
                                            item.type,
                                        );
                                        return (
                                            <button
                                                key={i}
                                                data-active={i === current}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (isAnimating) return;
                                                    setAnimDir(
                                                        i > current
                                                            ? "left"
                                                            : "right",
                                                    );
                                                    setIsAnimating(true);
                                                    setTimeout(() => {
                                                        setCurrent(i);
                                                        setAnimDir(null);
                                                        setTimeout(
                                                            () =>
                                                                setIsAnimating(
                                                                    false,
                                                                ),
                                                            50,
                                                        );
                                                    }, 220);
                                                }}
                                                className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-300 border-2 ${i === current
                                                        ? "border-secondary scale-110 shadow-lg shadow-secondary/20"
                                                        : "border-white/10 opacity-50 hover:opacity-100 hover:border-white/30 hover:scale-105"
                                                    }`}
                                            >
                                                <img
                                                    src={item.url}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                    draggable={false}
                                                />
                                                {itemIsVideo && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                        <Play
                                                            size={16}
                                                            className="text-white fill-white"
                                                        />
                                                    </div>
                                                )}
                                                {i === current && (
                                                    <div className="absolute inset-0 ring-2 ring-secondary/50 ring-inset rounded-[10px]" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Dot indicators */}
                            <div className="flex justify-center gap-1 mt-3">
                                {Array.from({ length: Math.min(total, 9) }).map(
                                    (_, i) => {
                                        const idx = Math.floor(
                                            (current / total) *
                                            Math.min(total, 9),
                                        );
                                        return (
                                            <div
                                                key={i}
                                                className={`rounded-full transition-all duration-300 ${i === idx ? "w-4 h-1.5 bg-secondary" : "w-1.5 h-1.5 bg-white/20"}`}
                                            />
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogPortal>
        </Dialog>
    );
}
