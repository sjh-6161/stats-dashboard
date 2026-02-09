"use client"

import { useState, useEffect } from "react"
import KDTable from "./player-stats-table"
import { KDChart } from "./player-stats-chart"
import { fetchPlayerStats } from "@/lib/actions"
import { TournamentSelector } from "@/components/ui/tournament-selector"
import { Spinner } from "@/components/ui/spinner"
import type { KDStat } from "@/lib/types"

type PlayerStatsPageProps = {
    tournaments: string[];
};

export default function PlayerStatsPage({ tournaments }: PlayerStatsPageProps) {
    const [tournament, setTournament] = useState(tournaments[0] || '')
    const [season, setSeason] = useState<number | null>(null)
    const [stage, setStage] = useState<string>('')
    const [data, setData] = useState<KDStat[] | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!tournament || season === null || !stage) return
        setLoading(true)
        fetchPlayerStats(tournament, season, stage).then((result) => {
            setData(result)
            setLoading(false)
        })
    }, [tournament, season, stage])

    const handleTournamentChange = (t: string) => {
        setTournament(t)
        setSeason(null)
        setStage('')
    }

    const handleSeasonChange = (s: number) => {
        setSeason(s)
        setStage('')
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            <TournamentSelector
                tournaments={tournaments}
                tournament={tournament}
                season={season}
                stage={stage}
                onTournamentChange={handleTournamentChange}
                onSeasonChange={handleSeasonChange}
                onStageChange={setStage}
                onSeasonsLoaded={(_seasons, first) => setSeason(first)}
                onStagesLoaded={(_stages, first) => setStage(first)}
            />
            {loading || !data ? (
                <div className="flex items-center justify-center flex-1">
                    <Spinner className="size-8" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 flex-1">
                    <KDTable data={data} />
                    <KDChart data={data} />
                </div>
            )}
        </div>
    )
}
