import { UUID } from "crypto";

export type RoundType = 'all' | 'pistol' | 'eco' | 'buy';
export type Side = 'CT' | 'TERRORIST';
export type DefaultKey = `${number}-${number}-${number}-${'pistol' | 'eco' | 'buy'}`;

export type Team = {
    name: string,
    id: UUID,
}

export type TeamTStat = {
    name: string,
    avg_time: number,
    trwp: number,
    deaths: number,
    planted: number,
    t_save: number,
}

export type TeamDefault = {
    map_name: string,
    side: 'CT' | 'TERRORIST' | null,
    num_a: number,
    num_mid: number,
    num_b: number,
    ct_win: number,
    rounds: number,
    num_plants: number,
    avg_plant_time: number,
}
