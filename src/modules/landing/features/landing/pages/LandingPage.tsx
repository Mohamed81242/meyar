import React, { useState } from "react";
import {
    Navbar,
    Hero,
    Features,
    HowItWorks,
    AppDownload,
    Waitlist,
    Footer,
} from "../components";
import { useWaitlist } from "../hooks/useWaitlist";

export default function LandingPage() {
    const { count } = useWaitlist();
    const [liveCount, setLiveCount] = useState<number | null>(null);

    const activeCount = liveCount ?? count;

    return (
        <div
            className="min-h-screen bg-[#F6F4EF] text-[#1C2536] font-sans selection:bg-[#B8923D]/20 selection:text-[#0F1B2D] relative [color-scheme:light]"
            dir="rtl"
            style={{
                backgroundColor: "#F6F4EF",
                color: "#1C2536",
            }}
        >
            <Navbar />
            <main className="pt-18">
                <Hero waitlistCount={activeCount} />
                <Features />
                <HowItWorks />
                <AppDownload />
                <Waitlist
                    onCountChange={(newCount) => setLiveCount(newCount)}
                />
            </main>
            <Footer />
        </div>
    );
}
