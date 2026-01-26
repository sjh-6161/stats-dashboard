// Active duty maps configuration
// Update this list when the CS2 active duty map pool changes

export const ACTIVE_DUTY_MAPS = [
    "de_mirage",
    "de_dust2",
    "de_nuke",
    "de_anubis",
    "de_ancient",
    "de_inferno",
    "de_overpass"
] as const;

export type ActiveDutyMap = typeof ACTIVE_DUTY_MAPS[number];

export const MAP_DISPLAY_NAMES: Record<ActiveDutyMap, string> = {
    "de_mirage": "Mirage",
    "de_dust2": "Dust 2",
    "de_nuke": "Nuke",
    "de_anubis": "Anubis",
    "de_ancient": "Ancient",
    "de_inferno": "Inferno",
    "de_overpass": "Overpass"
};
