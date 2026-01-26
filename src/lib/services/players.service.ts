import { sql } from '@/lib/db';
import type { KDStat, WPAStat, PlayerPositionStat } from '@/lib/types';
import { ACTIVE_DUTY_MAPS, type ActiveDutyMap } from '@/lib/config/maps';

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

// Helper to get a short map name from the full map name (e.g., "de_mirage" -> "mirage")
function getMapShortName(mapName: string): string {
    return mapName.replace('de_', '');
}

export async function getPlayerPositionStats(tournament: string, side: 'CT' | 'TERRORIST', teamName?: string): Promise<PlayerPositionStat[]> {
    // Query to get position counts per player per map filtered by side and optionally by team
    type RawStat = {
        steam_id: string,
        name: string,
        map: string,
        total_rounds: number,
        a_count: number,
        mid_count: number,
        b_count: number
    };

    let rawStats: RawStat[];

    if (teamName) {
        // Filter by team
        rawStats = await sql<RawStat[]>`
            SELECT
                player.steam_id,
                player.name,
                match.map,
                COUNT(*) AS total_rounds,
                COUNT(CASE WHEN pd.zone = 'A' THEN 1 END) AS a_count,
                COUNT(CASE WHEN pd.zone = 'Mid' THEN 1 END) AS mid_count,
                COUNT(CASE WHEN pd.zone = 'B' THEN 1 END) AS b_count
            FROM player_default pd
            INNER JOIN player ON player.steam_id = pd.player_id
            INNER JOIN match ON match.id = pd.match_id
            INNER JOIN team ON team.id = pd.team_id
            WHERE match.tournament = ${tournament}
            AND pd.side = ${side}
            AND team.name = ${teamName}
            GROUP BY player.steam_id, player.name, match.map
            ORDER BY player.name, match.map
        `;
    } else {
        // No team filter
        rawStats = await sql<RawStat[]>`
            SELECT
                player.steam_id,
                player.name,
                match.map,
                COUNT(*) AS total_rounds,
                COUNT(CASE WHEN pd.zone = 'A' THEN 1 END) AS a_count,
                COUNT(CASE WHEN pd.zone = 'Mid' THEN 1 END) AS mid_count,
                COUNT(CASE WHEN pd.zone = 'B' THEN 1 END) AS b_count
            FROM player_default pd
            INNER JOIN player ON player.steam_id = pd.player_id
            INNER JOIN match ON match.id = pd.match_id
            WHERE match.tournament = ${tournament}
            AND pd.side = ${side}
            GROUP BY player.steam_id, player.name, match.map
            ORDER BY player.name, match.map
        `;
    }

    // Transform the raw stats into the required format
    // Group by player and pivot map data into columns
    const playerMap = new Map<string, PlayerPositionStat>();

    for (const row of rawStats) {
        const playerId = row.steam_id;

        if (!playerMap.has(playerId)) {
            // Initialize player with all map columns set to 0
            const playerStat: PlayerPositionStat = {
                steam_id: row.steam_id,
                name: row.name,
            };

            // Initialize all map position columns to 0
            for (const map of ACTIVE_DUTY_MAPS) {
                const shortName = getMapShortName(map);
                playerStat[`${shortName}_a`] = 0;
                playerStat[`${shortName}_mid`] = 0;
                playerStat[`${shortName}_b`] = 0;
            }

            playerMap.set(playerId, playerStat);
        }

        const playerStat = playerMap.get(playerId)!;
        const shortName = getMapShortName(row.map);

        // Only process if this is an active duty map
        if (ACTIVE_DUTY_MAPS.includes(row.map as ActiveDutyMap)) {
            const total = row.total_rounds || 1; // Avoid division by zero
            playerStat[`${shortName}_a`] = Number((row.a_count / total).toFixed(2));
            playerStat[`${shortName}_mid`] = Number((row.mid_count / total).toFixed(2));
            playerStat[`${shortName}_b`] = Number((row.b_count / total).toFixed(2));
        }
    }

    return Array.from(playerMap.values());
}
