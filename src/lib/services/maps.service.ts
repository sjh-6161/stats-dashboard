import { sql } from '@/lib/db';
import type { MapGrenade, MapKill, MapPlant } from '@/lib/types';

export async function getMapGrenades(currentTeam: string, tournament: string): Promise<MapGrenade[]> {
    const grenades = await sql<MapGrenade[]>`
        WITH round_defaults AS (
            SELECT
                pd.round_id,
                pd.team_id,
                COUNT(CASE WHEN pd.zone = 'A' THEN 1 END) AS num_a,
                COUNT(CASE WHEN pd.zone = 'Mid' THEN 1 END) AS num_mid,
                COUNT(CASE WHEN pd.zone = 'B' THEN 1 END) AS num_b
            FROM player_default pd
            GROUP BY pd.round_id, pd.team_id
        ),
        buys AS (
            SELECT round_id, team_id, SUM(equipment_value) AS sum
            FROM buy
            GROUP BY round_id, team_id
        )
        SELECT
            match.map AS map_name,
            grenade.player_id AS steamid,
            grenade.team AS team_side,
            grenade_type,
            start_x, start_y, start_z,
            end_x, end_y, end_z,
            CAST(grenade.start_tick - round.freeze_time_end_tick AS FLOAT) / 64.0 AS start_time,
            CAST(grenade.end_tick - round.freeze_time_end_tick AS FLOAT) / 64.0 AS end_time,
            CAST(plant.tick - round.freeze_time_end_tick AS FLOAT) / 64.0 AS plant_time,
            CASE
                WHEN round.t_rounds + round.ct_rounds = 0 OR round.t_rounds + round.ct_rounds = 12 THEN 'pistol'
                WHEN COALESCE(team_buy.sum, 0) < 10000 THEN 'eco'
                ELSE 'buy'
            END AS round_type,
            COALESCE(rd.num_a, 0) AS num_a,
            COALESCE(rd.num_mid, 0) AS num_mid,
            COALESCE(rd.num_b, 0) AS num_b
        FROM grenade
        INNER JOIN match ON match.id = grenade.match_id
        INNER JOIN round ON round.id = grenade.round_id
        INNER JOIN team ON team.id = grenade.team_id
        LEFT JOIN plant ON plant.round_id = grenade.round_id
        LEFT JOIN buys team_buy ON team_buy.round_id = grenade.round_id AND team_buy.team_id = grenade.team_id
        LEFT JOIN round_defaults rd ON rd.round_id = grenade.round_id AND rd.team_id = grenade.team_id
        WHERE team.name = ${currentTeam} AND match.tournament = ${tournament}
    `

    return grenades
}

export async function getMapKills(currentTeam: string, tournament: string): Promise<MapKill[]> {
    const kills = await sql<MapKill[]>`
        WITH round_defaults AS (
            SELECT
                pd.round_id,
                pd.team_id,
                COUNT(CASE WHEN pd.zone = 'A' THEN 1 END) AS num_a,
                COUNT(CASE WHEN pd.zone = 'Mid' THEN 1 END) AS num_mid,
                COUNT(CASE WHEN pd.zone = 'B' THEN 1 END) AS num_b
            FROM player_default pd
            GROUP BY pd.round_id, pd.team_id
        ),
        buys AS (
            SELECT round_id, team_id, SUM(equipment_value) AS sum
            FROM buy
            GROUP BY round_id, team_id
        )
        SELECT
            match.map AS map_name,
            attacker_id AS attacker_steamid,
            victim_id as victim_steamid,
            attacker_team,
            victim_team,
            t1.name = ${currentTeam} AS attacker_this_team,
            t2.name = ${currentTeam} AS victim_this_team,
            weapon,
            CAST(kill.tick - freeze_time_end_tick AS FLOAT) / 64.0 as time,
            CAST(plant.tick - freeze_time_end_tick AS FLOAT) / 64.0 as plant_time,
            attacker_x, attacker_y, attacker_z,
            victim_x, victim_y, victim_z,
            CASE
                WHEN round.t_rounds + round.ct_rounds = 0 OR round.t_rounds + round.ct_rounds = 12 THEN 'pistol'
                WHEN COALESCE(team_buy.sum, 0) < 10000 THEN 'eco'
                ELSE 'buy'
            END AS round_type,
            COALESCE(rd.num_a, 0) AS num_a,
            COALESCE(rd.num_mid, 0) AS num_mid,
            COALESCE(rd.num_b, 0) AS num_b
        FROM kill
        INNER JOIN match ON match.id = kill.match_id
        INNER JOIN team t1 ON t1.id = kill.attacker_team_id
        INNER JOIN team t2 ON t2.id = kill.victim_team_id
        INNER JOIN round ON round.id = kill.round_id
        LEFT JOIN plant ON plant.round_id = kill.round_id
        LEFT JOIN buys team_buy ON team_buy.round_id = kill.round_id
            AND team_buy.team_id = CASE
                WHEN t1.name = ${currentTeam} THEN t1.id
                ELSE t2.id
            END
        LEFT JOIN round_defaults rd ON rd.round_id = kill.round_id
            AND rd.team_id = CASE
                WHEN t1.name = ${currentTeam} THEN t1.id
                ELSE t2.id
            END
        WHERE (t1.name = ${currentTeam} OR t2.name = ${currentTeam}) AND match.tournament = ${tournament}
    `

    return kills
}

export async function getMapPlants(currentTeam: string, tournament: string): Promise<MapPlant[]> {
    const plants = await sql<MapPlant[]>`
        WITH round_defaults AS (
            SELECT
                pd.round_id,
                pd.team_id,
                COUNT(CASE WHEN pd.zone = 'A' THEN 1 END) AS num_a,
                COUNT(CASE WHEN pd.zone = 'Mid' THEN 1 END) AS num_mid,
                COUNT(CASE WHEN pd.zone = 'B' THEN 1 END) AS num_b
            FROM player_default pd
            GROUP BY pd.round_id, pd.team_id
        ),
        buys AS (
            SELECT round_id, team_id, SUM(equipment_value) AS sum
            FROM buy
            GROUP BY round_id, team_id
        )
        SELECT
            match.map AS map_name,
            plant.site,
            plant.x, plant.y, plant.z,
            CASE
                WHEN round.t_rounds + round.ct_rounds = 0 OR round.t_rounds + round.ct_rounds = 12 THEN 'pistol'
                WHEN COALESCE(team_buy.sum, 0) < 10000 THEN 'eco'
                ELSE 'buy'
            END AS round_type,
            COALESCE(rd.num_a, 0) AS num_a,
            COALESCE(rd.num_mid, 0) AS num_mid,
            COALESCE(rd.num_b, 0) AS num_b
        FROM plant
        INNER JOIN match ON match.id = plant.match_id
        INNER JOIN round ON round.id = plant.round_id
        INNER JOIN team ON team.id = round.t_team_id
        LEFT JOIN buys team_buy ON team_buy.round_id = plant.round_id AND team_buy.team_id = team.id
        LEFT JOIN round_defaults rd ON rd.round_id = plant.round_id AND rd.team_id = team.id
        WHERE team.name = ${currentTeam} AND match.tournament = ${tournament}
    `

    return plants
}
