import { sql } from '@/lib/db';
import type { KDStat, WPAStat } from '@/lib/types';

export async function getPlayerKDStats(tournament: string): Promise<KDStat[]> {
    const kdstats = await sql<KDStat[]>`
        SELECT t1.steam_id, t1.name, t1.kills, t2.deaths, t3.assists, t4.rounds, CAST(t1.kills as float) / t2.deaths as kd, CAST(t1.kills as float) / t4.rounds as kr, CAST(t2.deaths as float) / t4.rounds as dr, CAST(t3.assists as float) / t4.rounds as ar
        FROM (
            SELECT player.steam_id, player.name, COUNT(player.name) AS kills
            FROM kill
            INNER JOIN player
            ON player.steam_id = kill.attacker_id
            INNER JOIN match
            ON kill.match_id = match.id
            WHERE match.tournament = ${tournament}
            GROUP BY player.steam_id, player.name
        ) t1 INNER JOIN (
            SELECT player.name, COUNT(player.name) AS deaths
            FROM kill
            INNER JOIN player
            ON player.steam_id = kill.victim_id
            INNER JOIN match
            ON kill.match_id = match.id
            WHERE match.tournament = ${tournament}
            GROUP BY player.name
        ) t2 ON t1.name = t2.name
            INNER JOIN (
            SELECT player.name, COUNT(player.name) AS assists
            FROM kill
            INNER JOIN player
            ON player.steam_id = kill.assister_id
            INNER JOIN match
            ON kill.match_id = match.id
            WHERE match.tournament = ${tournament}
            GROUP BY player.name
        ) t3 ON t1.name = t3.name
        INNER JOIN (
            SELECT player.steam_id, SUM(count) as rounds FROM (
                SELECT player.steam_id as player_id, buy.match_id FROM buy
                INNER JOIN player
                ON buy.player_id = player.steam_id
                INNER JOIN match
                ON buy.match_id = match.id
                WHERE match.tournament = ${tournament}
                GROUP BY player.steam_id, buy.match_id
            ) t1 INNER JOIN (
                SELECT round.match_id, COUNT(round.match_id)
                FROM round
                INNER JOIN match
                ON round.match_id = match.id
                WHERE match.tournament = ${tournament}
                GROUP BY round.match_id
            ) t2 ON t1.match_id = t2.match_id
            INNER JOIN player ON player.steam_id = t1.player_id
            GROUP BY player.steam_id
        ) t4 ON t1.steam_id = t4.steam_id
        ORDER BY kd DESC;
        `

    return kdstats
}

export async function getPlayerWPAStats(): Promise<WPAStat[]> {
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
