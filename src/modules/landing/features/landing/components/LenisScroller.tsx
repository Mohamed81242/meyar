import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function LenisScroller() {
    useEffect(() => {
        // Initialize Lenis smooth scroll
        const lenis = new Lenis({
            duration: 1.0,
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1.1,
        });

        // Bridge: tell ScrollTrigger about every Lenis scroll frame
        lenis.on("scroll", ScrollTrigger.update);

        // Drive Lenis from GSAP's ticker so both systems share the same frame loop
        const tickerCallback = (time: number) => {
            lenis.raf(time * 1000); // GSAP ticker reports seconds, Lenis expects ms
        };
        gsap.ticker.add(tickerCallback);

        // Disable GSAP's built-in lag smoothing so scrub stays snappy
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tickerCallback);
            lenis.destroy();
        };
    }, []);

    return null;
}
