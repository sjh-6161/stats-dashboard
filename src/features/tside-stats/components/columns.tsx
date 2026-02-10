"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { TeamTStat } from "@/lib/types"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const getRGB = (
    value: number,
    min: number,
    max: number,
    mid: number
): string => {
    if(value === mid) {
        return `rgba(0, 0, 0, 0)`
    } else if (value > mid) {
        return `rgba(34, 197, 94, ${0.7 * ((value - mid) / (max - mid))})`
    } else {
        return `rgba(239, 68, 68, ${0.7 * ((mid - value) / (mid - min))})`
    }
}

export const columns: ColumnDef<TeamTStat>[] = [
    {
    accessorKey: "name",
    header: "Team",
    cell: ({ row }) => <div className='p-1'>{row.getValue("name")}</div>
  },
  {
    accessorKey: "avg_time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Avg T Round Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div style={{backgroundColor: getRGB(row.getValue("avg_time"), 80, 120, 100)}} className='text-center p-1'>{parseFloat(row.getValue("avg_time")).toFixed(2)}</div>
  },
  {
    accessorKey: "trwp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          T RWP
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div style={{backgroundColor: getRGB(row.getValue("trwp"), 0.4, 0.6, 0.5)}} className='text-center p-1'>{parseFloat(row.getValue("trwp")).toFixed(3)}</div>
  },
  {
    accessorKey: "deaths",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Death Rounds
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div style={{backgroundColor: getRGB(row.getValue("deaths"), 0.55, 0.75, 0.65)}} className='text-center p-1'>{parseFloat(row.getValue("deaths")).toFixed(2)}</div>
  },
  {
    accessorKey: "planted",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Plant Rounds
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div style={{backgroundColor: getRGB(row.getValue("planted"), 0.2, 0.4, 0.30)}} className='text-center p-1'>{parseFloat(row.getValue("planted")).toFixed(2)}</div>
  },
  {
    accessorKey: "t_save",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Save Rounds
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div style={{backgroundColor: getRGB(row.getValue("t_save"), 0.0, 0.10, 0.05)}} className='text-center p-1'>{parseFloat(row.getValue("t_save")).toFixed(2)}</div>
  },
]