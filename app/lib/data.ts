import sql from './db'
import {
    KDStat,
    WPAStat,
    TeamTStat,
    Kill,
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

export async function FetchMapKills({mapName}: {mapName: string}): Promise<Kill[]> {
    const kills = await sql<Kill[]>`
        SELECT attacker_team, attacker_x, attacker_y, attacker_z, victim_x, victim_y, victim_z
        FROM kill
        INNER JOIN match
        ON kill.match_id = match.id
        WHERE match.map = 'de_inferno' AND attacker_x != 'NaN'
    `

    return kills
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