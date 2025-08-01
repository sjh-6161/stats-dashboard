'use client'

import { Map } from "@/components/radarmap/map"
import Filters from "./filters"
import Grenades from "./grenades"
import { MapGrenade, Team } from "../lib/definitions";
import { useState } from "react";

export default function StateWrapper({
    map_name,
    grenades,
    teams,
}: {
    map_name: string,
    grenades: MapGrenade[]
    teams: Team[],
}) {
    const [time, setTime] = useState(15.0)

    return (
        <>
            <div className="w-full h-full py-10 px-3">
                <Filters time={time} setTime={setTime} teams={teams}></Filters>
            </div>
            <div className="max-h-[90vh] items-center self-center text-center top-0">
                <Map mapName={map_name || ""} data={[]}>
                    <Grenades mapName={map_name || ""} data={grenades} time={time}/>
                </Map>
            </div>
        </>
    )
}