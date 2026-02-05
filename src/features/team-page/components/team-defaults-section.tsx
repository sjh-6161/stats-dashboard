"use client"

import { useMemo } from "react";
import { columns } from "@/features/team-defaults/components/columns";
import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { TeamDefault, RoundType, DefaultKey } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";

type TeamDefaultsSectionProps = {
    map_name: string;
    pistol_defaults: TeamDefault[];
    eco_defaults: TeamDefault[];
    buy_defaults: TeamDefault[];
    side: "CT" | "TERRORIST";
    defaultType: RoundType;
    selectedDefaults: Set<DefaultKey>;
    onSelectionChange: (selection: Set<DefaultKey>) => void;
};

type TeamDefaultWithKey = TeamDefault & {
    key: DefaultKey;
    roundType: 'pistol' | 'eco' | 'buy';
};

export default function TeamDefaultsSection({
    map_name,
    pistol_defaults,
    eco_defaults,
    buy_defaults,
    side,
    defaultType,
    selectedDefaults,
    onSelectionChange
}: TeamDefaultsSectionProps) {
    const sideColor = side === "CT" ? "bg-blue-50" : "bg-amber-50";

    const getDefaultsData = useMemo((): TeamDefaultWithKey[] => {
        const addKeyToDefaults = (defaults: TeamDefault[], roundType: 'pistol' | 'eco' | 'buy'): TeamDefaultWithKey[] => {
            return defaults
                .filter(row => row.map_name === map_name && row.side === side)
                .map(row => ({
                    ...row,
                    key: `${row.num_a}-${row.num_mid}-${row.num_b}-${roundType}` as DefaultKey,
                    roundType
                }));
        };

        if (defaultType === "all") {
            const pistolData = addKeyToDefaults(pistol_defaults, 'pistol');
            const ecoData = addKeyToDefaults(eco_defaults, 'eco');
            const buyData = addKeyToDefaults(buy_defaults, 'buy');
            const allData = [...pistolData, ...ecoData, ...buyData];

            // Aggregate by setup (num_a, num_mid, num_b) - but keep individual keys for selection
            const aggregated = new Map<string, TeamDefaultWithKey>();
            for (const row of allData) {
                const setupKey = `${row.num_a}-${row.num_mid}-${row.num_b}`;
                const existing = aggregated.get(setupKey);
                if (existing) {
                    const existingRounds = Number(existing.rounds) || 0;
                    const rowRounds = Number(row.rounds) || 0;
                    const totalRounds = existingRounds + rowRounds;
                    aggregated.set(setupKey, {
                        ...existing,
                        rounds: totalRounds,
                        ct_win: (Number(existing.ct_win) || 0) + (Number(row.ct_win) || 0),
                        num_plants: (Number(existing.num_plants) || 0) + (Number(row.num_plants) || 0),
                        avg_plant_time: totalRounds > 0
                            ? ((Number(existing.avg_plant_time) || 0) * existingRounds + (Number(row.avg_plant_time) || 0) * rowRounds) / totalRounds
                            : 0,
                        // For aggregated "all" view, use a composite key
                        key: `${row.num_a}-${row.num_mid}-${row.num_b}-all` as DefaultKey,
                        roundType: 'buy' // Placeholder, not used for filtering in "all" mode
                    });
                } else {
                    aggregated.set(setupKey, {
                        ...row,
                        rounds: Number(row.rounds) || 0,
                        ct_win: Number(row.ct_win) || 0,
                        num_plants: Number(row.num_plants) || 0,
                        avg_plant_time: Number(row.avg_plant_time) || 0,
                        key: `${row.num_a}-${row.num_mid}-${row.num_b}-all` as DefaultKey,
                        roundType: 'buy'
                    });
                }
            }
            return Array.from(aggregated.values()).sort((a, b) => Number(b.rounds) - Number(a.rounds));
        }

        const dataSource = defaultType === "pistol" ? pistol_defaults
            : defaultType === "eco" ? eco_defaults
            : buy_defaults;

        return addKeyToDefaults(dataSource, defaultType as 'pistol' | 'eco' | 'buy')
            .sort((a, b) => Number(b.rounds) - Number(a.rounds));
    }, [map_name, side, defaultType, pistol_defaults, eco_defaults, buy_defaults]);

    const toggleSelection = (key: DefaultKey) => {
        const newSelection = new Set(selectedDefaults);
        if (newSelection.has(key)) {
            newSelection.delete(key);
        } else {
            newSelection.add(key);
        }
        onSelectionChange(newSelection);
    };

    const toggleSelectAll = () => {
        const allKeys = getDefaultsData.map(d => d.key);
        const allSelected = allKeys.every(key => selectedDefaults.has(key));

        if (allSelected) {
            // Deselect all
            const newSelection = new Set(selectedDefaults);
            allKeys.forEach(key => newSelection.delete(key));
            onSelectionChange(newSelection);
        } else {
            // Select all
            const newSelection = new Set(selectedDefaults);
            allKeys.forEach(key => newSelection.add(key));
            onSelectionChange(newSelection);
        }
    };

    const allSelected = getDefaultsData.length > 0 && getDefaultsData.every(d => selectedDefaults.has(d.key));
    const someSelected = getDefaultsData.some(d => selectedDefaults.has(d.key)) && !allSelected;

    // Create columns with checkbox
    const columnsWithCheckbox: ColumnDef<TeamDefaultWithKey>[] = [
        {
            id: "select",
            header: () => (
                <Checkbox
                    checked={allSelected}
                    ref={(el) => {
                        if (el) {
                            (el as HTMLButtonElement).dataset.state = someSelected ? "indeterminate" : allSelected ? "checked" : "unchecked";
                        }
                    }}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                    className=""
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedDefaults.has(row.original.key)}
                    onCheckedChange={() => toggleSelection(row.original.key)}
                    aria-label="Select row"
                    className="ml-2"
                />
            ),
            size: 40,
        },
        ...(columns as ColumnDef<TeamDefaultWithKey>[])
    ];

    return (
        <div>
            <div className="text-lg font-medium mb-2">Defaults</div>
            <div className={`${sideColor} overflow-hidden rounded-md`}>
                <DataTable
                    columns={columnsWithCheckbox}
                    data={getDefaultsData}
                />
            </div>
        </div>
    );
}
