"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { TeamDefault } from "@/lib/types"
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

const ct_colors: Record<string, string> = {
    "0": "",
    "1": "bg-blue-100",
    "2": "bg-blue-200",
    "3": "bg-blue-300",
    "4": "bg-blue-400",
    "5": "bg-blue-500"
}

const t_colors: Record<string, string> = {
    "0": "",
    "1": "bg-amber-100",
    "2": "bg-amber-200",
    "3": "bg-amber-300",
    "4": "bg-amber-400",
    "5": "bg-amber-500"
}

export const columns: ColumnDef<TeamDefault>[] = [
  {
    accessorKey: "side",
    header: () => <></>,
    cell: () => <></>
  },
  {
    accessorKey: "num_a",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          A
          <ArrowUpDown className="ml-0 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className={`text-center p-1 ${row.getValue("side") == "CT" ? ct_colors[String(row.getValue("num_a"))] : t_colors[String(row.getValue("num_a"))]}`}>{row.getValue("num_a")}</div>
  },
  {
    accessorKey: "num_mid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mid
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className={`text-center p-1 ${row.getValue("side") == "CT" ? ct_colors[String(row.getValue("num_mid"))] : t_colors[String(row.getValue("num_mid"))]}`}>{row.getValue("num_mid")}</div>
  },
  {
    accessorKey: "num_b",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          B
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className={`text-center p-1  ${row.getValue("side") == "CT" ? ct_colors[String(row.getValue("num_b"))] : t_colors[String(row.getValue("num_b"))]}`}>{row.getValue("num_b")}</div>
  },
  {
    accessorKey: "ct_win",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Wins
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className={`text-center p-1`}>{row.getValue("side") == "CT" ? parseFloat(row.getValue("ct_win")) : parseFloat(row.getValue("rounds")) - parseFloat(row.getValue("ct_win"))}</div>
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
    accessorKey: "num_plants",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
        Plants
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className='text-center p-1'>{row.getValue("num_plants")}</div>
  },
  {
    accessorKey: "avg_plant_time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
        Plant Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className='text-center p-1'>{parseFloat(row.getValue("avg_plant_time")).toFixed(1)}</div>
  },
]