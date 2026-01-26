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

// Player position stats - uses dynamic keys based on map names
// Keys will be in format: {mapShortName}_{position} (e.g., mirage_a, mirage_mid, mirage_b)
export type PlayerPositionStat = {
    steam_id: string,
    name: string,
    [key: string]: string | number, // Dynamic map position keys
}
