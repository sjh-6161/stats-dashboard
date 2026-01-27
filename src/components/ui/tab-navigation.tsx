'use client';

import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Tab = {
  path: string;
  label: string;
};

const tabs: Tab[][] = [
  [
    { path: '/', label: 'Player' },
    { path: '/wpa', label: 'WPA' },
    { path: '/test', label: 'Test' },
  ],
  [
    { path: '/team', label: 'Team' },
    { path: '/team-defaults', label: 'Team Defaults' },
    { path: '/t-side', label: 'T Side' },
    { path: '/player-position', label: 'Player Position' },
  ],
];

type TabNavigationProps = {
  tournaments: string[];
};

export function TabNavigation({ tournaments }: TabNavigationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedTournament = searchParams.get('tournament') || tournaments[0] || '';

  const buildTabUrl = (path: string) => {
    const params = new URLSearchParams();
    if (selectedTournament) {
      params.set('tournament', selectedTournament);
    }
    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
  };

  const handleTournamentChange = (tournament: string) => {
    const params = new URLSearchParams();
    params.set('tournament', tournament);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div className="flex flex-row gap-6">
        {tabs.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
          >
            {group.map((tab) => (
              <Link
                key={tab.path}
                href={buildTabUrl(tab.path)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  pathname === tab.path
                    ? 'bg-background text-foreground shadow'
                    : 'hover:bg-background/50'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {tournaments.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-700">Tournament:</span>
          <Select
            value={selectedTournament}
            onValueChange={handleTournamentChange}
          >
            <SelectTrigger className="w-[300px]">
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
  );
}
