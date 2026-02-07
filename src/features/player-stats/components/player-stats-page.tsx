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
    const [data, setData] = useState<KDStat[] | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchPlayerStats(tournament).then((result) => {
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
                    <KDTable data={data} />
                    <KDChart data={data} />
                </div>
            )}
        </div>
    )
}
