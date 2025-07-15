import { fetchWPAStats } from '../../lib/data'
import { columns } from "./columns"
import { DataTable } from "../data-table"

export default async function WPATable() {
    const wpastats = await fetchWPAStats();

    return (
        <div className='container mx-auto py-10'>
            <DataTable columns={columns} data={wpastats} />
        </div>
    )
}