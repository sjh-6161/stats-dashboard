'use client'

import { useSearchParams } from "next/navigation";
import { MapGrenade } from "../lib/definitions";
import { Fragment } from "react";

const mapdata = require('@/components/radarmap/mapdata.json')

const side_colors: {[key: string]: string} = {
    'CT': 'fill-blue-500',
    'TERRORIST': 'fill-amber-500'
}

const grenade_colors: {[key: string]: string} = {
    'HEGrenade': 'stroke-green-500',
    'Molotov': 'stroke-red-500',
    'Flashbang': 'stroke-yellow-500',
    'SmokeGrenade': 'stroke-neutral-400',
    'Decoy': 'stroke-brown-500'
}

export default function Grenades({
    data,
    mapName,
    time
}: {
    data: MapGrenade[],
    mapName: string,
    time: number
}) {
    const searchParams = useSearchParams();

    const side = searchParams.get("side");

    return (
        <svg className="absolute w-full h-full">
            {data.filter(grenade => grenade.team == side && grenade.start_time < Number(time)).map((grenade, i) => (
                <Fragment key={i}>
                    <line 
                        x1={`${positionTransformX(grenade.start_x, mapName)}%`}
                        y1={`${-positionTransformY(grenade.start_y, mapName)}%`}
                        x2={`${positionTransformX(calc_lerp(grenade.start_x, grenade.end_x, grenade.start_time, grenade.end_time, Number(time)), mapName)}%`}
                        y2={`${-positionTransformY(calc_lerp(grenade.start_y, grenade.end_y, grenade.start_time, grenade.end_time, Number(time)), mapName)}%`}
                        strokeLinecap="round" className={`${grenade_colors[grenade.grenade_type]} stroke-1 hover:z-50 opacity-50 hover:opacity-100`} 
                        key={`l${i}`}
                    />
                    <circle 
                        cx={`${positionTransformX(grenade.start_x, mapName)}%`} 
                        cy={`${-positionTransformY(grenade.start_y, mapName)}%`} 
                        r="1.5"
                        className={side_colors[grenade.team]}
                        key={`cs${i}`}
                    />
                    {grenade.end_time <= time && <circle
                        cx={`${positionTransformX(grenade.end_x, mapName)}%`} 
                        cy={`${-positionTransformY(grenade.end_y, mapName)}%`} 
                        r="0.5"
                        className={grenade_colors[grenade.grenade_type]}
                        key={`ce${i}`}
                    />}
                </Fragment>
            ))}
        </svg>
    )
}

function calc_lerp(start: number, end: number, start_time: number, end_time: number, time: number) {
    if(time > end_time || time < start_time) {
        return end
    }

    const traveled = (time - start_time) / (end_time - start_time)

    return end * traveled + start * (1 - traveled)
}

function positionTransformX(x: number, mapname: string) {
  return 100 * (x - mapdata[mapname]["pos_x"]) / (mapdata[mapname]["scale"] * 1024)
}

function positionTransformY(y: number, mapname: string) {
  return 100 * (y - mapdata[mapname]["pos_y"]) / (mapdata[mapname]["scale"] * 1024)
}