import { getTeamTSideStats } from '@/lib/services'
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { TeamTStat } from '@/lib/types'

export default async function TeamTTable({ data }: { data: TeamTStat[] }) {
    return (
        <div className='container mx-auto py-10'>
            <DataTable columns={columns} data={data} />
        </div>
    )
}