import sql from './db'
import {
    KDStat,
    WPAStat,
    TeamTStat,
    MapGrenade,
    Team,
    MapKill,
    Match,
    TeamDefault
} from './definitions'

export async function fetchKDStats(): Promise<KDStat[]> {
    const kdstats = await sql<KDStat[]>`
        SELECT t1.steam_id, t1.name, t1.kills, t2.deaths, t3.assists, t4.rounds, CAST(t1.kills as float) / t2.deaths as kd, CAST(t1.kills as float) / t4.rounds as kr, CAST(t2.deaths as float) / t4.rounds as dr, CAST(t3.assists as float) / t4.rounds as ar
        FROM (
            SELECT player.steam_id, player.name, COUNT(player.name) AS kills 
            FROM kill 
            INNER JOIN player 
            ON player.steam_id = kill.attacker_id 
            GROUP BY player.steam_id, player.name
        ) t1 INNER JOIN (
            SELECT player.name, COUNT(player.name) AS deaths 
            FROM kill 
            INNER JOIN player 
            ON player.steam_id = kill.victim_id 
            GROUP BY player.name
        ) t2 ON t1.name = t2.name
            INNER JOIN (
            SELECT player.name, COUNT(player.name) AS assists 
            FROM kill 
            INNER JOIN player 
            ON player.steam_id = kill.assister_id 
            GROUP BY player.name
        ) t3 ON t1.name = t3.name
        INNER JOIN (
            SELECT player.steam_id, SUM(count) as rounds FROM (
                SELECT player.steam_id as player_id, buy.match_id FROM buy
                INNER JOIN player
                ON buy.player_id = player.steam_id
                GROUP BY player.steam_id, buy.match_id
            ) t1 INNER JOIN (
                SELECT round.match_id, COUNT(round.match_id) 
                FROM round
                INNER JOIN match 
                ON round.match_id = match.id
                GROUP BY round.match_id
            ) t2 ON t1.match_id = t2.match_id
            INNER JOIN player ON player.steam_id = t1.player_id
            GROUP BY player.steam_id
        ) t4 ON t1.steam_id = t4.steam_id
        ORDER BY kd DESC;
        `

    return kdstats
}

export async function fetchWPAStats(): Promise<WPAStat[]> {
    return []

    const wpastats = await sql<WPAStat[]>`
        SELECT player.steam_id, player.name, t1.ksum / t2.dsum AS kd, (t1.ksum - t2.dsum) / t3.rounds AS diffr, (t1.ksum + t2.dsum) / t3.rounds AS totr, t3.rounds 
        FROM ( 
            SELECT kill.attacker_id, SUM(wpa.diff) as ksum, COUNT(wpa.diff) as kcount,  SUM(wpa.diff) / COUNT(wpa.diff) as kavg
            FROM kill
            INNER JOIN wpa 
            ON kill.victim_team = wpa.death_team AND kill.ct_alive = wpa.ct_alive AND kill.t_alive = wpa.t_alive
            GROUP BY kill.attacker_id
        ) t1 INNER JOIN (
            SELECT kill.victim_id, SUM(wpa.diff) as dsum, COUNT(wpa.diff) as dcount,  SUM(wpa.diff) / COUNT(wpa.diff) as davg
            FROM kill
            INNER JOIN wpa 
            ON kill.victim_team = wpa.death_team AND kill.ct_alive = wpa.ct_alive AND kill.t_alive = wpa.t_alive
            GROUP BY kill.victim_id
        ) t2 ON t1.attacker_id = t2.victim_id
        INNER JOIN player ON player.steam_id = t1.attacker_id
        INNER JOIN (
            SELECT player.steam_id, SUM(count) as rounds FROM (
                SELECT player.steam_id as player_id, buy.match_id FROM buy
                INNER JOIN player
                ON buy.player_id = player.steam_id
                GROUP BY player.steam_id, buy.match_id
            ) t1 INNER JOIN (
                SELECT round.match_id, COUNT(round.match_id) 
                FROM round
                INNER JOIN match 
                ON round.match_id = match.id
                GROUP BY round.match_id
            ) t2 ON t1.match_id = t2.match_id
            INNER JOIN player ON player.steam_id = t1.player_id
            GROUP BY player.steam_id
        ) t3 ON t3.steam_id = player.steam_id
        ORDER BY kd DESC;
    `

    return wpastats
}

