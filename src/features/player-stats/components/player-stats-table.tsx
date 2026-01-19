import { getPlayerKDStats } from '@/lib/services'
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { KDStat } from '@/lib/types';

export default async function KDTable({ data }: { data: KDStat[] }) {
    return (
        <div className='container mx-auto'>
            <DataTable columns={columns} data={data} />
        </div>
    )
}