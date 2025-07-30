import { Map } from "./map";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { FetchMapKills } from "@/app/lib/data";

export async function KDPlots() {
    // const [map_name, set_map_name] = useState("de_inferno")

    const kills = await FetchMapKills({mapName: "de_inferno"})

    return (
        <div className="grid grid-cols-2 h-full w-full">
            <div className="max-h-[90vh] items-center self-center text-center bg-red-200">
                <Map mapName={"de_inferno"} data={kills}/>
            </div>
            <div className="w-full h-full bg-green-200 p-2">
                <Tabs defaultValue="de_inferno">
                    <TabsList>
                        <TabsTrigger value="de_inferno">Inferno</TabsTrigger>
                        <TabsTrigger value="de_mirage">Mirage</TabsTrigger>
                        <TabsTrigger value="de_dust2">Dust 2</TabsTrigger>
                        <TabsTrigger value="de_anubis">Anubis</TabsTrigger>
                        <TabsTrigger value="de_nuke">Nuke</TabsTrigger>
                        <TabsTrigger value="de_ancient">Ancient</TabsTrigger>
                        <TabsTrigger value="de_train">Train</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
    )
    
}