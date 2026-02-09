"use client"

import { useMemo, useState } from "react";
import type { TeamPlayerPosition } from "@/lib/types";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type TeamPlayerPositionsSectionProps = {
    map_name: string;
    side: string;
    playerPositions: TeamPlayerPosition[];
};

const map_colors: Record<string, { r: number, g: number, b: number }> = {
    "de_mirage": { r: 234, g: 179, b: 8 },
    "de_dust2": { r: 245, g: 158, b: 11 },
    "de_nuke": { r: 14, g: 165, b: 233 },
    "de_train": { r: 120, g: 113, b: 108 },
    "de_ancient": { r: 34, g: 197, b: 94 },
    "de_inferno": { r: 239, g: 68, b: 68 },
    "de_overpass": { r: 100, g: 116, b: 139 },
    "de_anubis": { r: 249, g: 115, b: 22 },
};

function getRGB(value: number, map_name: string): string {
    const color = map_colors[map_name];
    if (!color) return "";
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${0.9 * value})`;
}

type SortKey = "a" | "mid" | "b";
type SortDir = "asc" | "desc";

export default function TeamPlayerPositionsSection({
    map_name,
    side,
    playerPositions,
}: TeamPlayerPositionsSectionProps) {
    const [sortKey, setSortKey] = useState<SortKey | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>("asc");

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir(d => d === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    };

    const filteredPositions = useMemo(() => {
        const filtered = playerPositions
            .filter(p => p.map_name === map_name && p.side === side);

        if (sortKey) {
            filtered.sort((a, b) => sortDir === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]);
        } else {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        return filtered;
    }, [playerPositions, map_name, side, sortKey, sortDir]);

    if (filteredPositions.length === 0) return null;

    return (
        <div className="mt-4">
            <div className="text-lg font-medium mb-2">Player Positions</div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Player</TableHead>
                            {(["a", "mid", "b"] as SortKey[]).map(key => (
                                <TableHead key={key} className="text-center p-0">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleSort(key)}
                                        className="h-8"
                                    >
                                        {key === "mid" ? "Mid" : key.toUpperCase()}
                                        <ArrowUpDown className="ml-1 h-3 w-3" />
                                    </Button>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPositions.map(player => (
                            <TableRow key={player.name}>
                                <TableCell className="font-medium p-1 pl-3">{player.name}</TableCell>
                                <TableCell className="text-center p-1" style={{ backgroundColor: getRGB(player.a, map_name) }}>
                                    {player.a.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-center p-1" style={{ backgroundColor: getRGB(player.mid, map_name) }}>
                                    {player.mid.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-center p-1" style={{ backgroundColor: getRGB(player.b, map_name) }}>
                                    {player.b.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
