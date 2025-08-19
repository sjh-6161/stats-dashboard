'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Dispatch, SetStateAction } from 'react';
import { Team } from '../lib/definitions';
import { Switch } from '@/components/ui/switch';
import { ComponentLabel } from '@/components/ui/label';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Filters({
    time,
    setTime,
    showGrenades,
    setShowGrenades,
    showKills,
    setShowKills,
    setShowPlants,
    setShowTrajectories,
    setOnlyAwp,
    teams,
}: {
    time: number,
    setTime: Dispatch<SetStateAction<number>>,
    showGrenades: boolean,
    setShowGrenades: Dispatch<SetStateAction<boolean>>,
    showKills: boolean,
    setShowKills: Dispatch<SetStateAction<boolean>>,
    setShowPlants: Dispatch<SetStateAction<boolean>>,
    setShowTrajectories: Dispatch<SetStateAction<boolean>>,
    setOnlyAwp: Dispatch<SetStateAction<boolean>>,
    teams: Team[]
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const current_map = searchParams.get("map_name")
    const current_side = searchParams.get("side")
    const current_team = searchParams.get("team")

    function handleFilterChange(key: string, value: string) {
        const params = new URLSearchParams(searchParams); // Create a mutable copy
        params.set(key, value); // Set or update a parameter
        // params.delete(key); // To remove a parameter
        // params.append(key, value); // To add multiple values for the same key

        router.push(`${pathname}?${params.toString()}`); // Update the URL
        // router.replace(`${pathname}?${params.toString()}`); // Use replace to avoid adding to history
    };

    return (
        <div className="h-full w-full">
            <div className="m-2 text-2xl">Filters</div>
            <div className='flex flex-row'>
                <div className="m-2">
                    <Select value={current_team || ""} onValueChange={(team) => handleFilterChange("team", team)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Team" />
                        </SelectTrigger>
                        <SelectContent>
                            {teams.map((team, i) => (<SelectItem value={team.name} key={i}>{team.name}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="m-2">
                    <Select value={current_map || ""} onValueChange={(mapname) => handleFilterChange("map_name", mapname)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Map" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="de_ancient">Ancient</SelectItem>
                            <SelectItem value="de_mirage">Mirage</SelectItem>
                            <SelectItem value="de_dust2">Dust 2</SelectItem>
                            <SelectItem value="de_nuke">Nuke</SelectItem>
                            <SelectItem value="de_train">Train</SelectItem>
                            <SelectItem value="de_overpass">Overpass</SelectItem>
                            <SelectItem value="de_inferno">Inferno</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="m-2">
                    <Select value={current_side || ""} onValueChange={(side) => handleFilterChange("side", side)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Side" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="TERRORIST">T</SelectItem>
                            <SelectItem value="CT">CT</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='m-2'>
                <div className='flex items-center space-x-2 my-2'>
                    <Switch id="grenades" onCheckedChange={() => (setShowGrenades(prev => !prev))} defaultChecked={true}/>
                    <ComponentLabel htmlFor="grenades">Grenades</ComponentLabel>
                </div>
                <div className='flex items-center space-x-2 my-2'>
                    <Switch id="killsdeaths" onCheckedChange={() => (setShowKills(prev => !prev))} defaultChecked={true}/>
                    <ComponentLabel htmlFor="killsdeaths">Kills / Deaths</ComponentLabel>
                </div>
                <div className='flex items-center space-x-2 my-2'>
                    <Switch id="bombplants" onCheckedChange={() => (setShowPlants(prev => !prev))} defaultChecked={true}/>
                    <ComponentLabel htmlFor="bombplants">Bomb Plants</ComponentLabel>
                </div>
            </div>
            <div className='m-2 mt-5 flex flex-row'>
                <div>{time.toFixed(1)} Seconds into Round</div>
                <Slider onValueChange={(val) => (setTime(val[0]))} className="w-1/2 ml-5" defaultValue={[15]} max={100} step={0.1} />
            </div>
            {showGrenades && <div className='m-2 rounded-md border p-2 pt-1 text-sm shadow-xs'>
                <div className='mb-1'>Grenade Filters</div>
                <Tabs defaultValue="all" className=''>
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="smoke">Smokes</TabsTrigger>
                        <TabsTrigger value="he">HE Grenades</TabsTrigger>
                        <TabsTrigger value="molotov">Molotovs</TabsTrigger>
                        <TabsTrigger value="flash">Flashes</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>}
            {showKills && <div className='m-2 rounded-md border p-2 pt-1 pl-3 text-sm shadow-xs'>
                <div>Duel Filters</div>
                <div className='flex items-center space-x-2 my-2'>
                    <Switch id="showtraj" onCheckedChange={() => (setShowTrajectories(prev => !prev))} defaultChecked={true}/>
                    <ComponentLabel htmlFor="showtraj">Show Trajectories</ComponentLabel>
                </div>
                <Tabs defaultValue="all" className=''>
                    <TabsList>
                        <TabsTrigger value="all" onClick={() => setOnlyAwp(false)}>All</TabsTrigger>
                        <TabsTrigger value="awp" onClick={() => setOnlyAwp(true)}>Awp Kills / Deaths</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>}
        </div>
    )
}