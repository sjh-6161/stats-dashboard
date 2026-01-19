import KDTable from "./player-stats-table"
import { KDChart } from "./player-stats-chart"
import { getPlayerKDStats } from "@/lib/services";

type PlayerStatsPageProps = {
    tournament: string;
};

export default async function PlayerStatsPage({ tournament }: PlayerStatsPageProps) {
    const kdstats = await getPlayerKDStats(tournament);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            <KDTable data={kdstats} />
            <KDChart data={kdstats} />
        </div>
    )
}