import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WeaponPerformanceTable from "@/features/weapon-performance";
import PlayerStatsPage from "@/features/player-stats";
import TSideStatsPage from "@/features/tside-stats";
import { Map, KDPlots } from "@/components/map-visualization";
import TeamDefaultsPage from "@/features/team-defaults";
import PlayerPositionPage from "@/features/player-position";
import { getTournaments } from "@/lib/services";

type HomeProps = {
  searchParams: Promise<{ tournament?: string; team?: string; positionTeam?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const tournaments = await getTournaments();
  const tournament = params.tournament || tournaments[0]?.name || '';

  if (!tournament) {
    return (
      <div className="p-5 flex items-center justify-center">
        <p>No tournaments available. Please add tournament data to the database.</p>
      </div>
    );
  }

  return (
    <div className="p-5 font-[family-name:var(--font-geist-sans)] h-full">
      <main className="w-full h-full">
        <Tabs defaultValue="basic" className="w-full h-full">
            <div className="flex flex-row">
                <TabsList>
                    <TabsTrigger value="basic">Player</TabsTrigger>
                    <TabsTrigger value="wpa">WPA</TabsTrigger>
                    <TabsTrigger value="test">Test</TabsTrigger>
                </TabsList>
                <TabsList className="ml-6">
                    <TabsTrigger value="team">Team</TabsTrigger>
                    <TabsTrigger value="teamdefaults">Team Defaults</TabsTrigger>
                    <TabsTrigger value="t_side">T Side</TabsTrigger>
                    <TabsTrigger value="player_position">Player Position</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="basic"><PlayerStatsPage tournament={tournament} /></TabsContent>
            <TabsContent value="wpa"><div className="grid grid-cols-1 lg:grid-cols-2"><WeaponPerformanceTable /></div></TabsContent>
            <TabsContent value="test"><KDPlots tournament={tournament} /></TabsContent>
            <TabsContent value="team"></TabsContent>
            <TabsContent value="teamdefaults"><TeamDefaultsPage tournament={tournament} team={params.team} /></TabsContent>
            <TabsContent value="t_side"><TSideStatsPage tournament={tournament} /></TabsContent>
            <TabsContent value="player_position"><PlayerPositionPage tournament={tournament} team={params.positionTeam} /></TabsContent>
        </Tabs>

        {/*  */}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
