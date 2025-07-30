import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WPATable from "./ui/wpatable/wpatable";
import { KDPage } from "./ui/kdpage/kdpage";
import { TeamTPage } from "./ui/tsidepage/tsidepage";
import { Map } from "@/components/radarmap/map";
import { KDPlots } from "@/components/radarmap/kd-plots";

export default function Home() {
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
                    <TabsTrigger value="t_side">T Side</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="basic"><KDPage/></TabsContent>
            <TabsContent value="wpa"><div className="grid grid-cols-1 lg:grid-cols-2"><WPATable /></div></TabsContent>
            <TabsContent value="test"><KDPlots/></TabsContent>
            <TabsContent value="team"></TabsContent>
            <TabsContent value="t_side"><TeamTPage/></TabsContent>
        </Tabs>
        
        {/*  */}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
