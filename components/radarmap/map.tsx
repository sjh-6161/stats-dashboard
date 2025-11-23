"use client"

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from 'next/image'
import { ReactNode } from "react";

const mapdata = require('./mapdata.json')

const side_colors = {
    'CT': 'stroke-blue-500',
    'TERRORIST': 'stroke-yellow-500'
}

export function Map({
    mapName, 
    children
}: {
    mapName: string, 
    children: ReactNode
}) {
    return (
        <TransformWrapper>
            <TransformComponent contentStyle={{position: 'relative', maxHeight: '90vh', aspectRatio: '1/1'}}>
                <Image height={1024} width={1024} style={{imageRendering: 'pixelated'}} src={`/map_images/${mapName}_radar_psd.png`} alt="map" className=""/>
                {children}
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