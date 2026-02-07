import { KDPlots } from "@/components/map-visualization";
import { getTournaments } from "@/lib/services";

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

  return <KDPlots tournament={tournament} />;
}
