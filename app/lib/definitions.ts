import { UUID } from "crypto";

export type KDStat = {
    steam_id: string,
    name: string,
    kills: number,
    deaths: number,
    assists: number,
    rounds: number,
    kd: number,
    kr: number,
    dr: number,
    ar: number,
}

export type WPAStat = {
    steam_id: string,
    name: string,
    kd: number, 
    diffr: number,
    totr: number,
    rounds: number,
}

export type TeamTStat = {
    name: string,
    avg_time: number, 
    trwp: number, 
    deaths: number,
    planted: number, 
    t_save: number,
}

export type MapGrenade = {
    steamid: string,
    team: 'CT' | 'TERRORIST',
    grenade_type: string,
    start_x: number,
    start_y: number,
    start_z: number,
    end_x: number,
    end_y: number,
    end_z: number,
    start_time: number,
    end_time: number,
}

export type MapKill = {
    attacker_steamid: string | null,
    victim_steamid: string,
    attacker_team: 'CT' | 'TERRORIST'| null,
    victim_team: 'CT' | 'TERRORIST',
    attacker_this_team: boolean | null,
    victim_this_team: boolean,
    weapon: string,
    time: number,
    attacker_x: number | null,
    attacker_y: number | null,
    attacker_z: number | null,
    victim_x: number,
    victim_y: number,
    victim_z: number,
}

export type Team = {
    name: string,
    id: UUID,
}