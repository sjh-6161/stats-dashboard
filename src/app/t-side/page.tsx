import TSideStatsPage from "@/features/tside-stats";
import { getTournaments } from "@/lib/services";

export default async function TSideRoute() {
  const tournaments = await getTournaments();
  const tournamentNames = tournaments.map(t => t.name);

  if (tournamentNames.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p>No tournaments available.</p>
      </div>
    );
  }

  return <TSideStatsPage tournaments={tournamentNames} />;
}
