"use client"

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from 'next/image'
import { ReactNode } from "react";

import mapdata from './mapdata.json'

const mapdataRecord = mapdata as Record<string, { pos_x: number; pos_y: number; scale: number }>

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
  return 100 * (x - mapdataRecord[mapname]["pos_x"]) / (mapdataRecord[mapname]["scale"] * 1024)
}

export function positionTransformY(y: number, mapname: string) {
  return 100 * (mapdataRecord[mapname]["pos_y"] - y) / (mapdataRecord[mapname]["scale"] * 1024)
}