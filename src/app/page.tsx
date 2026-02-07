import PlayerStatsPage from "@/features/player-stats";
import { getTournaments } from "@/lib/services";

export default async function Home() {
  const tournaments = await getTournaments();
  const tournamentNames = tournaments.map(t => t.name);

  if (tournamentNames.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p>No tournaments available. Please add tournament data to the database.</p>
      </div>
    );
  }

  return <PlayerStatsPage tournaments={tournamentNames} />;
}
