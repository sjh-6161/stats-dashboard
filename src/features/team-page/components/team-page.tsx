"use client"

import { useState, useEffect } from "react"
import TeamSelector from "@/features/team-defaults/components/team-selector"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { TournamentSelector } from "@/components/ui/tournament-selector"
import TeamContentSection from "./team-content-section"
import { fetchTeamPageData } from "@/lib/actions"
import { Spinner } from "@/components/ui/spinner"
import type { Team, TeamDefault, MapKill, MapPlant, MapGrenade, TeamPlayerPosition } from "@/lib/types"
import type { TeamRoundStats } from "@/lib/services"

const map_colors: Record<string, string> = {
    "de_mirage": "bg-yellow-50",
    "de_dust2": "bg-amber-50",
    "de_nuke": "bg-sky-50",
    "de_train": "bg-stone-50",
    "de_ancient": "bg-green-50",
    "de_inferno": "bg-red-50",
    "de_overpass": "bg-slate-100",
    "de_anubis": "bg-orange-50"
}

const map_nice_names: Record<string, string> = {
    "de_mirage": "Mirage",
    "de_dust2": "Dust 2",
    "de_nuke": "Nuke",
    "de_train": "Train",
    "de_ancient": "Ancient",
    "de_inferno": "Inferno",
    "de_overpass": "Overpass",
    "de_anubis": "Anubis"
}

type TeamPageProps = {
    tournaments: string[];
};

type TeamData = {
    teams: Team[];
    roundStats: TeamRoundStats[];
    buy_defaults: TeamDefault[];
    eco_defaults: TeamDefault[];
    pistol_defaults: TeamDefault[];
    plants: MapPlant[];
    duels: MapKill[];
    grenades: MapGrenade[];
    playerPositions: TeamPlayerPosition[];
};

function formatRWP(won: number, total: number): string {
    if (total === 0) return "N/A";
    return ((won / total) * 100).toFixed(1) + "%";
}

export default function TeamPage({ tournaments }: TeamPageProps) {
    const [tournament, setTournament] = useState(tournaments[0] || '')
    const [season, setSeason] = useState<number | null>(null)
    const [stage, setStage] = useState<string>('')
    const [team, setTeam] = useState<string | undefined>(undefined)
    const [data, setData] = useState<TeamData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!tournament || season === null || !stage) return
        setLoading(true)
        fetchTeamPageData(tournament, season, stage, team).then((result) => {
            setData(result)
            setLoading(false)
        })
    }, [tournament, season, stage, team])

    const handleTournamentChange = (t: string) => {
        setTournament(t)
        setSeason(null)
        setStage('')
    }

    const handleSeasonChange = (s: number) => {
        setSeason(s)
        setStage('')
    }

    const overallStats = data?.roundStats?.find(s => s.map === null);
    const map_names = data ? [...new Set(data.roundStats.map(obj => obj.map).filter((m): m is string => m !== null))] : [];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
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
                    {data && <TeamSelector teams={data.teams} currentTeam={team} onTeamChange={setTeam} />}
                </div>
                {overallStats && (
                    <div className="flex gap-2">
                        <div className={`items-center px-3 py-1 rounded shadow-sm flex flex-row`}>
                        <div className="text-sm text-gray-500 mr-3">Record</div>
                        <div className="text-lg font-medium mr-10 w-18">
                            {overallStats.maps_won}
                            {overallStats.maps_tied > 0 && `-${overallStats.maps_tied}`}-{overallStats.maps_lost}
                        </div>
                        <div className="text-sm text-gray-500 mr-3">RWP</div>
                        <div className="text-lg font-medium mr-10 w-12">
                            {formatRWP(overallStats.rounds_won, overallStats.rounds_won + overallStats.rounds_lost)}
                        </div>
                        <div className="text-sm text-gray-500 mr-3">Pistol</div>
                        <div className="text-lg font-medium mr-10 w-12">
                            {formatRWP(overallStats.pistol_won, overallStats.pistol_won + overallStats.pistol_lost)}
                        </div>
                        <div className="text-sm text-gray-500 mr-3">Eco</div>
                        <div className="text-lg font-medium mr-10 w-12">
                            {formatRWP(overallStats.eco_won, overallStats.eco_won + overallStats.eco_lost)}
                        </div>
                        <div className="text-sm text-gray-500 mr-3">Buy v Buy</div>
                        <div className="text-lg font-medium mr-10 w-12">
                            {formatRWP(overallStats.gun_won, overallStats.gun_won + overallStats.gun_lost)}
                        </div>
                    </div>
                    </div>
                )}
            </div>

            {loading || !data ? (
                <div className="flex items-center justify-center p-4">
                    <Spinner className="size-8" />
                </div>
            ) : overallStats && (
                <div>
                    <Tabs defaultValue={map_names[0] || ""}>
                        {map_names.map(map_name => {
                            const mapStats = data.roundStats.find(s => s.map === map_name);
                            if (!mapStats) return null;
                            return (
                                <TabsContent value={map_name} key={map_name} className="mt-0">
                                    <TeamContentSection
                                        map_name={map_name}
                                        map_names={map_names}
                                        map_nice_names={map_nice_names}
                                        map_color={map_colors[map_name]}
                                        mapStats={mapStats}
                                        pistol_defaults={data.pistol_defaults}
                                        eco_defaults={data.eco_defaults}
                                        buy_defaults={data.buy_defaults}
                                        plants={data.plants}
                                        duels={data.duels}
                                        grenades={data.grenades}
                                        playerPositions={data.playerPositions}
                                    />
                                </TabsContent>
                            );
                        })}
                    </Tabs>
                </div>
            )}
        </div>
    );
}
