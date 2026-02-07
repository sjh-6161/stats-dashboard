"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type TournamentSelectorProps = {
    tournaments: string[]
    value: string
    onValueChange: (tournament: string) => void
}

export function TournamentSelector({ tournaments, value, onValueChange }: TournamentSelectorProps) {
    if (tournaments.length === 0) return null

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-700">Tournament:</span>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select tournament" />
                </SelectTrigger>
                <SelectContent>
                    {tournaments.map((tournament) => (
                        <SelectItem key={tournament} value={tournament}>
                            {tournament}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
