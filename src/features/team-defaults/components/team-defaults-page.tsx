import { getTeamBuyDefaults, getTeamPistolDefaults, getTeams } from "@/lib/services";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TeamSelector from "./team-selector";

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
    tournament: string;
    team?: string;
};

export default async function TeamDefaultsPage({ tournament, team }: TeamDefaultsPageProps) {
    const teams = await getTeams();
    const selected_team = team || "all";
    const team_name_for_query = selected_team === "all" ? null : selected_team;

    const buy_defaults = await getTeamBuyDefaults(team_name_for_query, 20000, 500000, tournament);
    const eco_defaults = await getTeamBuyDefaults(team_name_for_query, 0, 10000, tournament);
    const pistol_defaults = await getTeamPistolDefaults(team_name_for_query, tournament)

    const map_names: string[] = [...new Set(buy_defaults.map(obj => obj.map_name))];

    return (
        <div>
            <TeamSelector teams={teams} currentTeam={selected_team} />
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
                                        <DataTable columns={columns} data={pistol_defaults.filter(row => row.map_name == map_name && row.side == "CT")} />
                                    </div>
                                    <div className="text-2xl mb-4 bg-amber-50 overflow-hidden rounded-md">
                                        <DataTable columns={columns} data={pistol_defaults.filter(row => row.map_name == map_name && row.side == "TERRORIST")} />
                                    </div>
                                </div>
                                <div className='container mx-auto'>
                                    <div className="text-2xl mb-4">Eco Defaults</div>
                                    <div className="text-2xl mb-4 bg-blue-50 overflow-hidden rounded-md">
                                        <DataTable columns={columns} data={eco_defaults.filter(row => row.map_name == map_name && row.side == "CT")} />
                                    </div>
                                    <div className="text-2xl mb-4 bg-amber-50 overflow-hidden rounded-md">
                                        <DataTable columns={columns} data={eco_defaults.filter(row => row.map_name == map_name && row.side == "TERRORIST")} />
                                    </div>
                                </div>
                                <div className='container mx-auto'>
                                    <div className="text-2xl mb-4">Full Buy Defaults</div>
                                    <div className="text-2xl mb-4 bg-blue-50 overflow-hidden rounded-md">
                                        <DataTable columns={columns} data={buy_defaults.filter(row => row.map_name == map_name && row.side == "CT")} />
                                    </div>
                                    <div className="text-2xl mb-4 bg-amber-50 overflow-hidden rounded-md">
                                        <DataTable columns={columns} data={buy_defaults.filter(row => row.map_name == map_name && row.side == "TERRORIST")} />
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