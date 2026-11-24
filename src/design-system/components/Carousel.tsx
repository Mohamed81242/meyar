import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue } from "motion/react";

interface CarouselProps {
    children: React.ReactNode[];
    autoSlide?: boolean;
    autoSlideInterval?: number;
    className?: string;
}

export const Carousel = ({
    children,
    autoSlide = true,
    autoSlideInterval = 5000,
    className = "",
}: CarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const x = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % children.length);
    };

    const prev = () => {
        setCurrentIndex(
            (prev) => (prev - 1 + children.length) % children.length,
        );
    };

    useEffect(() => {
        if (autoSlide && !isDragging) {
            const interval = setInterval(next, autoSlideInterval);
            return () => clearInterval(interval);
        }
    }, [currentIndex, autoSlide, autoSlideInterval, isDragging]);

    const handleDragEnd = (
        _: any,
        {
            offset,
            velocity,
        }: { offset: { x: number }; velocity: { x: number } },
    ) => {
        const swipe = offset.x + velocity.x * 50;
        if (swipe < -50) {
            next();
        } else if (swipe > 50) {
            prev();
        }
        setIsDragging(false);
    };

    const handleDragStart = () => {
        setIsDragging(true);
    };

    return (
        <div
            className={`relative overflow-hidden ${className}`}
            ref={containerRef}
        >
            <motion.div
                className="flex"
                animate={{ x: `-${currentIndex * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                style={{ x }}
            >
                {children.map((child, index) => (
                    <motion.div
                        key={index}
                        className="w-full shrink-0"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                    >
                        {child}
                    </motion.div>
                ))}
            </motion.div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-6">
                {children.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                            index === currentIndex
                                ? "bg-white w-8"
                                : "bg-white/30 hover:bg-white/50"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};
