"use client"

import { useState, useEffect } from "react"
import { columns } from "./columns"
import { PlayerPositionTable } from "./player-position-table"
import { fetchPlayerPositionData } from "@/lib/actions"
import { Spinner } from "@/components/ui/spinner"
import type { PlayerPositionStat, Team } from "@/lib/types"

type PlayerPositionPageProps = {
    tournaments: string[];
};

type PositionData = {
    teams: Team[];
    ctStats: PlayerPositionStat[];
    tStats: PlayerPositionStat[];
};

export default function PlayerPositionPage({ tournaments }: PlayerPositionPageProps) {
    const [tournament, setTournament] = useState(tournaments[0] || '')
    const [team, setTeam] = useState<string | undefined>(undefined)
    const [data, setData] = useState<PositionData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchPlayerPositionData(tournament, team).then((result) => {
            setData(result)
            setLoading(false)
        })
    }, [tournament, team])

    const handleTeamChange = (teamName: string) => {
        setTeam(teamName === "all" ? undefined : teamName)
    }

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center p-4">
                <Spinner className="size-8" />
            </div>
        )
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Player Position Stats</h2>
            <p className="text-sm text-muted-foreground mb-4">
                Proportion of rounds each player defaulted to A, Mid, or B on each map (rounded to 2 decimal places)
            </p>
            <PlayerPositionTable
                columns={columns}
                ctData={data.ctStats}
                tData={data.tStats}
                teams={data.teams}
                currentTeam={team}
                tournaments={tournaments}
                selectedTournament={tournament}
                onTournamentChange={setTournament}
                onTeamChange={handleTeamChange}
            />
        </div>
    )
}
