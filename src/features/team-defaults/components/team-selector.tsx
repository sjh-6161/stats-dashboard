"use client"

import { useRouter, useSearchParams } from "next/navigation"
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
}

export default function TeamSelector({ teams, currentTeam }: TeamSelectorProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleTeamChange = (teamName: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("team", teamName)
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium">Team:</span>
            <Select value={currentTeam} onValueChange={handleTeamChange}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a team" />
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
