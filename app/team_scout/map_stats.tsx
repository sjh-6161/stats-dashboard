import { Match } from "../lib/definitions"

export default function MapStats({
    team_matches,
}: {
    team_matches: Match[]
}) {


    return (
        <div className="w-full h-full  grid grid-cols-2 auto-rows-min gap-1">
            <div className="col-span-2 w-full text-2xl">
                Map Stats
            </div>
            <div className="border rounded-md p-1">
                Test
            </div>
            <div className="border rounded-md p-1">
                Test
            </div>
        </div>
    )
}

function getMapStats(team_matches: Match[]) {
    const map_stats: map_stat[] = []

    for(let i = 0; i < team_matches.length; i++) {
        var found = false;

        for(let j = 0; j < map_stats.length; j++) {
            if(team_matches[i].map == map_stats[j].map) {
                found = true;

                map_stats[j].count += 1;
            }
        }
    }
}

type map_stat = {
    map: string,
    count: number,
    wins: number,
    losses: number,
    round_wins: number,
    round_losses: number,
}