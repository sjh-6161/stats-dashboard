import { TeamTChart } from "./tside-stats-chart";
import TeamTTable from "./tside-stats-table"
import { getTeamTSideStats } from "@/lib/services";

type TSideStatsPageProps = {
    tournament: string;
};

export default async function TSideStatsPage({ tournament }: TSideStatsPageProps) {
    const teamtstats = await getTeamTSideStats(tournament);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            <TeamTTable data={teamtstats} />
            <TeamTChart data={teamtstats} />
        </div>
    )
}