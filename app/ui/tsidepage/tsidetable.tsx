import { FetchTeamTStats } from '../../lib/data'
import { columns } from "./columns"
import { DataTable } from "../data-table"
import { TeamTStat } from '@/app/lib/definitions'

export default async function TeamTTable({ data }: { data: TeamTStat[] }) {
    return (
        <div className='container mx-auto py-10'>
            <DataTable columns={columns} data={data} />
        </div>
    )
}