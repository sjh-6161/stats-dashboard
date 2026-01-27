import TeamDefaultsPage from "@/features/team-defaults";
import { getTournaments } from "@/lib/services";

type PageProps = {
  searchParams: Promise<{ tournament?: string; team?: string }>;
};

export default async function TeamDefaultsRoute({ searchParams }: PageProps) {
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

  return <TeamDefaultsPage tournament={tournament} team={params.team} />;
}
