import { unstable_cache } from 'next/cache';
import { sql } from '@/lib/db';
import type { Tournament } from '@/lib/types';

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
