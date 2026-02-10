'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type UnifiedNavigationProps = {
  tournaments: string[];
};

export function UnifiedNavigation({ tournaments }: UnifiedNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTournament = searchParams.get('tournament');

  const handleTournamentChange = (tournament: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tournament', tournament);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full bg-neutral-100 border-b border-neutral-200">
      <div className="p-3 flex items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/"
                className={`px-4 py-2 rounded-md transition-colors ${
                  pathname === '/'
                    ? 'bg-neutral-200 font-semibold'
                    : 'hover:bg-neutral-150'
                }`}
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {tournaments.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-700">Tournament:</span>
            <Select
              value={selectedTournament || tournaments[0]}
              onValueChange={handleTournamentChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select tournament" />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map((tournament) => (
                  <SelectItem key={tournament} value={tournament}>
                    {tournament}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
