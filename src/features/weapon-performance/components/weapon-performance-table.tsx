import { getPlayerWPAStats } from '@/lib/services'
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"

export default async function WeaponPerformanceTable() {
    const wpastats = await getPlayerWPAStats();

    return (
        <div className='container mx-auto py-10'>
            <DataTable columns={columns} data={wpastats} />
        </div>
    )
}