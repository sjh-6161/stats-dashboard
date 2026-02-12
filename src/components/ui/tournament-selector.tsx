"use client"

import { useState, useEffect, useRef } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { fetchSeasons, fetchStages } from "@/lib/actions"

type TournamentSelectorProps = {
    tournaments: string[]
    tournament: string
    season: number | null
    stage: string
    onTournamentChange: (tournament: string) => void
    onSeasonChange: (season: number) => void
    onStageChange: (stage: string) => void
    onSeasonsLoaded: (seasons: number[], firstSeason: number) => void
    onStagesLoaded: (stages: string[], firstStage: string) => void
}

export function TournamentSelector({
    tournaments,
    tournament,
    season,
    stage,
    onTournamentChange,
    onSeasonChange,
    onStageChange,
    onSeasonsLoaded,
    onStagesLoaded,
}: TournamentSelectorProps) {
    const [seasons, setSeasons] = useState<number[]>([])
    const [stages, setStages] = useState<string[]>([])
    const prevSeasonsRef = useRef<number[]>([])
    const prevStagesRef = useRef<string[]>([])

    useEffect(() => {
        if (!tournament) return
        fetchSeasons(tournament).then((result) => {
            setSeasons(result)
            // Only call onSeasonsLoaded if seasons actually changed
            const seasonsChanged = JSON.stringify(prevSeasonsRef.current) !== JSON.stringify(result)
            if (result.length > 0 && seasonsChanged) {
                prevSeasonsRef.current = result
                onSeasonsLoaded(result, result[result.length - 1])
            }
        })
    }, [tournament, onSeasonsLoaded])

    useEffect(() => {
        if (!tournament || season === null) return
        fetchStages(tournament, season).then((result) => {
            setStages(result)
            // Only call onStagesLoaded if stages actually changed
            const stagesChanged = JSON.stringify(prevStagesRef.current) !== JSON.stringify(result)
            if (result.length > 0 && stagesChanged) {
                prevStagesRef.current = result
                onStagesLoaded(result, result[0])
            }
        })
    }, [tournament, season, onStagesLoaded])

    if (tournaments.length === 0) return null

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-700">Tournament:</span>
                <Select value={tournament} onValueChange={onTournamentChange}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select tournament" />
                    </SelectTrigger>
                    <SelectContent>
                        {tournaments.map((t) => (
                            <SelectItem key={t} value={t}>
                                {t}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {seasons.length > 0 && season !== null && (
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700">Season:</span>
                    <Select value={String(season)} onValueChange={(v) => onSeasonChange(Number(v))}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select season" />
                        </SelectTrigger>
                        <SelectContent>
                            {seasons.map((s) => (
                                <SelectItem key={s} value={String(s)}>
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
            {stages.length > 0 && (
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700">Stage:</span>
                    <Select value={stage} onValueChange={onStageChange}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                            {stages.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    )
}
