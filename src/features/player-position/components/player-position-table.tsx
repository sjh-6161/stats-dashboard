"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { PlayerPositionStat, Team } from "@/lib/types"
import { TournamentSelector } from "@/components/ui/tournament-selector"

interface PlayerPositionTableProps {
    columns: ColumnDef<PlayerPositionStat>[]
    ctData: PlayerPositionStat[]
    tData: PlayerPositionStat[]
    teams: Team[]
    currentTeam?: string
    tournaments: string[]
    selectedTournament: string
    onTournamentChange: (tournament: string) => void
    onTeamChange: (teamName: string) => void
}

export function PlayerPositionTable({
    columns,
    ctData,
    tData,
    teams,
    currentTeam,
    tournaments,
    selectedTournament,
    onTournamentChange,
    onTeamChange,
}: PlayerPositionTableProps) {
    const [side, setSide] = React.useState<'CT' | 'T'>('CT')
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const data = side === 'CT' ? ctData : tData

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: 20
            }
        }
    })

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <TournamentSelector tournaments={tournaments} value={selectedTournament} onValueChange={onTournamentChange} />
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Team:</span>
                    <Select value={currentTeam || "all"} onValueChange={onTeamChange}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="All Teams" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Teams</SelectItem>
                            {teams.map((team) => (
                                <SelectItem key={team.id} value={team.name}>
                                    {team.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Side:</span>
                    <Button
                        variant={side === 'CT' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSide('CT')}
                        className={side === 'CT' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                    >
                        CT
                    </Button>
                    <Button
                        variant={side === 'T' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSide('T')}
                        className={side === 'T' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                    >
                        T
                    </Button>
                </div>
            </div>
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="px-2">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="p-0">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()} ({data.length} players)
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
