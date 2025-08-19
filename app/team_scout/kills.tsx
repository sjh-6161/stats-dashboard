import { Fragment } from "react";
import { MapKill } from "../lib/definitions";
import { useSearchParams } from "next/navigation";

const mapdata = require('@/components/radarmap/mapdata.json')

export default function Kills({
    data,
    mapName,
    time,
    showTrajectories,
    onlyAwp,
}: {
    data: MapKill[],
    mapName: string,
    time: number,
    showTrajectories: boolean,
    onlyAwp: boolean,
}) {
    const searchParams = useSearchParams();
    
    const side = searchParams.get("side");

    return (
        <svg className="absolute w-full h-full">
            {data.filter(kill => kill.attacker_this_team && kill.time < time && kill.attacker_team == side && (!onlyAwp || kill.weapon == "awp")).map((kill, i) => (
                <Fragment key={i}>
                    <circle
                        cx={`${positionTransformX(kill.attacker_x || 0, mapName)}%`}
                        cy={`${-positionTransformY(kill.attacker_y || 0, mapName)}%`}
                        r="3"
                        className="fill-green-500 opacity-50 mix-blend-lighten"
                        key={i}
                    />
                    {(showTrajectories && kill.attacker_x != null) && <line
                        x1={`${positionTransformX(kill.attacker_x || 0, mapName)}%`}
                        y1={`${-positionTransformY(kill.attacker_y || 0, mapName)}%`}
                        x2={`${positionTransformX(kill.victim_x, mapName)}%`}
                        y2={`${-positionTransformY(kill.victim_y, mapName)}%`}
                        className="stroke-green-500 opacity-50 mix-blend-lighten stroke-1"
                        strokeLinecap="round"
                    />}
                </Fragment>
            ))}
            {data.filter(kill => kill.victim_this_team && kill.time < time && kill.victim_team == side && (!onlyAwp || kill.weapon == "awp")).map((kill, i) => (
                <Fragment key={i}>
                    <circle
                        cx={`${positionTransformX(kill.victim_x || 0, mapName)}%`}
                        cy={`${-positionTransformY(kill.victim_y || 0, mapName)}%`}
                        r="3"
                        className="fill-red-500 opacity-50 mix-blend-lighten"
                        key={i}
                    />
                    {(showTrajectories && kill.attacker_x != null) && <line
                        x1={`${positionTransformX(kill.attacker_x || 0, mapName)}%`}
                        y1={`${-positionTransformY(kill.attacker_y || 0, mapName)}%`}
                        x2={`${positionTransformX(kill.victim_x, mapName)}%`}
                        y2={`${-positionTransformY(kill.victim_y, mapName)}%`}
                        className="stroke-red-500 opacity-50 mix-blend-lighten stroke-1"
                        strokeLinecap="round"
                    />}
                </Fragment>
            ))}
        </svg>
    )
}

function positionTransformX(x: number, mapname: string) {
  return 100 * (x - mapdata[mapname]["pos_x"]) / (mapdata[mapname]["scale"] * 1024)
}

function positionTransformY(y: number, mapname: string) {
  return 100 * (y - mapdata[mapname]["pos_y"]) / (mapdata[mapname]["scale"] * 1024)
}