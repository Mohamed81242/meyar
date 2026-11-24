import React, { useState, useRef, useEffect, useMemo } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/utils";

interface AudioPlayerProps {
    src: string;
    variant?: "message" | "preview";
    className?: string;
}

const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, variant = "message", className }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);

    const speeds = [1, 1.5, 2];

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setDuration(audio.duration || 0);
            setCurrentTime(audio.currentTime || 0);
        };

        const setAudioTime = () => setCurrentTime(audio.currentTime || 0);
        const onEnd = () => setIsPlaying(false);

        audio.addEventListener("loadeddata", setAudioData);
        audio.addEventListener("timeupdate", setAudioTime);
        audio.addEventListener("ended", onEnd);

        return () => {
            audio.removeEventListener("loadeddata", setAudioData);
            audio.removeEventListener("timeupdate", setAudioTime);
            audio.removeEventListener("ended", onEnd);
        };
    }, []);

    const togglePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {});
        }
        setIsPlaying(!isPlaying);
    };

    const handleSpeedToggle = () => {
        const nextSpeed = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
        setPlaybackSpeed(nextSpeed);
        if (audioRef.current) {
            audioRef.current.playbackRate = nextSpeed;
        }
    };

    // Deterministic waveform data based on audio source string
    const waveData = useMemo(() => {
        let hash = 0;
        for (let i = 0; i < src.length; i++) {
            hash = src.charCodeAt(i) + ((hash << 5) - hash);
        }
        const random = (seed: number) => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        return Array.from({ length: 36 }, (_, i) => {
            return Math.max(0.2, random(hash + i));
        });
    }, [src]);

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audioRef.current.currentTime = percent * duration;
        setCurrentTime(percent * duration);
    };

    const isMessage = variant === "message";

    return (
        <div
            className={cn(
                "flex items-center gap-3 rounded-2xl min-w-56 max-w-sm p-2 transition-all",
                isMessage
                    ? "bg-dashboard-secondary/60 border border-dashboard-border/50"
                    : "bg-dashboard-primary/10 border border-dashboard-primary/30",
                className
            )}
        >
            <audio ref={audioRef} src={src} preload="metadata" />
            <button
                onClick={togglePlayPause}
                type="button"
                className={cn(
                    "w-9 h-9 shrink-0 flex items-center justify-center rounded-full transition-all cursor-pointer",
                    isMessage
                        ? "bg-dashboard-primary text-white shadow-md hover:bg-dashboard-primary/90"
                        : "bg-dashboard-primary text-white shadow-sm hover:opacity-90"
                )}
            >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <div className="flex-1 flex flex-col gap-1 pr-1 min-w-0">
                {/* Waveform Seek Bar */}
                <div className="w-full h-5 flex items-center gap-0.5 cursor-pointer group" onClick={handleSeek}>
                    {waveData.map((val, i) => {
                        const isFilled = duration > 0 ? i / waveData.length <= currentTime / duration : false;
                        return (
                            <div
                                key={i}
                                className={cn(
                                    "flex-1 rounded-full transition-colors duration-75",
                                    isFilled
                                        ? "bg-dashboard-primary"
                                        : isMessage
                                        ? "bg-dashboard-muted-foreground/30"
                                        : "bg-dashboard-primary/25"
                                )}
                                style={{ height: `${Math.max(20, val * 100)}%` }}
                            />
                        );
                    })}
                </div>

                {/* Duration & Speed Toggle Bar */}
                <div className="flex items-center justify-between text-[10px] font-medium text-dashboard-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={handleSpeedToggle}
                            type="button"
                            className="opacity-80 hover:opacity-100 transition-opacity px-1.5 py-0.5 rounded-md font-bold text-[9px] bg-dashboard-secondary border border-dashboard-border/40 text-dashboard-foreground cursor-pointer"
                        >
                            {playbackSpeed}x
                        </button>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
