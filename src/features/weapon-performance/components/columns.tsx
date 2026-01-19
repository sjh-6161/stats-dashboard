"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { WPAStat } from "../../lib/definitions"
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

export const columns: ColumnDef<WPAStat>[] = [
    {
    accessorKey: "steam_id",
    header: "Steam ID",
    cell: ({ row }) => <div className='p-1'>{row.getValue("steam_id")}</div>
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className='p-1'>{row.getValue("name")}</div>
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
    accessorKey: "diffr",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Diff/R
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div style={{backgroundColor: getRGB(row.getValue("diffr"), -0.06, 0.06, 0)}} className='text-center p-1'>{parseFloat(row.getValue("diffr")).toFixed(3)}</div>
  },
  {
    accessorKey: "totr",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total/R
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div style={{backgroundColor: getRGB(row.getValue("totr"), 0.2, 0.3, 0.25)}} className='text-center p-1'>{parseFloat(row.getValue("totr")).toFixed(2)}</div>
  },
  {
    accessorKey: "rounds",
    header: "Rounds",
    cell: ({ row }) => <div className='text-center p-1'>{row.getValue("rounds")}</div>
  },
]