'use client';

import { useTransition } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"

type Tab = {
  path: string;
  label: string;
  disabled?: boolean;
};

const tabs: Tab[] = [
  { path: '/', label: 'Player' },
  { path: '/wpa', label: 'WPA', disabled: true },
  { path: '/test', label: 'Test', disabled: true },
  { path: '/team', label: 'Team' },
  { path: '/team-defaults', label: 'Team Defaults' },
  { path: '/t-side', label: 'T Side', disabled: true },
  { path: '/player-position', label: 'Player Position' },
];

type TabNavigationProps = {
  tournaments: string[];
};

export function TabNavigation({ tournaments }: TabNavigationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const selectedTournament = searchParams.get('tournament') || tournaments[0] || '';

  const buildTabUrl = (path: string) => {
    const params = new URLSearchParams();
    if (selectedTournament) {
      params.set('tournament', selectedTournament);
    }
    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
  };

  const handleTabClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    startTransition(() => {
      router.push(buildTabUrl(path));
    });
  };

  const handleTournamentChange = (tournament: string) => {
    const params = new URLSearchParams();
    params.set('tournament', tournament);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <Tabs value={pathname}>
          <TabsList variant="line">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.path}
                value={tab.path}
                variant="line"
                disabled={tab.disabled}
                asChild={!tab.disabled}
              >
                {tab.disabled ? (
                  tab.label
                ) : (
                  <Link
                    href={buildTabUrl(tab.path)}
                    prefetch={true}
                    onClick={(e) => handleTabClick(e, tab.path)}
                  >
                    {tab.label}
                  </Link>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {isPending && <Spinner className="h-4 w-4" />}
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
