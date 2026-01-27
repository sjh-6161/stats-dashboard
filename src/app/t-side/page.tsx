import TSideStatsPage from "@/features/tside-stats";
import { getTournaments } from "@/lib/services";

type PageProps = {
  searchParams: Promise<{ tournament?: string }>;
};

export default async function TSideRoute({ searchParams }: PageProps) {
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

  return <TSideStatsPage tournament={tournament} />;
}
