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
};

type DefaultType = "pistol" | "eco" | "buy";

export default function TeamDefaultsSection({
    map_name,
    pistol_defaults,
    eco_defaults,
    buy_defaults
}: TeamDefaultsSectionProps) {
    const [side, setSide] = useState<"CT" | "TERRORIST">("CT");
    const [defaultType, setDefaultType] = useState<DefaultType>("pistol");

    const sideColor = side === "CT" ? "bg-blue-50" : "bg-amber-50";

    const getDefaultsData = () => {
        const dataSource = defaultType === "pistol" ? pistol_defaults
            : defaultType === "eco" ? eco_defaults
            : buy_defaults;
        return dataSource.filter(row => row.map_name === map_name && row.side === side);
    };

    return (
        <div>
            <div className="text-lg font-medium mb-2">Defaults</div>
            <div className="flex gap-2 mb-3">
                <Tabs value={side} onValueChange={(v) => setSide(v as "CT" | "TERRORIST")}>
                    <TabsList>
                        <TabsTrigger value="CT">CT</TabsTrigger>
                        <TabsTrigger value="TERRORIST">T</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Tabs value={defaultType} onValueChange={(v) => setDefaultType(v as DefaultType)}>
                    <TabsList>
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
