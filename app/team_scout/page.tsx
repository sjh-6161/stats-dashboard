import { Map } from "@/components/radarmap/map"
import Filters from "./filters"
import Grenades from "./grenades"
import { FetchMapGrenades, FetchMapKills, FetchTeamMatches, FetchTeams } from "../lib/data"
import StateWrapper from "./state_wrapper"

export default async function Page({ 
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string | undefined}>
}) {
    const map_name = (await searchParams).map_name;
    const current_team = (await searchParams).team;

    const teams = await FetchTeams();

    if(current_team == "") {
        return (
            <div className="grid grid-cols-2 h-full w-full">
                <StateWrapper map_name={""} grenades={[]} kills={[]} teams={teams} team_matches={[]}/>
                
            </div>
        )
    }

    const teamMatches = await FetchTeamMatches(current_team || "");

    if(map_name == "") {
        return (
            <div className="grid grid-cols-2 h-full w-full">
                <StateWrapper map_name={""} grenades={[]} kills={[]} teams={teams} team_matches={teamMatches}/>
                
            </div>
        )
    }

    const grenades = await FetchMapGrenades(map_name || "", current_team || "");
    const kills = await FetchMapKills(map_name || "", current_team || "");

    return (
        <div className="grid grid-cols-2 h-full w-full">
            <StateWrapper map_name={map_name || ""} grenades={grenades} kills={kills} teams={teams} team_matches={teamMatches}/>
            
        </div>
    )
}