export async function FetchTeamTStats(): Promise<TeamTStat[]> {
    const tstats = await sql<TeamTStat[]>`
        SELECT t_round_time.name, t_round_time.avg_time, CAST(round_info.wins AS FLOAT) / round_info.rounds AS trwp, CAST(deaths AS FLOAT) / round_info.rounds AS deaths, CAST(planted AS FLOAT) / round_info.rounds AS planted, coalesce(CAST(t_save AS FLOAT) / round_info.rounds, 0) AS t_save
        FROM (
            SELECT team.name, AVG((CAST(end_official_tick AS FLOAT) - freeze_time_end_tick) / 60) as avg_time
            FROM round
            INNER JOIN team
            ON team.id = round.t_team_id
            GROUP BY team.name
        ) t_round_time INNER JOIN (
            SELECT t_round_wins.name, t_round_wins.wins, t_rounds.rounds FROM (
                SELECT team.name, COUNT(team.name) as wins
                FROM round
                INNER JOIN team
                ON team.id = round.t_team_id
                WHERE round.winning_side = 'T'
                GROUP BY team.name
            ) t_round_wins INNER JOIN (
                SELECT team.name, COUNT(team.name) as rounds
                FROM round
                INNER JOIN team
                ON team.id = round.t_team_id
                GROUP BY team.name
            ) t_rounds ON t_round_wins.name = t_rounds.name
        ) round_info ON t_round_time.name = round_info.name FULL OUTER JOIN (
            SELECT team.name, COUNT(team.name) as deaths
            FROM round
            INNER JOIN team
            ON round.t_team_id = team.id 
            WHERE round.round_end_reason = 'CTWin' OR round.round_end_reason = 'TerroristsWin'
            GROUP BY team.name
        ) deaths ON t_round_time.name = deaths.name FULL OUTER JOIN (
            SELECT team.name, COUNT(team.name) as planted
            FROM round
            INNER JOIN team
            ON round.t_team_id = team.id
            WHERE round.round_end_reason = 'BombDefused' OR round.round_end_reason = 'TargetBombed'
            GROUP BY team.name
        ) planted ON t_round_time.name = planted.name FULL OUTER JOIN (
            SELECT team.name, COUNT(team.name) as t_save
            FROM round
            INNER JOIN team
            ON round.t_team_id = team.id
            WHERE round.round_end_reason = 'TargetSaved'
            GROUP BY team.name
        ) t_save ON t_round_time.name = t_save.name 
        ORDER BY trwp DESC
    `

    return tstats
}

export async function FetchMapGrenades(mapName: string, current_team: string): Promise<MapGrenade[]> {
    const grenades = await sql<MapGrenade[]>`
        SELECT grenade.player_id AS steamid, team, grenade_type, start_x, start_y, start_z, end_x, end_y, end_y, CAST(grenade.start_tick - round.freeze_time_end_tick AS FLOAT) / 64.0 AS start_time, CAST(grenade.end_tick - round.freeze_time_end_tick AS FLOAT) / 64.0 AS end_time
        FROM grenade
        INNER JOIN match ON match.id = grenade.match_id
        INNER JOIN round ON round.id = grenade.round_id
        INNER JOIN team ON team.id = grenade.team_id
        WHERE match.map = ${mapName} AND team.name = ${current_team};
    `

    return grenades
}

