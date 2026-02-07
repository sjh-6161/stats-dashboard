"use client"

import { useState, useEffect } from "react"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TeamSelector from "./team-selector"
import { TournamentSelector } from "@/components/ui/tournament-selector"
import { fetchTeamDefaultsData } from "@/lib/actions"
import { Spinner } from "@/components/ui/spinner"
import type { Team, TeamDefault } from "@/lib/types"

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

type TeamDefaultsPageProps = {
    tournaments: string[];
};

type DefaultsData = {
    teams: Team[];
    buy_defaults: TeamDefault[];
    eco_defaults: TeamDefault[];
    pistol_defaults: TeamDefault[];
};

export default function TeamDefaultsPage({ tournaments }: TeamDefaultsPageProps) {
    const [tournament, setTournament] = useState(tournaments[0] || '')
    const [team, setTeam] = useState<string | undefined>(undefined)
    const [data, setData] = useState<DefaultsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchTeamDefaultsData(tournament, team).then((result) => {
            setData(result)
            setLoading(false)
        })
    }, [tournament, team])

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center p-4">
                <Spinner className="size-8" />
            </div>
        )
    }

    const map_names: string[] = [...new Set(data.buy_defaults.map(obj => obj.map_name))];

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <TournamentSelector tournaments={tournaments} value={tournament} onValueChange={setTournament} />
                <TeamSelector teams={data.teams} currentTeam={team} onTeamChange={setTeam} />
            </div>
            <Tabs defaultValue={map_names[0] || ""}>
                <TabsList>
                {map_names.map(map_name => {
                    return(<TabsTrigger value={map_name} key={map_name}>{map_nice_names[map_name]}</TabsTrigger>)
                })}
            </TabsList>
            {map_names.map(map_name => {
                return (
                    <TabsContent value={map_name} key={map_name}>
                        <div key={map_name} className={`${map_colors[map_name]} p-4 rounded-md my-4 border-1`}>
                            <div className="text-3xl">{map_nice_names[map_name]}</div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 h-full gap-x-4">
                                <div className='container mx-auto'>
                                    <div className="text-2xl mb-4">Pistol Defaults</div>
                                    <div className="text-2xl mb-4 bg-blue-50 overflow-hidden rounded-md">
                                        <DataTable columns={columns} data={data.pistol_defaults.filter(row => row.map_name == map_name && row.side == "CT")} />
                                    </div>
                                    <div className="text-2xl mb-4 bg-amber-50 overflow-hidden rounded-md">
                                        <DataTable columns={columns} data={data.pistol_defaults.filter(row => row.map_name == map_name && row.side == "TERRORIST")} />
                                    </div>
                                </div>
                                <div className='container mx-auto'>
                                    <div className="text-2xl mb-4">Eco Defaults</div>
                                    <div className="text-2xl mb-4 bg-blue-50 overflow-hidden rounded-md">
                                        <DataTable columns={columns} data={data.eco_defaults.filter(row => row.map_name == map_name && row.side == "CT")} />
                                    </div>
                                    <div className="text-2xl mb-4 bg-amber-50 overflow-hidden rounded-md">
                                        <DataTable columns={columns} data={data.eco_defaults.filter(row => row.map_name == map_name && row.side == "TERRORIST")} />
                                    </div>
                                </div>
                                <div className='container mx-auto'>
                                    <div className="text-2xl mb-4">Full Buy Defaults</div>
                                    <div className="text-2xl mb-4 bg-blue-50 overflow-hidden rounded-md">
                                        <DataTable columns={columns} data={data.buy_defaults.filter(row => row.map_name == map_name && row.side == "CT")} />
                                    </div>
                                    <div className="text-2xl mb-4 bg-amber-50 overflow-hidden rounded-md">
                                        <DataTable columns={columns} data={data.buy_defaults.filter(row => row.map_name == map_name && row.side == "TERRORIST")} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                )
            })}
            </Tabs>
        </div>
    )
}
