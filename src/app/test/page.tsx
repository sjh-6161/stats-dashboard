import { KDPlots } from "@/components/map-visualization";
import { getTournaments, getSeasons, getStages } from "@/lib/services";

export default async function TestPage() {
  const tournaments = await getTournaments();
  const tournament = tournaments[0]?.name || '';

  if (!tournament) {
    return (
      <div className="flex items-center justify-center">
        <p>No tournaments available.</p>
      </div>
    );
  }

  const seasons = await getSeasons(tournament);
  const season = seasons[0]?.season;
  if (!season) {
    return (
      <div className="flex items-center justify-center">
        <p>No seasons available.</p>
      </div>
    );
  }

  const stages = await getStages(tournament, season);
  const stage = stages[0]?.stage || '';

  return <KDPlots tournament={tournament} season={season} stage={stage} />;
}
