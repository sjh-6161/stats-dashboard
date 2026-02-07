"use server"

import { getPlayerKDStats, getPlayerPositionStats, getTeams, getTeamBuyDefaults, getTeamPistolDefaults, getTeamRoundStats, getTeamTSideStats, getTournaments } from "./services";
import { getMapKills, getMapPlants } from "./services/maps.service";

export async function fetchTournaments() {
    const tournaments = await getTournaments();
    return tournaments.map(t => t.name);
}

export async function fetchPlayerStats(tournament: string) {
    return getPlayerKDStats(tournament);
}

export async function fetchPlayerPositionData(tournament: string, team?: string) {
    const teams = await getTeams();
    const teamFilter = team && team !== "all" ? team : undefined;
    const [ctStats, tStats] = await Promise.all([
        getPlayerPositionStats(tournament, 'CT', teamFilter),
        getPlayerPositionStats(tournament, 'TERRORIST', teamFilter)
    ]);
    return { teams, ctStats, tStats };
}

export async function fetchTeamDefaultsData(tournament: string, team?: string) {
    const teams = await getTeams();
    const buy_defaults = await getTeamBuyDefaults(team || null, 20000, 500000, tournament);
    const eco_defaults = await getTeamBuyDefaults(team || null, 0, 10000, tournament);
    const pistol_defaults = await getTeamPistolDefaults(team || null, tournament);
    return { teams, buy_defaults, eco_defaults, pistol_defaults };
}

export async function fetchTeamPageData(tournament: string, team?: string) {
    const teams = await getTeams();
    const roundStats = team ? await getTeamRoundStats(team, tournament) : [];
    const buy_defaults = team ? await getTeamBuyDefaults(team, 20000, 500000, tournament) : [];
    const eco_defaults = team ? await getTeamBuyDefaults(team, 0, 10000, tournament) : [];
    const pistol_defaults = team ? await getTeamPistolDefaults(team, tournament) : [];
    const plants = team ? await getMapPlants(team, tournament) : [];
    const duels = team ? await getMapKills(team, tournament) : [];
    return { teams, roundStats, buy_defaults, eco_defaults, pistol_defaults, plants, duels };
}

export async function fetchTSideStats(tournament: string) {
    return getTeamTSideStats(tournament);
}
