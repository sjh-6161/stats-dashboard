import { sql } from '@/lib/db';
import type { Team, TeamTStat, TeamDefault, Match } from '@/lib/types';

export async function getTeams(): Promise<Team[]> {
    const teams = await sql<Team[]>`
        SELECT DISTINCT team.name, team.id
        FROM team
        ORDER BY team.name;
    `

    return teams
}

export async function getTeamMatches(currentTeam: string, tournament: string): Promise<Match[]> {
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
        WHERE (tm1.name = ${currentTeam} OR tm2.name = ${currentTeam})
        AND match.tournament = ${tournament}
    `

    return matches
}

export async function getTeamTSideStats(tournament: string): Promise<TeamTStat[]> {
    const tstats = await sql<TeamTStat[]>`
        SELECT t_round_time.name, t_round_time.avg_time, CAST(round_info.wins AS FLOAT) / round_info.rounds AS trwp, CAST(deaths AS FLOAT) / round_info.rounds AS deaths, CAST(planted AS FLOAT) / round_info.rounds AS planted, coalesce(CAST(t_save AS FLOAT) / round_info.rounds, 0) AS t_save
        FROM (
            SELECT team.name, AVG((CAST(end_official_tick AS FLOAT) - freeze_time_end_tick) / 60) as avg_time
            FROM round
            INNER JOIN team
            ON team.id = round.t_team_id
            INNER JOIN match
            ON round.match_id = match.id
            WHERE match.tournament = ${tournament}
            GROUP BY team.name
        ) t_round_time INNER JOIN (
            SELECT t_round_wins.name, t_round_wins.wins, t_rounds.rounds FROM (
                SELECT team.name, COUNT(team.name) as wins
                FROM round
                INNER JOIN team
                ON team.id = round.t_team_id
                INNER JOIN match
                ON round.match_id = match.id
                WHERE round.winning_side = 'T'
                AND match.tournament = ${tournament}
                GROUP BY team.name
            ) t_round_wins INNER JOIN (
                SELECT team.name, COUNT(team.name) as rounds
                FROM round
                INNER JOIN team
                ON team.id = round.t_team_id
                INNER JOIN match
                ON round.match_id = match.id
                WHERE match.tournament = ${tournament}
                GROUP BY team.name
            ) t_rounds ON t_round_wins.name = t_rounds.name
        ) round_info ON t_round_time.name = round_info.name FULL OUTER JOIN (
            SELECT team.name, COUNT(team.name) as deaths
            FROM round
            INNER JOIN team
            ON round.t_team_id = team.id
            INNER JOIN match
            ON round.match_id = match.id
            WHERE (round.round_end_reason = 'CTWin' OR round.round_end_reason = 'TerroristsWin')
            AND match.tournament = ${tournament}
            GROUP BY team.name
        ) deaths ON t_round_time.name = deaths.name FULL OUTER JOIN (
            SELECT team.name, COUNT(team.name) as planted
            FROM round
            INNER JOIN team
            ON round.t_team_id = team.id
            INNER JOIN match
            ON round.match_id = match.id
            WHERE (round.round_end_reason = 'BombDefused' OR round.round_end_reason = 'TargetBombed')
            AND match.tournament = ${tournament}
            GROUP BY team.name
        ) planted ON t_round_time.name = planted.name FULL OUTER JOIN (
            SELECT team.name, COUNT(team.name) as t_save
            FROM round
            INNER JOIN team
            ON round.t_team_id = team.id
            INNER JOIN match
            ON round.match_id = match.id
            WHERE round.round_end_reason = 'TargetSaved'
            AND match.tournament = ${tournament}
            GROUP BY team.name
        ) t_save ON t_round_time.name = t_save.name
        ORDER BY trwp DESC
    `

    return tstats
}

export async function getTeamBuyDefaults(currentTeam: string | null, minVal: number, maxVal: number, tournament: string): Promise<TeamDefault[]> {
    const defaults = await sql<TeamDefault[]>`
        WITH round_defaults AS (
            SELECT
                pd.match_id,
                pd.round_id,
                pd.team_id,
                pd.side,
                COUNT(CASE WHEN pd.zone = 'A' THEN 1 END) AS num_a,
                COUNT(CASE WHEN pd.zone = 'Mid' THEN 1 END) AS num_mid,
                COUNT(CASE WHEN pd.zone = 'B' THEN 1 END) AS num_b
            FROM player_default pd
            GROUP BY pd.match_id, pd.round_id, pd.team_id, pd.side
        ),
        buys AS (
            SELECT round_id, team_id, SUM(equipment_value) AS sum
            FROM buy
            GROUP BY round_id, team_id
        ),
        filtered_defaults AS (
            SELECT
                match.map AS map_name,
                rd.round_id,
                rd.side,
                rd.num_a,
                rd.num_mid,
                rd.num_b,
                round.winning_side
            FROM round_defaults rd
            INNER JOIN match ON rd.match_id = match.id
            INNER JOIN team ON rd.team_id = team.id
            INNER JOIN buys ON buys.round_id = rd.round_id AND buys.team_id = rd.team_id
            INNER JOIN round ON round.id = rd.round_id
            WHERE buys.sum > ${minVal}
                AND buys.sum <= ${maxVal}
                AND (${currentTeam}::text IS NULL OR team.name = ${currentTeam})
                AND round.t_rounds + round.ct_rounds != 0
                AND round.t_rounds + round.ct_rounds != 12
                AND match.tournament = ${tournament}
        ),
        ct_wins AS (
            SELECT
                map_name,
                side,
                num_a,
                num_mid,
                num_b,
                COUNT(*) AS ct_win
            FROM filtered_defaults
            WHERE winning_side = 'CT'
            GROUP BY map_name, num_a, num_b, num_mid, side
        ),
        total_rounds AS (
            SELECT
                map_name,
                side,
                num_a,
                num_mid,
                num_b,
                COUNT(*) AS rounds
            FROM filtered_defaults
            GROUP BY map_name, num_a, num_b, num_mid, side
        ),
        plant_times AS (
            SELECT
                match.map AS map_name,
                rd.side,
                rd.num_a,
                rd.num_mid,
                rd.num_b,
                COUNT(plant.id) AS num_plants,
                AVG((plant.tick - round.freeze_time_end_tick) / 64.0) AS avg_plant_time
            FROM round_defaults rd
            INNER JOIN match ON rd.match_id = match.id
            INNER JOIN team ON rd.team_id = team.id
            INNER JOIN buys ON buys.round_id = rd.round_id AND buys.team_id = rd.team_id
            INNER JOIN round ON round.id = rd.round_id
            INNER JOIN plant ON plant.match_id = match.id AND plant.round_id = round.id
            WHERE buys.sum > 20000
                AND buys.sum <= 100000
                AND (${currentTeam}::text IS NULL OR team.name = ${currentTeam})
                AND round.t_rounds + round.ct_rounds != 0
                AND round.t_rounds + round.ct_rounds != 12
                AND match.tournament = ${tournament}
            GROUP BY match.map, rd.num_a, rd.num_b, rd.num_mid, rd.side
        )
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
        FROM total_rounds
        LEFT JOIN ct_wins
            ON ct_wins.map_name = total_rounds.map_name
            AND ct_wins.side = total_rounds.side
            AND ct_wins.num_a = total_rounds.num_a
            AND ct_wins.num_b = total_rounds.num_b
            AND ct_wins.num_mid = total_rounds.num_mid
        LEFT JOIN plant_times
            ON plant_times.map_name = total_rounds.map_name
            AND plant_times.side = total_rounds.side
            AND plant_times.num_a = total_rounds.num_a
            AND plant_times.num_b = total_rounds.num_b
            AND plant_times.num_mid = total_rounds.num_mid
        ORDER BY map_name, side, rounds DESC
    `

    return defaults
}

export async function getTeamPistolDefaults(currentTeam: string | null, tournament: string): Promise<TeamDefault[]> {
    const defaults = await sql<TeamDefault[]>`
        WITH round_defaults AS (
            SELECT
                pd.match_id,
                pd.round_id,
                pd.team_id,
                pd.side,
                COUNT(CASE WHEN pd.zone = 'A' THEN 1 END) AS num_a,
                COUNT(CASE WHEN pd.zone = 'Mid' THEN 1 END) AS num_mid,
                COUNT(CASE WHEN pd.zone = 'B' THEN 1 END) AS num_b
            FROM player_default pd
            GROUP BY pd.match_id, pd.round_id, pd.team_id, pd.side
        ),
        buys AS (
            SELECT round_id, team_id, SUM(equipment_value) AS sum
            FROM buy
            GROUP BY round_id, team_id
        ),
        filtered_defaults AS (
            SELECT
                match.map AS map_name,
                rd.round_id,
                rd.side,
                rd.num_a,
                rd.num_mid,
                rd.num_b,
                round.winning_side
            FROM round_defaults rd
            INNER JOIN match ON rd.match_id = match.id
            INNER JOIN team ON rd.team_id = team.id
            INNER JOIN buys ON buys.round_id = rd.round_id AND buys.team_id = rd.team_id
            INNER JOIN round ON round.id = rd.round_id
            WHERE (${currentTeam}::text IS NULL OR team.name = ${currentTeam})
                AND (round.t_rounds + round.ct_rounds = 0 OR round.t_rounds + round.ct_rounds = 12)
                AND match.tournament = ${tournament}
        ),
        ct_wins AS (
            SELECT
                map_name,
                side,
                num_a,
                num_mid,
                num_b,
                COUNT(*) AS ct_win
            FROM filtered_defaults
            WHERE winning_side = 'CT'
            GROUP BY map_name, num_a, num_b, num_mid, side
        ),
        total_rounds AS (
            SELECT
                map_name,
                side,
                num_a,
                num_mid,
                num_b,
                COUNT(*) AS rounds
            FROM filtered_defaults
            GROUP BY map_name, num_a, num_b, num_mid, side
        ),
        plant_times AS (
            SELECT
                match.map AS map_name,
                rd.side,
                rd.num_a,
                rd.num_mid,
                rd.num_b,
                COUNT(plant.id) AS num_plants,
                AVG((plant.tick - round.freeze_time_end_tick) / 64.0) AS avg_plant_time
            FROM round_defaults rd
            INNER JOIN match ON rd.match_id = match.id
            INNER JOIN team ON rd.team_id = team.id
            INNER JOIN buys ON buys.round_id = rd.round_id AND buys.team_id = rd.team_id
            INNER JOIN round ON round.id = rd.round_id
            INNER JOIN plant ON plant.match_id = match.id AND plant.round_id = round.id
            WHERE (${currentTeam}::text IS NULL OR team.name = ${currentTeam})
                AND (round.t_rounds + round.ct_rounds = 0 OR round.t_rounds + round.ct_rounds = 12)
                AND match.tournament = ${tournament}
            GROUP BY match.map, rd.num_a, rd.num_b, rd.num_mid, rd.side
        )
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
        FROM total_rounds
        LEFT JOIN ct_wins
            ON ct_wins.map_name = total_rounds.map_name
            AND ct_wins.side = total_rounds.side
            AND ct_wins.num_a = total_rounds.num_a
            AND ct_wins.num_b = total_rounds.num_b
            AND ct_wins.num_mid = total_rounds.num_mid
        LEFT JOIN plant_times
            ON plant_times.map_name = total_rounds.map_name
            AND plant_times.side = total_rounds.side
            AND plant_times.num_a = total_rounds.num_a
            AND plant_times.num_b = total_rounds.num_b
            AND plant_times.num_mid = total_rounds.num_mid
        ORDER BY map_name, side, rounds DESC
    `

    return defaults
}
