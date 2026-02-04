import { sql } from '@/lib/db';
import type { MapGrenade, MapKill, MapPlant } from '@/lib/types';

export async function getMapGrenades(mapName: string, currentTeam: string, tournament: string): Promise<MapGrenade[]> {
    const grenades = await sql<MapGrenade[]>`
        SELECT grenade.player_id AS steamid, team, grenade_type, start_x, start_y, start_z, end_x, end_y, end_y, CAST(grenade.start_tick - round.freeze_time_end_tick AS FLOAT) / 64.0 AS start_time, CAST(grenade.end_tick - round.freeze_time_end_tick AS FLOAT) / 64.0 AS end_time
        FROM grenade
        INNER JOIN match ON match.id = grenade.match_id
        INNER JOIN round ON round.id = grenade.round_id
        INNER JOIN team ON team.id = grenade.team_id
        WHERE match.map = ${mapName} AND team.name = ${currentTeam} AND match.tournament = ${tournament};
    `

    return grenades
}

export async function getMapKills(currentTeam: string, tournament: string): Promise<MapKill[]> {
    const kills = await sql<MapKill[]>`
        SELECT match.map AS map_name, attacker_id AS attacker_steamid, victim_id as victim_steamid, attacker_team, victim_team, t1.name = ${currentTeam} AS attacker_this_team, t2.name = ${currentTeam} AS victim_this_team, weapon, CAST(kill.tick - freeze_time_end_tick AS FLOAT) / 64.0 as time, CAST(plant.tick - freeze_time_end_tick AS FLOAT) / 64.0 as plant_time, attacker_x, attacker_y, attacker_z, victim_x, victim_y, victim_z
        FROM kill
        INNER JOIN match ON match.id = kill.match_id
        INNER JOIN team t1 ON t1.id = kill.attacker_team_id
        INNER JOIN team t2 ON t2.id = kill.victim_team_id
        INNER JOIN round ON round.id = kill.round_id
        LEFT JOIN plant ON plant.round_id = kill.round_id
        WHERE (t1.name = ${currentTeam} OR t2.name = ${currentTeam}) AND match.tournament = ${tournament}
    `

    return kills
}

export async function getMapPlants(currentTeam: string, tournament: string): Promise<MapPlant[]> {
    const plants = await sql<MapPlant[]>`
        SELECT match.map AS map_name, plant.site, plant.x, plant.y, plant.z
        FROM plant
        INNER JOIN match ON match.id = plant.match_id
        INNER JOIN round ON round.id = plant.round_id
        INNER JOIN team ON team.id = round.t_team_id
        WHERE team.name = ${currentTeam} AND match.tournament = ${tournament}
    `

    return plants
}
