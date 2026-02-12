"use client"

import { Map, positionTransformX, positionTransformY } from "@/components/map-visualization/map"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { MapKill, MapPlant, MapGrenade, RoundType, DefaultKey } from "@/lib/types";
import { useState, useMemo } from "react";

const SiteColors: Record<string, string> = {
    "A": "fill-red-500",
    "B": "fill-blue-500",
}

type TeamMapSectionProps = {
    map_name: string,
    side: "CT" | "TERRORIST",
    plants: MapPlant[];
    duels: MapKill[];
    grenades: MapGrenade[];
    defaultType: RoundType;
    selectedDefaults: Set<DefaultKey>;
}

type MapType = "utility" | "duels" | "plants";
type TimingType = "all" | "early" | "preplant" | "postplant";
type DuelDisplayMode = "both" | "lines" | "endpoints";
type GrenadeFilter = "all" | "smoke" | "molotov" | "flash" | "he";

const GRENADE_COLORS: Record<string, string> = {
    "smoke": "#9CA3AF",
    "molotov": "#EF4444",
    "flash": "#EAB308",
    "he": "#22C55E",
};

function getGrenadeCategory(grenade_type: string): "smoke" | "molotov" | "flash" | "he" {
    const t = grenade_type.toLowerCase();
    if (t.includes("smoke")) return "smoke";
    if (t.includes("molotov") || t.includes("inc")) return "molotov";
    if (t.includes("flash")) return "flash";
    return "he";
}

