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
    const [data, setData] = useState<TeamTStat[] | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchTSideStats(tournament).then((result) => {
            setData(result)
            setLoading(false)
        })
    }, [tournament])

    return (
        <div className="flex flex-col gap-4 h-full">
            <TournamentSelector tournaments={tournaments} value={tournament} onValueChange={setTournament} />
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
