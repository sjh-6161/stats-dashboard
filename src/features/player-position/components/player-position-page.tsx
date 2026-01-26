import { getPlayerPositionStats, getTeams } from "@/lib/services";
import { columns } from "./columns";
import { PlayerPositionTable } from "./player-position-table";

type PlayerPositionPageProps = {
    tournament: string;
    team?: string;
};

export default async function PlayerPositionPage({ tournament, team }: PlayerPositionPageProps) {
    const teams = await getTeams();

    // Pass undefined if no team selected (or "all" is selected)
    const teamFilter = team && team !== "all" ? team : undefined;

    const [ctStats, tStats] = await Promise.all([
        getPlayerPositionStats(tournament, 'CT', teamFilter),
        getPlayerPositionStats(tournament, 'TERRORIST', teamFilter)
    ]);

    if (ctStats.length === 0 && tStats.length === 0) {
        return (
            <div className="p-4">
                <PlayerPositionTable
                    columns={columns}
                    ctData={[]}
                    tData={[]}
                    teams={teams}
                    currentTeam={team}
                />
                <p className="mt-4">No player position data available for this selection.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Player Position Stats</h2>
            <p className="text-sm text-muted-foreground mb-4">
                Proportion of rounds each player defaulted to A, Mid, or B on each map (rounded to 2 decimal places)
            </p>
            <PlayerPositionTable
                columns={columns}
                ctData={ctStats}
                tData={tStats}
                teams={teams}
                currentTeam={team}
            />
        </div>
    );
}
