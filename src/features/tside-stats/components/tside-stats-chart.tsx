"use client"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Label } from 'recharts';
import type { TeamTStat } from "@/lib/types";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ComponentLabel } from "@/components/ui/label";
 
const chartConfig = {
    avg_time: {
        label: 'Avg T Round Time'
    },
    trwp: {
        label: 'T Side RWP'
    },
    deaths: {
        label: 'Death Rounds'
    },
    planted: {
        label: 'Plant Rounds'
    },
    t_save: {
        label: 'T Save Rounds'
    }
} satisfies ChartConfig

const statNames: {[key: string]: string} = {
    avg_time: "Avg T Round Time",
    trwp: "T Side RWP",
    deaths: "Death Rounds",
    planted: "Plant Rounds",
    t_save: "T Save Rounds",
}

export function TeamTChart({ data }: { data: TeamTStat[] }) {
    const [x, setx] = useState("avg_time")
    const [y, sety] = useState("trwp")

    return (
        <div>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full pt-10 pl-10 overflow-visible">
                <ScatterChart accessibilityLayer
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                }}
                >
                    <CartesianGrid />
                    <XAxis type="number" dataKey={x} tickLine={false} name={statNames[x]}>
                        <Label dy={20}>{statNames[x]}</Label>
                    </XAxis>
                    <YAxis type="number" dataKey={y} tickLine={false} name={statNames[y]}>
                        <Label angle={90} dx={-10}>{statNames[y]}</Label>
                    </YAxis>
                    <ZAxis type="category" dataKey="name" name="Team"/>
                    <ChartTooltip content={<ChartTooltipContent hideLabel hideIndicator/>} />
                    <Scatter data={data} fill="#8884d8"/>
                </ScatterChart>
            </ChartContainer>
            <div className="flex flex-row px-20 align-middle mt-6">
                <ComponentLabel htmlFor="xselect" className="pr-2">
                    X Axis
                </ComponentLabel>
                <Select value={x} onValueChange={(val) => setx(val)}>
                    <SelectTrigger id="xselect" className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="avg_time">Avg T Round Time</SelectItem>
                        <SelectItem value="trwp">T Side RWP</SelectItem>
                        <SelectItem value="deaths">Death Rounds</SelectItem>
                        <SelectItem value="planted">Plant Rounds</SelectItem>
                        <SelectItem value="t_save">T Save Rounds</SelectItem>
                    </SelectContent>
                </Select>
                <ComponentLabel htmlFor="yselect" className="pr-2 pl-6">
                    Y Axis
                </ComponentLabel>
                <Select value={y} onValueChange={(val) => sety(val)}>
                    <SelectTrigger id="tselect" className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="avg_time">Avg T Side Round Time</SelectItem>
                        <SelectItem value="trwp">T Side RWP</SelectItem>
                        <SelectItem value="deaths">Death Rounds</SelectItem>
                        <SelectItem value="planted">Plant Rounds</SelectItem>
                        <SelectItem value="t_save">T Save Rounds</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}