export async function FetchMapKills(mapName: string, current_team: string): Promise<MapKill[]> {
    return []
    
    const kills = await sql<MapKill[]>`
        SELECT attacker_id AS attacker_steamid, victim_id as victim_steamid, attacker_team, victim_team, t1.name = ${current_team} AS attacker_this_team, t2.name = ${current_team} AS victim_this_team, weapon, CAST(tick - freeze_time_end_tick AS FLOAT) / 64.0 as time, attacker_x, attacker_y, attacker_z, victim_x, victim_y, victim_z
        FROM kill
        INNER JOIN match ON match.id = kill.match_id
        INNER JOIN team t1 ON t1.id = kill.attacker_team_id
        INNER JOIN team t2 ON t2.id = kill.victim_team_id
        INNER JOIN round ON round.id = kill.round_id
        WHERE (t1.name = ${current_team} OR t2.name = ${current_team}) AND match.map = ${mapName}
    `

    return kills
}

export async function FetchTeams(): Promise<Team[]> {
    const teams = await sql<Team[]>`
        SELECT DISTINCT team.name, team.id
        FROM team
        ORDER BY team.name;
    `

    return teams
}

export async function FetchTeamMatches(current_team: string): Promise<Match[]> {
    const matches = await sql<Match[]>`
        SELECT tm1.name AS team_1, tm2.name as team_2, t1.count AS rounds_1, t2.count as rounds_2, match.map
        FROM match
        LEFT JOIN (
            SELECT round.match_id, round.winning_team_id, COUNT(round.winning_team_id)
            FROM round
            GROUP BY round.match_id, round.winning_team_id
            ORDER BY match_id
        ) t1 ON t1.winning_team_id = match.team_one_id AND t1.match_id = match.id
        LEFT JOIN (
            SELECT round.match_id, round.winning_team_id, COUNT(round.winning_team_id)
            FROM round
            GROUP BY round.match_id, round.winning_team_id
            ORDER BY match_id
        ) t2 ON t2.winning_team_id = match.team_two_id AND t2.match_id = match.id
        INNER JOIN team tm1 ON tm1.id = team_one_id
        INNER JOIN team tm2 ON tm2.id = team_two_id
        WHERE tm1.name = ${current_team} OR tm2.name = ${current_team}
    `

    return matches
}

