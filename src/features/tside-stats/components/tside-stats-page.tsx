"use client"

import { useState, useEffect } from "react"
import { TeamTChart } from "./tside-stats-chart"
import TeamTTable from "./tside-stats-table"
import { fetchTSideStats } from "@/lib/actions"
import { TournamentSelector } from "@/components/ui/tournament-selector"
import { Spinner } from "@/components/ui/spinner"
import type { TeamTStat } from "@/lib/types"

type TSideStatsPageProps = {
    tournaments: string[];
};

export default function TSideStatsPage({ tournaments }: TSideStatsPageProps) {
    const [tournament, setTournament] = useState(tournaments[0] || '')
    const [season, setSeason] = useState<number | null>(null)
    const [stage, setStage] = useState<string>('')
    const [data, setData] = useState<TeamTStat[] | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!tournament || season === null || !stage) return
        setLoading(true)
        fetchTSideStats(tournament, season, stage).then((result) => {
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
                    <TeamTTable data={data} />
                    <TeamTChart data={data} />
                </div>
            )}
        </div>
    )
}
