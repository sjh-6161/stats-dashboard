"use client"

import { ColumnDef } from "@tanstack/react-table"
import { PlayerPositionStat } from "@/lib/types"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ACTIVE_DUTY_MAPS, MAP_DISPLAY_NAMES, type ActiveDutyMap } from "@/lib/config/maps"


type color = {
    r: number,
    g: number,
    b: number
}

const map_colors: Record<string, color> = {
    "de_mirage": {r: 234, g: 179, b: 8},
    "de_dust2": {r: 245, g: 158, b: 11},
    "de_nuke": {r: 14, g: 165, b: 233},
    "de_train": {r: 120, g: 113, b: 108},
    "de_ancient": {r: 34, g: 197, b: 94},
    "de_inferno": {r: 239, g: 68, b: 68},
    "de_overpass": {r: 100, g: 116, b: 139},
    "de_anubis": {r: 249, g: 115, b: 22}
}

const getRGB = (
    value: number,
    map_name: string,
): string => {
    return `rgba(${map_colors[map_name].r}, ${map_colors[map_name].g}, ${map_colors[map_name].b}, ${0.9 * value})`
}

// Helper to get a short map name from the full map name (e.g., "de_mirage" -> "mirage")
function getMapShortName(mapName: string): string {
    return mapName.replace('de_', '');
}

// Generate columns dynamically based on active duty maps
function generateColumns(): ColumnDef<PlayerPositionStat>[] {
    const columns: ColumnDef<PlayerPositionStat>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Player
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="font-medium p-1 pl-3">{row.getValue("name")}</div>
        }
    ];

    // Add columns for each active duty map (A, Mid, B)
    for (const map of ACTIVE_DUTY_MAPS) {
        const shortName = getMapShortName(map);
        const displayName = MAP_DISPLAY_NAMES[map as ActiveDutyMap];

        // Helper to check if player has data for this map (at least one non-zero value)
        const hasMapData = (row: { getValue: (key: string) => unknown }) => {
            const a = row.getValue(`${shortName}_a`) as number;
            const mid = row.getValue(`${shortName}_mid`) as number;
            const b = row.getValue(`${shortName}_b`) as number;
            return a !== 0 || mid !== 0 || b !== 0;
        };

        // A column
        columns.push({
            accessorKey: `${shortName}_a`,
            header: () => <div className="text-center text-xs">{displayName}<br/>A</div>,
            cell: ({ row }) => {
                if (!hasMapData(row)) return <div className="text-center p-1"></div>;
                const value = row.getValue(`${shortName}_a`) as number;
                return <div className="text-center p-1" style={{backgroundColor: getRGB(value, map)}}>{value.toFixed(2)}</div>
            }
        });

        // Mid column
        columns.push({
            accessorKey: `${shortName}_mid`,
            header: () => <div className="text-center text-xs">{displayName}<br/>Mid</div>,
            cell: ({ row }) => {
                if (!hasMapData(row)) return <div className="text-center p-1"></div>;
                const value = row.getValue(`${shortName}_mid`) as number;
                return <div className="text-center p-1" style={{backgroundColor: getRGB(value, map)}}>{value.toFixed(2)}</div>
            }
        });

        // B column
        columns.push({
            accessorKey: `${shortName}_b`,
            header: () => <div className="text-center text-xs">{displayName}<br/>B</div>,
            cell: ({ row }) => {
                if (!hasMapData(row)) return <div className="text-center p-1"></div>;
                const value = row.getValue(`${shortName}_b`) as number;
                return <div className="text-center p-1" style={{backgroundColor: getRGB(value, map)}}>{value.toFixed(2)}</div>
            }
        });
    }

    return columns;
}

export const columns = generateColumns();
