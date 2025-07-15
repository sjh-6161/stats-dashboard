"use client"

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from 'next/image'

export function Map() {
    return (
        <div className="grid grid-cols-2 h-full w-full">
            <div className="max-h-[90vh] items-center self-center text-center">
                <TransformWrapper>
                    <TransformComponent>
                        <img style={{imageRendering: 'pixelated'}} src="/map_images/de_dust2_radar_psd.png" alt="map" className="object-contain max-h-[90vh]"/>
                    </TransformComponent>
                </TransformWrapper>
            </div>
            <div></div>
        </div>
    )
    
}