export async function FetchTeamBuyDefaults(current_team: string, min_val: number, max_val: number): Promise<TeamDefault[]> {
    const defaults = await sql<TeamDefault[]>`
        SELECT 
            total_rounds.map_name,
            total_rounds.side, 
            total_rounds.num_a, 
            total_rounds.num_mid, 
            total_rounds.num_b, 
            COALESCE(ct_wins.ct_win, 0) AS ct_win,
            total_rounds.rounds,
            COALESCE(plant_times.num_plants, 0) AS num_plants,
            ROUND(COALESCE(plant_times.avg_plant_time, 0), 2) AS avg_plant_time
        FROM (
        SELECT 
            match.map AS map_name,
            team_default.side, 
            team_default.num_a, 
            team_default.num_mid, 
            team_default.num_b, 
            COUNT(team_default.num_a) AS ct_win
        FROM team_default
        INNER JOIN match
            ON team_default.match_id = match.id
        INNER JOIN team
            ON team_default.team_id = team.id
        INNER JOIN (
            SELECT round_id, team_id, SUM(equipment_value)
            FROM buy
            GROUP BY round_id, team_id
        ) buys 
            ON buys.round_id = team_default.round_id AND buys.team_id = team_default.team_id
        INNER JOIN round
            ON round.id = team_default.round_id
        WHERE buys.sum > ${min_val}
            AND buys.sum <= ${max_val}
            AND team.name = ${current_team}
            AND round.winning_side = 'CT' 
            AND round.t_rounds + round.ct_rounds != 0 
            AND round.t_rounds + round.ct_rounds != 12
        GROUP BY match.map, team_default.num_a, team_default.num_b, team_default.num_mid, team_default.side
        ) ct_wins
        FULL OUTER JOIN (
        SELECT 
            match.map AS map_name,
            team_default.side, 
            team_default.num_a, 
            team_default.num_mid, 
            team_default.num_b, 
            COUNT(team_default.num_a) AS rounds
        FROM team_default
        INNER JOIN match
            ON team_default.match_id = match.id
        INNER JOIN team
            ON team_default.team_id = team.id
        INNER JOIN (
            SELECT round_id, team_id, SUM(equipment_value)
            FROM buy
            GROUP BY round_id, team_id
        ) buys 
            ON buys.round_id = team_default.round_id AND buys.team_id = team_default.team_id
        INNER JOIN round
            ON round.id = team_default.round_id
        WHERE buys.sum > ${min_val}
            AND buys.sum <= ${max_val}
            AND team.name = ${current_team}
            AND round.t_rounds + round.ct_rounds != 0 
            AND round.t_rounds + round.ct_rounds != 12
        GROUP BY match.map, team_default.num_a, team_default.num_b, team_default.num_mid, team_default.side
        ) total_rounds 
        ON ct_wins.map_name = total_rounds.map_name
            AND ct_wins.side = total_rounds.side 
            AND ct_wins.num_a = total_rounds.num_a 
            AND ct_wins.num_b = total_rounds.num_b 
            AND ct_wins.num_mid = total_rounds.num_mid
        LEFT JOIN (
            SELECT 
                match.map AS map_name,
                team_default.side, 
                team_default.num_a, 
                team_default.num_mid, 
                team_default.num_b,
                COUNT(plant.id) AS num_plants,
                AVG((plant.tick - round.freeze_time_end_tick) / 64.0) AS avg_plant_time
            FROM team_default
            INNER JOIN match
                ON team_default.match_id = match.id
            INNER JOIN team
                ON team_default.team_id = team.id
            INNER JOIN (
                SELECT round_id, team_id, SUM(equipment_value)
                FROM buy
                GROUP BY round_id, team_id
            ) buys 
                ON buys.round_id = team_default.round_id AND buys.team_id = team_default.team_id
            INNER JOIN round
                ON round.id = team_default.round_id
            INNER JOIN plant
                ON plant.match_id = match.id 
                AND plant.round_id = round.id
            WHERE buys.sum > 20000
                AND buys.sum <= 100000
                AND team.name = 'Blunder Battalion'
                AND round.t_rounds + round.ct_rounds != 0 
                AND round.t_rounds + round.ct_rounds != 12
            GROUP BY match.map, team_default.num_a, team_default.num_b, team_default.num_mid, team_default.side
        ) plant_times
        ON plant_times.map_name = total_rounds.map_name
            AND plant_times.side = total_rounds.side 
            AND plant_times.num_a = total_rounds.num_a 
            AND plant_times.num_b = total_rounds.num_b 
            AND plant_times.num_mid = total_rounds.num_mid
        ORDER BY map_name, side, rounds DESC
    `

    return defaults
}

