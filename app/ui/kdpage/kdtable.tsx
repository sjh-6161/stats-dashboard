import { fetchKDStats } from '../../lib/data'
import { columns } from "./columns"
import { DataTable } from "../data-table"
import { KDStat } from '@/app/lib/definitions';

export default async function KDTable({ data }: { data: KDStat[] }) {
    return (
        <div className='container mx-auto'>
            <DataTable columns={columns} data={data} />
        </div>
    )
}