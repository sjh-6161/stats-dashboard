"use client"

import { useState } from "react";
import TeamDefaultsSection from "./team-defaults-section";
import TeamMapSection from "./team-map-section";
import { TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import type { MapPlant, MapKill, TeamDefault } from "@/lib/types";

type MapStats = {
    maps_won: number;
    maps_tied: number;
    maps_lost: number;
    rounds_won: number;
    rounds_lost: number;
    pistol_won: number;
    pistol_lost: number;
    eco_won: number;
    eco_lost: number;
    gun_won: number;
    gun_lost: number;
};

type TeamContentSectionProps = {
    map_name: string;
    map_names: string[];
    map_nice_names: Record<string, string>;
    map_color: string;
    mapStats: MapStats;
    pistol_defaults: TeamDefault[];
    eco_defaults: TeamDefault[];
    buy_defaults: TeamDefault[];
    plants: MapPlant[];
    duels: MapKill[];
};

function formatRWP(won: number, total: number): string {
    if (total === 0) return "N/A";
    return ((won / total) * 100).toFixed(1) + "%";
}

export default function TeamContentSection({
    map_name,
    map_names,
    map_nice_names,
    map_color,
    mapStats,
    pistol_defaults,
    eco_defaults,
    buy_defaults,
    plants,
    duels
}: TeamContentSectionProps) {
    const [side, setSide] = useState<"CT" | "TERRORIST">("CT");

    return (
        <>
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <TabsList>
                        {map_names.map(mn => (
                            <TabsTrigger value={mn} key={mn}>{map_nice_names[mn]}</TabsTrigger>
                        ))}
                    </TabsList>
                    <Tabs value={side} onValueChange={(v) => setSide(v as "CT" | "TERRORIST")}>
                        <TabsList>
                            <TabsTrigger value="CT">CT</TabsTrigger>
                            <TabsTrigger value="TERRORIST">T</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <div className="flex gap-2">
                    <div className={`items-center px-3 py-1 rounded shadow-sm flex flex-row ${map_color}`}>
                        <div className="text-sm text-gray-500 mr-3">Record</div>
                        <div className="text-lg font-medium mr-10 w-18">
                            {mapStats.maps_won}
                            {mapStats.maps_tied > 0 && `-${mapStats.maps_tied}`}-{mapStats.maps_lost}
                        </div>
                        <div className="text-sm text-gray-500 mr-3">RWP</div>
                        <div className="text-lg font-medium mr-10 w-12">
                            {formatRWP(mapStats.rounds_won, mapStats.rounds_won + mapStats.rounds_lost)}
                        </div>
                        <div className="text-sm text-gray-500 mr-3">Pistol</div>
                        <div className="text-lg font-medium mr-10 w-12">
                            {formatRWP(mapStats.pistol_won, mapStats.pistol_won + mapStats.pistol_lost)}
                        </div>
                        <div className="text-sm text-gray-500 mr-3">Eco</div>
                        <div className="text-lg font-medium mr-10 w-12">
                            {formatRWP(mapStats.eco_won, mapStats.eco_won + mapStats.eco_lost)}
                        </div>
                        <div className="text-sm text-gray-500 mr-3">Buy v Buy</div>
                        <div className="text-lg font-medium mr-10 w-12">
                            {formatRWP(mapStats.gun_won, mapStats.gun_won + mapStats.gun_lost)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-5">
                <div>
                    <TeamDefaultsSection
                        map_name={map_name}
                        pistol_defaults={pistol_defaults}
                        eco_defaults={eco_defaults}
                        buy_defaults={buy_defaults}
                        side={side}
                    />
                </div>
                <div className="col-span-2">
                    <TeamMapSection
                        map_name={map_name}
                        side={side}
                        plants={plants}
                        duels={duels}
                    />
                </div>
            </div>
        </>
    );
}
