'use client'

import { Map } from "@/components/radarmap/map"
import Filters from "./filters"
import Grenades from "./grenades"
import { MapGrenade, MapKill, Team, Match } from "../lib/definitions";
import { useState } from "react";
import Kills from "./kills";
import MapStats from "./map_stats";

export default function StateWrapper({
    map_name,
    grenades,
    kills,
    teams,
    team_matches,
}: {
    map_name: string,
    grenades: MapGrenade[],
    kills: MapKill[],
    teams: Team[],
    team_matches: Match[],
}) {
    const [time, setTime] = useState(12.0)
    const [activeTab, setActiveTab] = useState("general")

    const [grenadeTypes, setGrenadeTypes] = useState("all")
    const [showTrajectories, setShowTrajectories] = useState(true)
    const [onlyAwp, setOnlyAwp] = useState(false)

    return (
        <>
            <div className="w-full h-full py-5 px-3">
                <Filters 
                    time={time} setTime={setTime} 
                    activeTab={activeTab} setActiveTab={setActiveTab}
                    setShowTrajectories={setShowTrajectories}
                    setOnlyAwp={setOnlyAwp}
                    teams={teams}
                />
            </div>
            <div className="max-h-[90vh] top-0 py-5 px-3">
                {(activeTab == "grenades" || activeTab == "kills") && <>
                    <div className="absolute m-1 p-2 bg-neutral-700 font-mono rounded-lg text-white z-50 text-lg opacity-80">
                        {new Date((115 - time) * 1000).toISOString().substr(14, 5)}
                    </div>
                    <Map mapName={map_name || ""}>
                        {activeTab == "grenades" && <Grenades mapName={map_name || ""} data={grenades} time={time}/>}
                        {activeTab == "kills" && <Kills mapName={map_name || ""} data={kills} time={time} showTrajectories={showTrajectories} onlyAwp={onlyAwp}/>}
                    </Map>
                </>}
                {activeTab == "maps" && <MapStats team_matches={team_matches}/>}
            </div>
        </>
    )
}