export default function TeamMapSection({
    map_name,
    side,
    plants,
    duels,
    grenades,
    defaultType,
    selectedDefaults
}: TeamMapSectionProps) {
    const [mapType, setMapType] = useState<MapType>("utility");
    const [timingType, setTimingType] = useState<TimingType>("early");
    const [duelDisplayMode, setDuelDisplayMode] = useState<DuelDisplayMode>("both");
    const [timeFilter, setTimeFilter] = useState<number>(60);
    const [grenadeFilter, setGrenadeFilter] = useState<GrenadeFilter>("all");

    // Helper to check if a duel/plant/grenade matches the selected defaults
    const matchesSelectedDefaults = useMemo(() => {
        return (item: { round_type: string; num_a: number; num_mid: number; num_b: number }) => {
            if (defaultType === 'all') {
                // In "all" mode, check if the setup key (with "-all" suffix) is selected
                const allKey = `${item.num_a}-${item.num_mid}-${item.num_b}-all` as DefaultKey;
                return selectedDefaults.has(allKey);
            }
            // In specific mode, check if the exact key is selected
            const key = `${item.num_a}-${item.num_mid}-${item.num_b}-${item.round_type}` as DefaultKey;
            return selectedDefaults.has(key);
        };
    }, [defaultType, selectedDefaults]);

    const filteredDuels = useMemo(() => {
        return duels
            .filter(d => d.map_name === map_name)
            .filter(d => {
                // Filter by side - show duels where this team was playing on the selected side
                const teamSide = d.attacker_this_team ? d.attacker_team : d.victim_team;
                return teamSide === side;
            })
            .filter(d => {
                // Filter by round type
                if (defaultType === 'all') return true;
                return d.round_type === defaultType;
            })
            .filter(d => {
                // Filter by selected defaults
                return matchesSelectedDefaults(d);
            })
            .filter(d => {
                switch (timingType) {
                    case "all":
                        return true;
                    case "early":
                        // Kills within the first X seconds of the round
                        return d.time <= timeFilter;
                    case "preplant":
                        // Kills within 30 seconds before plant
                        if (d.plant_time === null) {
                            // No plant in this round - exclude from pre-plant view
                            return false;
                        }
                        return d.time < d.plant_time && (d.plant_time - d.time) <= 30;
                    case "postplant":
                        // Kills within 30 seconds after plant
                        if (d.plant_time === null) {
                            return false;
                        }
                        return d.time >= d.plant_time && (d.time - d.plant_time) <= 30;
                    default:
                        return true;
                }
            });
    }, [duels, map_name, side, defaultType, matchesSelectedDefaults, timingType, timeFilter]);

    const filteredPlants = useMemo(() => {
        return plants
            .filter(p => p.map_name === map_name)
            .filter(p => {
                // Filter by round type
                if (defaultType === 'all') return true;
                return p.round_type === defaultType;
            })
            .filter(p => {
                // Filter by selected defaults
                return matchesSelectedDefaults(p);
            });
    }, [plants, map_name, defaultType, matchesSelectedDefaults]);

    const filteredGrenades = useMemo(() => {
        return grenades
            .filter(g => g.map_name === map_name)
            .filter(g => g.team_side === side)
            .filter(g => {
                if (defaultType === 'all') return true;
                return g.round_type === defaultType;
            })
            .filter(g => matchesSelectedDefaults(g))
            .filter(g => {
                if (grenadeFilter === "all") return true;
                return getGrenadeCategory(g.grenade_type) === grenadeFilter;
            })
            .filter(g => {
                // All grenade end_times include the full effect duration
                const expireTime = g.end_time;
                switch (timingType) {
                    case "all":
                        return true;
                    case "early":
                        // Include grenades that have started by the slider time and haven't expired
                        return g.start_time <= timeFilter;
                    case "preplant": {
                        // Show grenades visible in the window [plant_time - 30s, plant_time]
                        if (g.plant_time === null) return false;
                        const windowStart = g.plant_time - 30;
                        const windowEnd = g.plant_time;
                        // Grenade is relevant if it's active (thrown and not expired) during the window
                        return g.start_time <= windowEnd && expireTime >= windowStart;
                    }
                    case "postplant": {
                        // Show grenades visible in the window [plant_time, plant_time + 30s]
                        if (g.plant_time === null) return false;
                        const windowStart = g.plant_time;
                        const windowEnd = g.plant_time + 30;
                        return g.start_time <= windowEnd && expireTime >= windowStart;
                    }
                    default:
                        return true;
                }
            });
    }, [grenades, map_name, side, defaultType, matchesSelectedDefaults, grenadeFilter, timingType, timeFilter]);

    const getTimingLabel = () => {
        switch (timingType) {
            case "all":
                return "All rounds";
            case "early":
                return `First ${timeFilter}s of round`;
            case "preplant":
                return "Within 30s before plant";
            case "postplant":
                return "Within 30s after plant";
        }
    };

    const showLines = duelDisplayMode === "both" || duelDisplayMode === "lines";
    const showEndpoints = duelDisplayMode === "both" || duelDisplayMode === "endpoints";

    return (
        <div className="grid grid-cols-5 gap-4">
            <div className="w-full col-span-2">
                <div className="text-lg font-medium mb-2">Map</div>
                <Tabs value={mapType} onValueChange={(v) => setMapType(v as MapType)} className="mb-2">
                    <TabsList>
                        <TabsTrigger value="utility">Utility</TabsTrigger>
                        <TabsTrigger value="duels">Duels</TabsTrigger>
                        <TabsTrigger value="plants">Plants</TabsTrigger>
                    </TabsList>
                </Tabs>
                {mapType != "plants" && <Tabs value={timingType} onValueChange={(v) => setTimingType(v as TimingType)} className="mb-2">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="early">Early Round</TabsTrigger>
                        <TabsTrigger value="preplant">Pre-Plant</TabsTrigger>
                        <TabsTrigger value="postplant">Post-Plant</TabsTrigger>
                    </TabsList>
                </Tabs>}

                {mapType === "utility" && (
                    <>
                        <Tabs value={grenadeFilter} onValueChange={(v) => setGrenadeFilter(v as GrenadeFilter)} className="mb-3">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="smoke">Smokes</TabsTrigger>
                                <TabsTrigger value="molotov">Molotovs</TabsTrigger>
                                <TabsTrigger value="he">HEs</TabsTrigger>
                                <TabsTrigger value="flash">Flashbangs</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {timingType === "early" && (
                            <div className="mb-2">
                                <div className="text-sm text-gray-600 mb-1">{getTimingLabel()}</div>
                                <Slider
                                    value={[timeFilter]}
                                    onValueChange={(v) => setTimeFilter(v[0])}
                                    min={0}
                                    max={120}
                                    step={1}
                                    className="w-full"
                                />
                            </div>
                        )}
                        {timingType !== "early" && (
                            <div className="mb-2">
                                <div className="text-sm text-gray-600">{getTimingLabel()}</div>
                            </div>
                        )}

                        <div className="flex gap-4 text-sm mt-3 flex-wrap">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: GRENADE_COLORS.smoke }}></div>
                                <span>Smoke</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: GRENADE_COLORS.molotov }}></div>
                                <span>Molotov</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: GRENADE_COLORS.he }}></div>
                                <span>HE</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: GRENADE_COLORS.flash }}></div>
                                <span>Flashbang</span>
                            </div>
                        </div>
                    </>
                )}

                {mapType === "duels" && (
                    <>
                        <Tabs value={duelDisplayMode} onValueChange={(v) => setDuelDisplayMode(v as DuelDisplayMode)} className="mb-3">
                            <TabsList>
                                <TabsTrigger value="both">Lines + Points</TabsTrigger>
                                <TabsTrigger value="lines">Lines Only</TabsTrigger>
                                <TabsTrigger value="endpoints">Points Only</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {timingType === "early" && (
                            <div className="mb-2">
                                <div className="text-sm text-gray-600 mb-1">{getTimingLabel()}</div>
                                <Slider
                                    value={[timeFilter]}
                                    onValueChange={(v) => setTimeFilter(v[0])}
                                    min={0}
                                    max={120}
                                    step={1}
                                    className="w-full"
                                />
                            </div>
                        )}
                        {timingType !== "early" && (
                            <div className="mb-2">
                                <div className="text-sm text-gray-600">{getTimingLabel()}</div>
                            </div>
                        )}

                        <div className="flex gap-4 text-sm mt-3">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span>Team Kills</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span>Team Deaths</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="col-span-3 w-full mb-4">
                <Map map_name={map_name}>
                    {mapType === "plants" && filteredPlants.map((p, i) => (
                        <rect
                            key={i}
                            x={positionTransformX(p.x, map_name) - 0.5}
                            y={positionTransformY(p.y, map_name) - 0.5}
                            width={1} height={1}
                            className={`${SiteColors[p.site]} opacity-60`}
                            rx={0.2} ry={0.2}
                        />
                    ))}

                    {mapType === "utility" && filteredGrenades.map((g, i) => {
                        const category = getGrenadeCategory(g.grenade_type);
                        const color = GRENADE_COLORS[category];
                        const startX = positionTransformX(g.start_x, map_name);
                        const startY = positionTransformY(g.start_y, map_name);
                        const endX = positionTransformX(g.end_x, map_name);
                        const endY = positionTransformY(g.end_y, map_name);

                        // Smoke/HE end_tick includes time after landing.
                        // Subtract effect duration to get actual flight time.
                        const SMOKE_EFFECT_DURATION = 22;
                        const HE_FLIGHT_TIME = 1.6;
                        const rawDuration = g.end_time - g.start_time;
                        let flightDuration: number;
                        if (category === "smoke") {
                            flightDuration = Math.max(rawDuration - SMOKE_EFFECT_DURATION, 0.001);
                        } else if (category === "he") {
                            flightDuration = HE_FLIGHT_TIME;
                        } else {
                            flightDuration = Math.max(rawDuration, 0.001);
                        }
                        const landTime = g.start_time + flightDuration;

                        // Use slider as time cursor for trajectory animation in all modes
                        let currentTime: number;
                        if (timingType === "all") {
                            // Show all grenades with full trajectory at landed position
                            currentTime = landTime;
                        } else if (timingType === "early") {
                            currentTime = timeFilter;
                        } else if (timingType === "preplant") {
                            // Show state at plant time (end of the 30s window)
                            currentTime = g.plant_time ?? 0;
                        } else {
                            // postplant: show state at end of 30s window
                            currentTime = (g.plant_time ?? 0) + 30;
                        }
                        const isInFlight = currentTime >= g.start_time && currentTime <= landTime;
                        const hasLanded = currentTime > landTime;
                        const timeSinceLanding = hasLanded ? currentTime - landTime : 0;
                        // Flash/HE/Molotov get a minimum persist time so they're visible after popping
                        const MIN_FLASH_HE_PERSIST = 5;
                        const MIN_MOLOTOV_PERSIST = 7;
                        const dataExpiry = g.end_time;
                        const expiryTime = (category === "flash" || category === "he")
                            ? Math.max(dataExpiry, landTime + MIN_FLASH_HE_PERSIST)
                            : category === "molotov"
                            ? Math.max(dataExpiry, landTime + MIN_MOLOTOV_PERSIST)
                            : dataExpiry;
                        const isExpired = currentTime > expiryTime;

                        if (isExpired) return null;
                        if (currentTime < g.start_time) return null;

                        // Calculate trajectory progress
                        const progress = isInFlight
                            ? Math.min(1, (currentTime - g.start_time) / flightDuration)
                            : 1;

                        const currentX = startX + (endX - startX) * progress;
                        const currentY = startY + (endY - startY) * progress;

                        // Determine visibility and opacity based on grenade state
                        let opacity = 0.8;
                        let showTrajectory = true;
                        let showEndCircle = false;
                        let circleRadius = 0.5;
                        let circleColor = color;

                        if (hasLanded) {
                            showEndCircle = true;
                            showTrajectory = false;
                            const effectDuration = expiryTime - landTime;
                            const fadeProgress = effectDuration > 0 ? timeSinceLanding / effectDuration : 1;
                            if (category === "smoke") {
                                circleRadius = 1.5;
                                opacity = 0.6;
                            } else if (category === "molotov") {
                                circleRadius = 1.0;
                                opacity = 0.7 * (1 - fadeProgress);
                            } else if (category === "flash") {
                                circleRadius = 1.2;
                                circleColor = "#FFFFFF";
                                opacity = 0.7 * (1 - fadeProgress);
                            } else {
                                // HE
                                circleRadius = 1.2;
                                opacity = 0.7 * (1 - fadeProgress);
                            }
                        }

                        return (
                            <g key={i}>
                                {showTrajectory && (
                                    <line
                                        x1={startX}
                                        y1={startY}
                                        x2={isInFlight ? currentX : endX}
                                        y2={isInFlight ? currentY : endY}
                                        stroke={color}
                                        strokeWidth={0.15}
                                        opacity={opacity}
                                    />
                                )}
                                {isInFlight && (
                                    <circle
                                        cx={currentX}
                                        cy={currentY}
                                        r={0.3}
                                        fill={color}
                                        opacity={opacity}
                                    />
                                )}
                                {showEndCircle && (
                                    <circle
                                        cx={endX}
                                        cy={endY}
                                        r={circleRadius}
                                        fill={circleColor}
                                        opacity={opacity * 0.8}
                                    />
                                )}
                            </g>
                        );
                    })}

                    {mapType === "duels" && filteredDuels.map((d, i) => {
                        const isTeamKill = d.attacker_this_team === true;

                        // Positions
                        const attackerX = positionTransformX(d.attacker_x ?? d.victim_x, map_name);
                        const attackerY = positionTransformY(d.attacker_y ?? d.victim_y, map_name);
                        const victimX = positionTransformX(d.victim_x, map_name);
                        const victimY = positionTransformY(d.victim_y, map_name);

                        // Determine colors based on whether this was a team kill or death
                        const lineColor = isTeamKill ? "stroke-green-500" : "stroke-red-500";

                        // Team position: attacker for kills, victim for deaths
                        const teamX = isTeamKill ? attackerX : victimX;
                        const teamY = isTeamKill ? attackerY : victimY;

                        const fillColor = isTeamKill ? "fill-green-500" : "fill-red-500";

                        return (
                            <g key={i} className="mix-blend-screen">
                                {showLines && (
                                    <line
                                        x1={attackerX}
                                        y1={attackerY}
                                        x2={victimX}
                                        y2={victimY}
                                        className={`${lineColor} stroke-[0.15] opacity-50`}
                                    />
                                )}

                                {showEndpoints && (
                                    <>
                                        {/* Team position - filled circle */}
                                        <circle
                                            cx={teamX}
                                            cy={teamY}
                                            r={0.4}
                                            className={`${fillColor} opacity-60`}
                                        />
                                    </>
                                )}
                            </g>
                        );
                    })}
                </Map>
            </div>
        </div>
    );
}
