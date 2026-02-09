import { unstable_cache } from 'next/cache';
import { sql } from '@/lib/db';
import type { Tournament, Season, Stage } from '@/lib/types';

export const getTournaments = unstable_cache(
    async (): Promise<Tournament[]> => {
        const tournaments = await sql<Tournament[]>`
            SELECT DISTINCT tournament as name
            FROM match
            ORDER BY tournament;
        `
        return tournaments
    },
    ['tournaments'],
    { revalidate: 3600 } // Cache for 1 hour
);

export async function getSeasons(tournament: string): Promise<Season[]> {
    const seasons = await sql<Season[]>`
        SELECT DISTINCT season
        FROM match
        WHERE tournament = ${tournament}
        ORDER BY season;
    `
    return seasons
}

export async function getStages(tournament: string, season: number): Promise<Stage[]> {
    const stages = await sql<Stage[]>`
        SELECT DISTINCT stage
        FROM match
        WHERE tournament = ${tournament}
        AND season = ${season}
        ORDER BY stage;
    `
    return stages
}
