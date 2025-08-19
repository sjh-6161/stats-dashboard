'use client'

import { Map } from "@/components/radarmap/map"
import Filters from "./filters"
import Grenades from "./grenades"
import { MapGrenade, MapKill, Team } from "../lib/definitions";
import { useState } from "react";
import Kills from "./kills";

export default function StateWrapper({
    map_name,
    grenades,
    kills,
    teams,
}: {
    map_name: string,
    grenades: MapGrenade[],
    kills: MapKill[],
    teams: Team[],
}) {
    const [time, setTime] = useState(15.0)
    const [showGrenades, setShowGrenades] = useState(true)
    const [showKills, setShowKills] = useState(true)
    const [showPlants, setShowPlants] = useState(true)

    const [grenadeTypes, setGrenadeTypes] = useState("all")
    const [showTrajectories, setShowTrajectories] = useState(true)
    const [onlyAwp, setOnlyAwp] = useState(false)

    return (
        <>
            <div className="w-full h-full py-5 px-3">
                <Filters 
                    time={time} setTime={setTime} 
                    showGrenades={showGrenades} setShowGrenades={setShowGrenades}
                    showKills={showKills} setShowKills={setShowKills}
                    setShowPlants={setShowPlants}
                    setShowTrajectories={setShowTrajectories}
                    setOnlyAwp={setOnlyAwp}
                    teams={teams}
                />
            </div>
            <div className="max-h-[90vh] items-center self-center text-center top-0">
                <Map mapName={map_name || ""} data={[]}>
                    {showGrenades && <Grenades mapName={map_name || ""} data={grenades} time={time}/>}
                    {showKills && <Kills mapName={map_name || ""} data={kills} time={time} showTrajectories={showTrajectories} onlyAwp={onlyAwp}/>}
                </Map>
            </div>
        </>
    )
}