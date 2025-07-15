import { TeamTChart } from "./tsidechart";
import TeamTTable from "./tsidetable"
import { fetchKDStats, FetchTeamTStats } from "@/app/lib/data";

export async function TeamTPage() {
    const teamtstats = await FetchTeamTStats();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            <TeamTTable data={teamtstats} />
            <TeamTChart data={teamtstats} />
        </div>
    )
}