export async function FetchTeamPistolDefaults(current_team: string): Promise<TeamDefault[]> {
    const defaults = await sql<TeamDefault[]>`
        SELECT 
            total_rounds.map_name,
            total_rounds.side, 
            total_rounds.num_a, 
            total_rounds.num_mid, 
            total_rounds.num_b, 
            COALESCE(ct_wins.ct_win, 0) AS ct_win,
            total_rounds.rounds,
            COALESCE(plant_times.num_plants, 0) AS num_plants,
            ROUND(COALESCE(plant_times.avg_plant_time, 0), 2) AS avg_plant_time
        FROM (
        SELECT 
            match.map AS map_name,
            team_default.side, 
            team_default.num_a, 
            team_default.num_mid, 
            team_default.num_b, 
            COUNT(team_default.num_a) AS ct_win
        FROM team_default
        INNER JOIN match
            ON team_default.match_id = match.id
        INNER JOIN team
            ON team_default.team_id = team.id
        INNER JOIN (
            SELECT round_id, team_id, SUM(equipment_value)
            FROM buy
            GROUP BY round_id, team_id
        ) buys 
            ON buys.round_id = team_default.round_id AND buys.team_id = team_default.team_id
        INNER JOIN round
            ON round.id = team_default.round_id
        WHERE team.name = ${current_team}
            AND round.winning_side = 'CT' 
            AND (round.t_rounds + round.ct_rounds = 0 OR round.t_rounds + round.ct_rounds = 12)
        GROUP BY match.map, team_default.num_a, team_default.num_b, team_default.num_mid, team_default.side
        ) ct_wins
        FULL OUTER JOIN (
        SELECT 
            match.map AS map_name,
            team_default.side, 
            team_default.num_a, 
            team_default.num_mid, 
            team_default.num_b, 
            COUNT(team_default.num_a) AS rounds
        FROM team_default
        INNER JOIN match
            ON team_default.match_id = match.id
        INNER JOIN team
            ON team_default.team_id = team.id
        INNER JOIN (
            SELECT round_id, team_id, SUM(equipment_value)
            FROM buy
            GROUP BY round_id, team_id
        ) buys 
            ON buys.round_id = team_default.round_id AND buys.team_id = team_default.team_id
        INNER JOIN round
            ON round.id = team_default.round_id
        WHERE team.name = ${current_team}
            AND (round.t_rounds + round.ct_rounds = 0 OR round.t_rounds + round.ct_rounds = 12)
        GROUP BY match.map, team_default.num_a, team_default.num_b, team_default.num_mid, team_default.side
        ) total_rounds 
        ON ct_wins.map_name = total_rounds.map_name
            AND ct_wins.side = total_rounds.side 
            AND ct_wins.num_a = total_rounds.num_a 
            AND ct_wins.num_b = total_rounds.num_b 
            AND ct_wins.num_mid = total_rounds.num_mid
        LEFT JOIN (
            SELECT 
                match.map AS map_name,
                team_default.side, 
                team_default.num_a, 
                team_default.num_mid, 
                team_default.num_b,
                COUNT(plant.id) AS num_plants,
                AVG((plant.tick - round.freeze_time_end_tick) / 64.0) AS avg_plant_time
            FROM team_default
            INNER JOIN match
                ON team_default.match_id = match.id
            INNER JOIN team
                ON team_default.team_id = team.id
            INNER JOIN (
                SELECT round_id, team_id, SUM(equipment_value)
                FROM buy
                GROUP BY round_id, team_id
            ) buys 
                ON buys.round_id = team_default.round_id AND buys.team_id = team_default.team_id
            INNER JOIN round
                ON round.id = team_default.round_id
            INNER JOIN plant
                ON plant.match_id = match.id 
                AND plant.round_id = round.id
            WHERE team.name = ${current_team}
                AND (round.t_rounds + round.ct_rounds = 0 OR round.t_rounds + round.ct_rounds = 12)
            GROUP BY match.map, team_default.num_a, team_default.num_b, team_default.num_mid, team_default.side
        ) plant_times
        ON plant_times.map_name = total_rounds.map_name
            AND plant_times.side = total_rounds.side 
            AND plant_times.num_a = total_rounds.num_a 
            AND plant_times.num_b = total_rounds.num_b 
            AND plant_times.num_mid = total_rounds.num_mid
        ORDER BY map_name, side, rounds DESC
    `

    return defaults
}

// SELECT player.name, t1.ksum, t1.kcount, t1.kavg, t2.dsum, t2.dcount, t2.davg FROM ( 
//   SELECT kill.attacker_id, SUM(wpa.diff) as ksum, COUNT(wpa.diff) as kcount,  SUM(wpa.diff) / COUNT(wpa.diff) as kavg
//   FROM kill
//   INNER JOIN wpa 
//   ON kill.victim_team = wpa.death_team AND kill.ct_alive = wpa.ct_alive AND kill.t_alive = wpa.t_alive
//   GROUP BY kill.attacker_id
// ) t1 INNER JOIN (
//   SELECT kill.victim_id, SUM(wpa.diff) as dsum, COUNT(wpa.diff) as dcount,  SUM(wpa.diff) / COUNT(wpa.diff) as davg
//   FROM kill
//   INNER JOIN wpa 
//   ON kill.victim_team = wpa.death_team AND kill.ct_alive = wpa.ct_alive AND kill.t_alive = wpa.t_alive
//   GROUP BY kill.victim_id
// ) t2 ON t1.attacker_id = t2.victim_id
// INNER JOIN player ON player.id = t1.attacker_id

