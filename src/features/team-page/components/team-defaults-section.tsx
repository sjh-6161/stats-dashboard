"use client"

import { useState } from "react";
import { columns } from "@/features/team-defaults/components/columns";
import { DataTable } from "@/components/data-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TeamDefault } from "@/lib/types";

type TeamDefaultsSectionProps = {
    map_name: string;
    pistol_defaults: TeamDefault[];
    eco_defaults: TeamDefault[];
    buy_defaults: TeamDefault[];
    side: "CT" | "TERRORIST";
};

type DefaultType = "all" | "pistol" | "eco" | "buy";

export default function TeamDefaultsSection({
    map_name,
    pistol_defaults,
    eco_defaults,
    buy_defaults,
    side
}: TeamDefaultsSectionProps) {
    const [defaultType, setDefaultType] = useState<DefaultType>("all");

    const sideColor = side === "CT" ? "bg-blue-50" : "bg-amber-50";

    const getDefaultsData = () => {
        if (defaultType === "all") {
            const allData = [...pistol_defaults, ...eco_defaults, ...buy_defaults]
                .filter(row => row.map_name === map_name && row.side === side);

            // Aggregate by setup (num_a, num_mid, num_b)
            const aggregated = new Map<string, typeof allData[0]>();
            for (const row of allData) {
                const key = `${row.num_a}-${row.num_mid}-${row.num_b}`;
                const existing = aggregated.get(key);
                if (existing) {
                    const existingRounds = Number(existing.rounds) || 0;
                    const rowRounds = Number(row.rounds) || 0;
                    const totalRounds = existingRounds + rowRounds;
                    aggregated.set(key, {
                        ...existing,
                        rounds: totalRounds,
                        ct_win: (Number(existing.ct_win) || 0) + (Number(row.ct_win) || 0),
                        num_plants: (Number(existing.num_plants) || 0) + (Number(row.num_plants) || 0),
                        avg_plant_time: totalRounds > 0
                            ? ((Number(existing.avg_plant_time) || 0) * existingRounds + (Number(row.avg_plant_time) || 0) * rowRounds) / totalRounds
                            : 0,
                    });
                } else {
                    aggregated.set(key, {
                        ...row,
                        rounds: Number(row.rounds) || 0,
                        ct_win: Number(row.ct_win) || 0,
                        num_plants: Number(row.num_plants) || 0,
                        avg_plant_time: Number(row.avg_plant_time) || 0,
                    });
                }
            }
            return Array.from(aggregated.values()).sort((a, b) => Number(b.rounds) - Number(a.rounds));
        }
        const dataSource = defaultType === "pistol" ? pistol_defaults
            : defaultType === "eco" ? eco_defaults
            : buy_defaults;
        return dataSource.filter(row => row.map_name === map_name && row.side === side);
    };

    return (
        <div>
            <div className="text-lg font-medium mb-2">Defaults</div>
            <div className="flex gap-2 mb-3">
                <Tabs value={defaultType} onValueChange={(v) => setDefaultType(v as DefaultType)}>
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="pistol">Pistol</TabsTrigger>
                        <TabsTrigger value="eco">Eco</TabsTrigger>
                        <TabsTrigger value="buy">Buy</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className={`${sideColor} overflow-hidden rounded-md`}>
                <DataTable
                    columns={columns}
                    data={getDefaultsData()}
                />
            </div>
        </div>
    );
}
