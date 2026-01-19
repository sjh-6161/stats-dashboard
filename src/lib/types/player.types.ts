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
