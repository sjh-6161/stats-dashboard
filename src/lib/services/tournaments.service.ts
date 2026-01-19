import { sql } from '@/lib/db';
import type { Tournament } from '@/lib/types';

export async function getTournaments(): Promise<Tournament[]> {
    const tournaments = await sql<Tournament[]>`
        SELECT DISTINCT tournament as name
        FROM match
        ORDER BY tournament;
    `

    return tournaments
}
