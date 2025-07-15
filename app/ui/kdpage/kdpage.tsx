import KDTable from "./kdtable"
import { KDChart } from "./kdchart"
import { fetchKDStats } from "@/app/lib/data";

export async function KDPage() {
    const kdstats = await fetchKDStats();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            <KDTable data={kdstats} />
            <KDChart data={kdstats} />
        </div>
    )
}