// SELECT t1.name, CAST(t1.kills as float) / t2.deaths AS rkd, CAST(t3.kills as float) / t3.deaths AS rrkd, CAST(t4.kills as float) / t4.deaths AS rskd
// FROM (
//   SELECT player.steam_id, player.name, COUNT(player.name) AS kills 
//   FROM kill 
//   INNER JOIN weapon_type AS w1
//   ON kill.weapon = w1.name
//   INNER JOIN player 
//   ON player.steam_id = kill.attacker_id 
//   WHERE w1.class = 'Rifle' 
//   GROUP BY player.steam_id, player.name
// ) t1 INNER JOIN (
//   SELECT player.steam_id, player.name, COUNT(player.name) AS deaths 
//   FROM kill 
//   INNER JOIN weapon_type AS w1
//   ON kill.weapon = w1.name
//   INNER JOIN player 
//   ON player.steam_id = kill.victim_id 
//   WHERE w1.class = 'Rifle'
//   GROUP BY player.steam_id, player.name
// ) t2 ON t1.steam_id = t2.steam_id
// FULL OUTER JOIN (SELECT t1.name, t1.kills, t2.deaths
//   FROM  (
//     SELECT player.steam_id, player.name, COUNT(player.name) AS kills 
//     FROM kill 
//     INNER JOIN weapon_type AS w1
//     ON kill.weapon = w1.name
//     INNER JOIN weapon_type AS w2
//     ON kill.victim_weapon = w2.name
//     INNER JOIN player 
//     ON player.steam_id = kill.attacker_id 
//     WHERE w1.class = 'Rifle' AND w2.class = 'Rifle'
//     GROUP BY player.steam_id, player.name
//   ) t1 INNER JOIN (
//     SELECT player.steam_id, player.name, COUNT(player.name) AS deaths 
//     FROM kill 
//     INNER JOIN weapon_type AS w1
//     ON kill.weapon = w1.name
//     INNER JOIN weapon_type AS w2
//     ON kill.victim_weapon = w2.name
//     INNER JOIN player 
//     ON player.steam_id = kill.victim_id 
//     WHERE w1.class = 'Rifle' AND w2.class = 'Rifle'
//     GROUP BY player.steam_id, player.name
//   ) t2 ON t1.steam_id = t2.steam_id      
// ) t3 ON t2.name = t3.name
// FULL OUTER JOIN (SELECT t1.name, t1.kills, t2.deaths
//   FROM  (
//     SELECT player.steam_id, player.name, COUNT(player.name) AS kills 
//     FROM kill 
//     INNER JOIN weapon_type AS w1
//     ON kill.weapon = w1.name
//     INNER JOIN weapon_type AS w2
//     ON kill.victim_weapon = w2.name
//     INNER JOIN player 
//     ON player.steam_id = kill.attacker_id 
//     WHERE w1.class = 'Rifle' AND w2.class = 'Sniper'
//     GROUP BY player.steam_id, player.name
//   ) t1 INNER JOIN (
//     SELECT player.steam_id, player.name, COUNT(player.name) AS deaths 
//     FROM kill 
//     INNER JOIN weapon_type AS w1
//     ON kill.weapon = w1.name
//     INNER JOIN weapon_type AS w2
//     ON kill.victim_weapon = w2.name
//     INNER JOIN player 
//     ON player.steam_id = kill.victim_id 
//     WHERE w1.class = 'Rifle' AND w2.class = 'Sniper'
//     GROUP BY player.steam_id, player.name
//   ) t2 ON t1.steam_id = t2.steam_id      
// ) t4 ON t2.name = t4.name
// ORDER BY rkd DESC