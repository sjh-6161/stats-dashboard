"use server"

import { getPlayerKDStats, getPlayerPositionStats, getTeams, getTeamBuyDefaults, getTeamPistolDefaults, getTeamRoundStats, getTeamTSideStats, getTeamMapPlayerPositions, getTournaments, getSeasons, getStages } from "./services";
import { getMapKills, getMapPlants, getMapGrenades } from "./services/maps.service";

export async function fetchTournaments() {
    const tournaments = await getTournaments();
    return tournaments.map(t => t.name);
}

export async function fetchSeasons(tournament: string) {
    const seasons = await getSeasons(tournament);
    return seasons.map(s => s.season);
}

export async function fetchStages(tournament: string, season: number) {
    const stages = await getStages(tournament, season);
    return stages.map(s => s.stage);
}

export async function fetchPlayerStats(tournament: string, season: number, stage: string) {
    return getPlayerKDStats(tournament, season, stage);
}

export async function fetchPlayerPositionData(tournament: string, season: number, stage: string, team?: string) {
    const teams = await getTeams();
    const teamFilter = team && team !== "all" ? team : undefined;
    const [ctStats, tStats] = await Promise.all([
        getPlayerPositionStats(tournament, season, stage, 'CT', teamFilter),
        getPlayerPositionStats(tournament, season, stage, 'TERRORIST', teamFilter)
    ]);
    return { teams, ctStats, tStats };
}

export async function fetchTeamDefaultsData(tournament: string, season: number, stage: string, team?: string) {
    const teams = await getTeams();
    const buy_defaults = await getTeamBuyDefaults(team || null, 20000, 500000, tournament, season, stage);
    const eco_defaults = await getTeamBuyDefaults(team || null, 0, 10000, tournament, season, stage);
    const pistol_defaults = await getTeamPistolDefaults(team || null, tournament, season, stage);
    return { teams, buy_defaults, eco_defaults, pistol_defaults };
}

export async function fetchTeamPageData(tournament: string, season: number, stage: string, team?: string) {
    const teams = await getTeams();
    const roundStats = team ? await getTeamRoundStats(team, tournament, season, stage) : [];
    const buy_defaults = team ? await getTeamBuyDefaults(team, 20000, 500000, tournament, season, stage) : [];
    const eco_defaults = team ? await getTeamBuyDefaults(team, 0, 10000, tournament, season, stage) : [];
    const pistol_defaults = team ? await getTeamPistolDefaults(team, tournament, season, stage) : [];
    const plants = team ? await getMapPlants(team, tournament, season, stage) : [];
    const duels = team ? await getMapKills(team, tournament, season, stage) : [];
    const grenades = team ? await getMapGrenades(team, tournament, season, stage) : [];
    const playerPositions = team ? await getTeamMapPlayerPositions(team, tournament, season, stage) : [];
    return { teams, roundStats, buy_defaults, eco_defaults, pistol_defaults, plants, duels, grenades, playerPositions };
}

export async function fetchTSideStats(tournament: string, season: number, stage: string) {
    return getTeamTSideStats(tournament, season, stage);
}
