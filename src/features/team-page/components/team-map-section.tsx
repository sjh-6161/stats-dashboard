"use client"

import { Map, positionTransformX, positionTransformY } from "@/components/map-visualization/map"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { MapKill, MapPlant, RoundType, DefaultKey } from "@/lib/types";
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
    defaultType: RoundType;
    selectedDefaults: Set<DefaultKey>;
}

type MapType = "utility" | "duels" | "plants";
type TimingType = "early" | "preplant" | "postplant";
type DuelDisplayMode = "both" | "lines" | "endpoints";

export default function TeamMapSection({
    map_name,
    side,
    plants,
    duels,
    defaultType,
    selectedDefaults
}: TeamMapSectionProps) {
    const [mapType, setMapType] = useState<MapType>("utility");
    const [timingType, setTimingType] = useState<TimingType>("early");
    const [duelDisplayMode, setDuelDisplayMode] = useState<DuelDisplayMode>("both");
    const [timeFilter, setTimeFilter] = useState<number>(60);

    // Helper to check if a duel/plant matches the selected defaults
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
                    case "early":
                        // Kills within the first X seconds of the round
                        return d.time <= timeFilter;
                    case "preplant":
                        // Kills within X seconds before plant
                        if (d.plant_time === null) {
                            // No plant in this round - exclude from pre-plant view
                            return false;
                        }
                        return d.time < d.plant_time && (d.plant_time - d.time) <= timeFilter;
                    case "postplant":
                        // Kills within X seconds after plant
                        if (d.plant_time === null) {
                            return false;
                        }
                        return d.time >= d.plant_time && (d.time - d.plant_time) <= timeFilter;
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

    const getTimingLabel = () => {
        switch (timingType) {
            case "early":
                return `First ${timeFilter}s of round`;
            case "preplant":
                return `Within ${timeFilter}s before plant`;
            case "postplant":
                return `Within ${timeFilter}s after plant`;
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
                <Tabs value={timingType} onValueChange={(v) => setTimingType(v as TimingType)} className="mb-3">
                    <TabsList>
                        <TabsTrigger value="early">Early Round</TabsTrigger>
                        <TabsTrigger value="preplant">Pre-Plant</TabsTrigger>
                        <TabsTrigger value="postplant">Post-Plant</TabsTrigger>
                    </TabsList>
                </Tabs>

                {mapType === "duels" && (
                    <>
                        <Tabs value={duelDisplayMode} onValueChange={(v) => setDuelDisplayMode(v as DuelDisplayMode)} className="mb-3">
                            <TabsList>
                                <TabsTrigger value="both">Lines + Points</TabsTrigger>
                                <TabsTrigger value="lines">Lines Only</TabsTrigger>
                                <TabsTrigger value="endpoints">Points Only</TabsTrigger>
                            </TabsList>
                        </Tabs>

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
                            className={`${SiteColors[p.site]} opacity-40`}
                            rx={0.2} ry={0.2}
                        />
                    ))}

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
                                        className={`${lineColor} stroke-[0.15] opacity-30`}
                                    />
                                )}

                                {showEndpoints && (
                                    <>
                                        {/* Team position - filled circle */}
                                        <circle
                                            cx={teamX}
                                            cy={teamY}
                                            r={0.4}
                                            className={`${fillColor} opacity-40`}
                                        />

                                        {/* Opponent position - hollow circle (ring) */}
                                        {/* <circle
                                            cx={opponentX}
                                            cy={opponentY}
                                            r={0.35}
                                            className={`${strokeColor} stroke-[0.1] fill-none opacity-25`}
                                        /> */}
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