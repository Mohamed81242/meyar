import { useLanguage } from "@/shared/hooks";
import { Cpu, Database, Layers, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function TenancyVisualization() {
    const { t } = useLanguage("landing");
    const [selectedTier, setSelectedTier] = useState<
        "pool" | "bridge" | "silo"
    >("bridge");

    const tiers = [
        {
            id: "pool" as const,
            titleKey: "tenancy.poolTitle",
            descKey: "tenancy.poolDesc",
            isoKey: "tenancy.poolIso",
            icon: Layers,
            color: "from-blue-500 to-indigo-500",
            glowColor: "rgba(59, 130, 246, 0.4)",
            translateY: "-translate-y-2",
            stackOffset: "z-10 translate-y-8 scale-90 opacity-40",
        },
        {
            id: "bridge" as const,
            titleKey: "tenancy.bridgeTitle",
            descKey: "tenancy.bridgeDesc",
            isoKey: "tenancy.bridgeIso",
            icon: Database,
            color: "from-dashboard-primary to-purple-500",
            glowColor: "rgba(105, 117, 226, 0.4)",
            translateY: "translate-y-0",
            stackOffset: "z-20 translate-y-0 scale-100",
        },
        {
            id: "silo" as const,
            titleKey: "tenancy.siloTitle",
            descKey: "tenancy.siloDesc",
            isoKey: "tenancy.siloIso",
            icon: ShieldCheck,
            color: "from-emerald-500 to-teal-500",
            glowColor: "rgba(16, 185, 129, 0.4)",
            translateY: "translate-y-2",
            stackOffset: "z-10 -translate-y-8 scale-90 opacity-40",
        },
    ];

    const currentTierData = tiers.find((tier) => tier.id === selectedTier)!;

    return (
        <div className="w-full bg-dashboard-card border border-dashboard-border rounded-3xl p-6 md:p-8 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-dashboard-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-dashboard-primary/15 transition-all duration-700" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Text Section */}
                <div className="lg:col-span-6 flex flex-col justify-center">
                    <span className="text-xs font-bold text-dashboard-primary  tracking-widest block mb-2 px-1">
                        {t("tenancy.title") || "SaaS Multi-Tenancy"}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-display font-extrabold text-dashboard-foreground tracking-tight">
                        {t("tenancy.title") ||
                            "SaaS Multi-Tenancy Infrastructure Tiers"}
                    </h2>
                    <p className="text-sm text-dashboard-muted-foreground mt-2 max-w-xl">
                        {t("tenancy.subtitle") ||
                            "Each pricing tier is physically matched with a dedicated data isolation strategy to guarantee SOC 2 and GDPR compliance."}
                    </p>

                    {/* Interactive Selection Tabs */}
                    <div className="flex gap-2 mt-8 bg-dashboard-background p-1 border border-dashboard-border rounded-full w-fit">
                        {tiers.map((tInfo) => (
                            <button
                                key={tInfo.id}
                                onClick={() => setSelectedTier(tInfo.id)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                    selectedTier === tInfo.id
                                        ? "bg-dashboard-primary text-dashboard-primary-foreground"
                                        : "text-dashboard-muted-foreground hover:text-dashboard-foreground"
                                }`}
                            >
                                {t(tInfo.titleKey).split(" ")[0]}
                            </button>
                        ))}
                    </div>

                    {/* Detailed Card Info */}
                    <div className="mt-6 bg-dashboard-background border border-dashboard-border rounded-2xl p-5 relative overflow-hidden min-h-[160px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedTier}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-dashboard-secondary p-2 rounded-xl text-dashboard-primary">
                                        {(() => {
                                            const IconComp =
                                                currentTierData.icon;
                                            return <IconComp size={16} />;
                                        })()}
                                    </span>
                                    <h3 className="text-sm font-bold text-dashboard-foreground  tracking-wider">
                                        {t(currentTierData.titleKey)}
                                    </h3>
                                </div>
                                <p className="text-xs font-medium text-dashboard-muted-foreground leading-relaxed">
                                    {t(currentTierData.descKey)}
                                </p>
                                <div className="mt-4 border-t border-dashboard-border pt-3 flex justify-between items-center text-[10px] font-mono text-dashboard-primary">
                                    <span>{t(currentTierData.isoKey)}</span>
                                    <span className="flex items-center gap-1">
                                        <Cpu size={10} />
                                        SaaS Infrastructure Tier
                                    </span>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* 3D Visualizer Section */}
                <div className="lg:col-span-6 flex justify-center py-10 relative">
                    <div className="relative w-80 h-96 flex items-center justify-center [perspective:1000px]">
                        {/* 3D Stack Tiers */}
                        {tiers.map((tierInfo, index) => {
                            const isSelected = selectedTier === tierInfo.id;

                            // Adjusting stacking positions dynamically
                            let layerStyles = "";
                            if (isSelected) {
                                layerStyles = "scale-105 z-30 opacity-100";
                            } else {
                                if (selectedTier === "pool") {
                                    layerStyles =
                                        tierInfo.id === "bridge"
                                            ? "translate-y-16 scale-95 z-20 opacity-60"
                                            : "translate-y-32 scale-90 z-10 opacity-30";
                                } else if (selectedTier === "bridge") {
                                    layerStyles =
                                        tierInfo.id === "pool"
                                            ? "-translate-y-16 scale-95 z-20 opacity-60"
                                            : "translate-y-16 scale-95 z-10 opacity-60";
                                } else {
                                    layerStyles =
                                        tierInfo.id === "bridge"
                                            ? "-translate-y-16 scale-95 z-20 opacity-60"
                                            : "-translate-y-32 scale-90 z-10 opacity-30";
                                }
                            }

                            const IconC = tierInfo.icon;

                            return (
                                <motion.div
                                    key={tierInfo.id}
                                    onClick={() => setSelectedTier(tierInfo.id)}
                                    className={`absolute w-64 bg-dashboard-card border rounded-2xl p-4 cursor-pointer transition-all duration-500 ease-out flex flex-col [transform-style:preserve-3d] [transform:rotateX(40deg)_rotateY(-15deg)_rotateZ(10deg)] hover:border-dashboard-primary/40 ${layerStyles} ${
                                        isSelected
                                            ? "border-dashboard-primary bg-dashboard-secondary"
                                            : "border-dashboard-border"
                                    }`}
                                    style={{
                                        boxShadow: isSelected
                                            ? `0 15px 35px -10px ${tierInfo.glowColor}, 0 0 15px 0px ${tierInfo.glowColor}`
                                            : "0 10px 20px -5px rgba(0,0,0,0.5)",
                                    }}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tierInfo.color} flex items-center justify-center text-white shrink-0`}
                                            >
                                                <IconC size={16} />
                                            </span>
                                            <div>
                                                <span className="text-[9px]  font-bold text-dashboard-muted-foreground">
                                                    DATABASE LAYER
                                                </span>
                                                <h4 className="text-xs font-bold text-dashboard-foreground leading-none mt-0.5">
                                                    {
                                                        t(
                                                            tierInfo.titleKey,
                                                        ).split(" ")[0]
                                                    }
                                                </h4>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mock Database Console Output */}
                                    <div className="flex-1 bg-dashboard-background/60 rounded-lg p-2.5 font-mono text-[9px] text-dashboard-muted-foreground space-y-1 select-none">
                                        <div className="flex gap-1.5 items-center text-dashboard-primary">
                                            <span className="w-1 h-1 rounded-full bg-dashboard-primary animate-pulse" />
                                            <span>[SYSTEM STATUS: ONLINE]</span>
                                        </div>
                                        <div className="truncate text-emerald-400">
                                            {tierInfo.id === "pool"
                                                ? "psql> ENABLE ROW LEVEL SECURITY;"
                                                : tierInfo.id === "bridge"
                                                  ? "psql> SET search_path TO tenant_slug;"
                                                  : "psql> CONNECT nota_tenant_slug;"}
                                        </div>
                                        <div className="truncate text-[8px] text-dashboard-muted-foreground/60">
                                            {tierInfo.id === "pool"
                                                ? "Isolation tier Logical (RLS)..."
                                                : tierInfo.id === "bridge"
                                                  ? "Isolation tier isolated schema..."
                                                  : "Isolation tier physical db instance..."}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
