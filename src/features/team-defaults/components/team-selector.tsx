"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { Team } from "@/lib/types"

type TeamSelectorProps = {
    teams: Team[]
    currentTeam?: string
    onTeamChange: (teamName: string) => void
}

export default function TeamSelector({ teams, currentTeam, onTeamChange }: TeamSelectorProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Team:</span>
            <Select value={currentTeam} onValueChange={onTeamChange}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                    {teams.map((team) => (
                        <SelectItem key={team.id} value={team.name}>
                            {team.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
