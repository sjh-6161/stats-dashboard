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
    map_name, 
    children
}: {
    map_name: string, 
    children: ReactNode
}) {
    return (
        <TransformWrapper>
            <TransformComponent contentStyle={{position: 'relative', width: '100%', aspectRatio: '1/1', backgroundColor: 'black', borderRadius: '0.5rem', overflow: 'hidden'}}>
                <Image height={1024} width={1024} style={{imageRendering: 'pixelated'}} src={`/map_images/${map_name}_radar_psd.png`} alt="map" className=""/>
                <svg
                    viewBox="0 0 100 100"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none'
                    }}
                >
                    {children}
                </svg>
            </TransformComponent>
        </TransformWrapper>
    )
}

export function positionTransformX(x: number, mapname: string) {
  return 100 * (x - mapdata[mapname]["pos_x"]) / (mapdata[mapname]["scale"] * 1024)
}

export function positionTransformY(y: number, mapname: string) {
  return 100 * (mapdata[mapname]["pos_y"] - y) / (mapdata[mapname]["scale"] * 1024)
}