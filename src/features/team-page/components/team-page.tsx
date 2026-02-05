import { getTeamRoundStats, getTeamBuyDefaults, getTeamPistolDefaults, getTeams } from "@/lib/services";
import TeamSelector from "@/features/team-defaults/components/team-selector";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TeamLoadingWrapper } from "@/components/ui/team-loading-wrapper";
import TeamContentSection from "./team-content-section";
import { getMapKills, getMapPlants } from "@/lib/services/maps.service";

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
    tournament: string;
    team?: string;
};

function formatRWP(won: number, total: number): string {
    if (total === 0) return "N/A";
    return ((won / total) * 100).toFixed(1) + "%";
}

export default async function TeamPage({ tournament, team }: TeamPageProps) {
    const teams = await getTeams();

    const roundStats = team ? await getTeamRoundStats(team, tournament) : [];

    const buy_defaults = team ? await getTeamBuyDefaults(team, 20000, 500000, tournament) : [];
    const eco_defaults = team ? await getTeamBuyDefaults(team, 0, 10000, tournament) : [];
    const pistol_defaults = team ? await getTeamPistolDefaults(team, tournament) : [];

    const overallStats = roundStats?.find(s => s.map === null);

    const plants = team ? await getMapPlants(team, tournament) : [];
    const duels = team ? await getMapKills(team, tournament) : [];

    const map_names = [...new Set(roundStats.map(obj => obj.map).filter((m): m is string => m !== null))];

    return (
        <TeamLoadingWrapper>
            <div className="flex justify-between items-center">
                <TeamSelector teams={teams} currentTeam={team} />
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

            {overallStats && (
                <div>
                    <Tabs defaultValue={map_names[0] || ""}>
                        {map_names.map(map_name => {
                            const mapStats = roundStats.find(s => s.map === map_name);
                            if (!mapStats) return null;
                            return (
                                <TabsContent value={map_name} key={map_name} className="mt-0">
                                    <TeamContentSection
                                        map_name={map_name}
                                        map_names={map_names}
                                        map_nice_names={map_nice_names}
                                        map_color={map_colors[map_name]}
                                        mapStats={mapStats}
                                        pistol_defaults={pistol_defaults}
                                        eco_defaults={eco_defaults}
                                        buy_defaults={buy_defaults}
                                        plants={plants}
                                        duels={duels}
                                    />
                                </TabsContent>
                            );
                        })}
                    </Tabs>
                </div>
            )}
        </TeamLoadingWrapper>
    );
}