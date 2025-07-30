"use client"

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from 'next/image'
import { Kill } from "@/app/lib/definitions";

const mapdata = require('./mapdata.json')

const side_colors = {
    'CT': 'stroke-blue-500',
    'TERRORIST': 'stroke-yellow-500'
}

export function Map({mapName, data}: {mapName: string, data: Kill[]}) {
    return (
        <TransformWrapper>
            <TransformComponent contentStyle={{position: 'relative', maxHeight: '90vh', aspectRatio: '1/1'}}>
                <Image height={1024} width={1024} style={{imageRendering: 'pixelated'}} src={`/map_images/${mapName}_radar_psd.png`} alt="map" className=""/>
                <svg className="absolute w-full h-full">
                    {data.map((kill, i) => (
                        <line 
                            x1={`${positionTransformX(kill.attacker_x, mapName)}%`}
                            y1={`${-positionTransformY(kill.attacker_y, mapName)}%`}
                            x2={`${positionTransformX(kill.victim_x, mapName)}%`}
                            y2={`${-positionTransformY(kill.victim_y, mapName)}%`}
                            strokeLinecap="round" className={`${side_colors[kill.attacker_team]} stroke-1 hover:stroke-red-500 opacity-10`} key={i}
                        />
                    ))}
                </svg>
            </TransformComponent>
        </TransformWrapper>
    )
}

function positionTransformX(x: number, mapname: string) {
  return 100 * (x - mapdata[mapname]["pos_x"]) / (mapdata[mapname]["scale"] * 1024)
}

function positionTransformY(y: number, mapname: string) {
  return 100 * (y - mapdata[mapname]["pos_y"]) / (mapdata[mapname]["scale"] * 1024)
}