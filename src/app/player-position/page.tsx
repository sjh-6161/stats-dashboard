import PlayerPositionPage from "@/features/player-position";
import { getTournaments } from "@/lib/services";

type PageProps = {
  searchParams: Promise<{ tournament?: string; positionTeam?: string }>;
};

export default async function PlayerPositionRoute({ searchParams }: PageProps) {
  const params = await searchParams;
  const tournaments = await getTournaments();
  const tournament = params.tournament || tournaments[0]?.name || '';

  if (!tournament) {
    return (
      <div className="flex items-center justify-center">
        <p>No tournaments available.</p>
      </div>
    );
  }

  return <PlayerPositionPage tournament={tournament} team={params.positionTeam} />;
}
