"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { KDStat } from "@/lib/types"
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

export const columns: ColumnDef<KDStat>[] = [
//   {
//     accessorKey: "steam_id",
//     header: "Steam ID",
//     cell: ({ row }) => <div className='p-1'>{row.getValue("steam_id")}</div>
//   },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className='p-1'>{row.getValue("name")}</div>
  },
  {
    accessorKey: "kills",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kills
          <ArrowUpDown className="ml-0 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className='text-center p-1'>{row.getValue("kills")}</div>
  },
  {
    accessorKey: "deaths",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Deaths
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className='text-center p-1'>{row.getValue("deaths")}</div>
  },
  {
    accessorKey: "assists",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assists
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className='text-center p-1'>{row.getValue("assists")}</div>
  },
  {
    accessorKey: "rounds",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rounds
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className='text-center p-1'>{row.getValue("rounds")}</div>
  },
  {
    accessorKey: "kd",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          K/D
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div style={{backgroundColor: getRGB(row.getValue("kd"), 0.4, 1.6, 1.0)}} className='text-center p-1'>{parseFloat(row.getValue("kd")).toFixed(2)}</div>
  },
  {
    accessorKey: "kr",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          K/R
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div style={{backgroundColor: getRGB(row.getValue("kr"), 0.3, 1.0, 0.65)}} className='text-center p-1'>{parseFloat(row.getValue("kr")).toFixed(2)}</div>
  },
  {
    accessorKey: "dr",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          D/R
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div style={{backgroundColor: getRGB((0.7 - Number(row.getValue("dr"))) + 0.7, 0.5, 0.9, 0.7)}} className='text-center p-1'>{parseFloat(row.getValue("dr")).toFixed(2)}</div>
  },
  {
    accessorKey: "ar",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          A/R
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div style={{backgroundColor: getRGB(row.getValue("ar"), 0.05, 0.35, 0.2)}} className='text-center p-1'>{parseFloat(row.getValue("ar")).toFixed(2)}</div>
  },
]