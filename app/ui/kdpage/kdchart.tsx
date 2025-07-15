"use client"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { KDStat } from "@/app/lib/definitions";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ComponentLabel } from "@/components/ui/label";
 
const chartConfig = {
    kd: {
        label: 'K/D'
    },
    kr: {
        label: 'K/R'
    },
    dr: {
        label: 'D/R'
    },
    ar: {
        label: 'A/R'
    }
} satisfies ChartConfig

const statNames: {[key: string]: string} = {
    kd: "K/D",
    kr: "K/R",
    dr: "D/R",
    ar: "A/R"
}

export function KDChart({ data }: { data: KDStat[] }) {
    const [x, setx] = useState("kr")
    const [y, sety] = useState("dr")

    return (
        <div>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full pt-10 pl-10">
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
                        <Label  dx={-20}>{statNames[y]}</Label>
                    </YAxis>
                    <ZAxis type="category" dataKey="name" name="Player"/>
                    <ChartTooltip content={<ChartTooltipContent hideLabel hideIndicator/>} />
                    <Scatter name="A school" data={data} fill="#8884d8"/>
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
                        <SelectItem value="kd">K/D</SelectItem>
                        <SelectItem value="kr">K/R</SelectItem>
                        <SelectItem value="dr">D/R</SelectItem>
                        <SelectItem value="ar">A/R</SelectItem>
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
                        <SelectItem value="kd">K/D</SelectItem>
                        <SelectItem value="kr">K/R</SelectItem>
                        <SelectItem value="dr">D/R</SelectItem>
                        <SelectItem value="ar">A/R</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}