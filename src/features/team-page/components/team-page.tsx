import { getTeamRoundStats, getTeamBuyDefaults, getTeamPistolDefaults, getTeams } from "@/lib/services";
import TeamSelector from "@/features/team-defaults/components/team-selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamDefaultsSection from "./team-defaults-section";
import { TeamLoadingWrapper } from "@/components/ui/team-loading-wrapper";

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

    const roundStats = team
        ? await getTeamRoundStats(team, tournament) : [];

    const buy_defaults = team
        ? await getTeamBuyDefaults(team, 20000, 500000, tournament) : [];
    const eco_defaults = team
        ? await getTeamBuyDefaults(team, 0, 10000, tournament) : [];
    const pistol_defaults = team
        ? await getTeamPistolDefaults(team, tournament) : [];

    const overallStats = roundStats?.find(s => s.map === null);

    const map_names = [...new Set(roundStats.map(obj => obj.map).filter((m): m is string => m !== null))];

    return (
        <TeamLoadingWrapper>
            <div className="flex justify-between items-center mb-4">
                <TeamSelector teams={teams} currentTeam={team} />
                {overallStats && (
                    <div className="flex gap-2">
                        <div className="items-center px-3 py-1 bg-white rounded shadow-sm flex flex-row w-48">
                            <div className="text-sm text-gray-500 mr-3">Record</div>
                            <div className="text-lg font-medium">
                                {overallStats.maps_won}
                                {overallStats.maps_tied > 0 && `-${overallStats.maps_tied}`}-{overallStats.maps_lost}
                            </div>
                        </div>
                        <div className="items-center px-3 py-1 bg-white rounded shadow-sm flex flex-row w-48">
                            <div className="text-sm text-gray-500 mr-3">RWP</div>
                            <div className="text-lg font-medium">
                                {formatRWP(overallStats.rounds_won, overallStats.rounds_won + overallStats.rounds_lost)}
                            </div>
                        </div>
                        <div className="items-center px-3 py-1 bg-white rounded shadow-sm flex flex-row w-48">
                            <div className="text-sm text-gray-500 mr-3">Pistol</div>
                            <div className="text-lg font-medium">
                                {formatRWP(overallStats.pistol_won, overallStats.pistol_won + overallStats.pistol_lost)}
                            </div>
                        </div>
                        <div className="items-center px-3 py-1 bg-white rounded shadow-sm flex flex-row w-48">
                            <div className="text-sm text-gray-500 mr-3">Eco</div>
                            <div className="text-lg font-medium">
                                {formatRWP(overallStats.eco_won, overallStats.eco_won + overallStats.eco_lost)}
                            </div>
                        </div>
                        <div className="items-center px-3 py-1 bg-white rounded shadow-sm flex flex-row w-48">
                            <div className="text-sm text-gray-500 mr-3">Buy v Buy</div>
                            <div className="text-lg font-medium">
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
                                    <div className="flex justify-between items-center">
                                        <TabsList>
                                            {map_names.map(mn => (
                                                <TabsTrigger value={mn} key={mn}>{map_nice_names[mn]}</TabsTrigger>
                                            ))}
                                        </TabsList>
                                        <div className="flex gap-2">
                                            <div className={`items-center px-3 py-1 rounded shadow-sm flex flex-row ${map_colors[map_name]} w-48`}>
                                                <div className="text-sm text-gray-500 mr-3">Record</div>
                                                <div className="text-lg font-medium">
                                                    {mapStats.maps_won}
                                                    {mapStats.maps_tied > 0 && `-${mapStats.maps_tied}`}-{mapStats.maps_lost}
                                                </div>
                                            </div>
                                            <div className={`items-center px-3 py-1 rounded shadow-sm flex flex-row ${map_colors[map_name]} w-48`}>
                                                <div className="text-sm text-gray-500 mr-3">RWP</div>
                                                <div className="text-lg font-medium">
                                                    {formatRWP(mapStats.rounds_won, mapStats.rounds_won + mapStats.rounds_lost)}
                                                </div>
                                            </div>
                                            <div className={`items-center px-3 py-1 rounded shadow-sm flex flex-row ${map_colors[map_name]} w-48`}>
                                                <div className="text-sm text-gray-500 mr-3">Pistol</div>
                                                <div className="text-lg font-medium">
                                                    {formatRWP(mapStats.pistol_won, mapStats.pistol_won + mapStats.pistol_lost)}
                                                </div>
                                            </div>
                                            <div className={`items-center px-3 py-1 rounded shadow-sm flex flex-row ${map_colors[map_name]} w-48`}>
                                                <div className="text-sm text-gray-500 mr-3">Eco</div>
                                                <div className="text-lg font-medium">
                                                    {formatRWP(mapStats.eco_won, mapStats.eco_won + mapStats.eco_lost)}
                                                </div>
                                            </div>
                                            <div className={`items-center px-3 py-1 rounded shadow-sm flex flex-row ${map_colors[map_name]} w-48`}>
                                                <div className="text-sm text-gray-500 mr-3">Buy v Buy</div>
                                                <div className="text-lg font-medium">
                                                    {formatRWP(mapStats.gun_won, mapStats.gun_won + mapStats.gun_lost)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mt-5">
                                        <div>
                                            <TeamDefaultsSection
                                                map_name={map_name}
                                                pistol_defaults={pistol_defaults}
                                                eco_defaults={eco_defaults}
                                                buy_defaults={buy_defaults}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                        </div>
                                    </div>
                                </TabsContent>
                            );
                        })}
                    </Tabs>
                </div>
            )}
        </TeamLoadingWrapper>
    );
}