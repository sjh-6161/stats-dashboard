'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

  // Optimistic tab state for instant visual feedback
  const [activeTab, setActiveTab] = useState(pathname);

  // Sync with actual pathname when navigation completes
  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  const selectedTournament = searchParams.get('tournament') || tournaments[0] || '';

  const buildTabUrl = (path: string) => {
    const params = new URLSearchParams();
    if (selectedTournament) {
      params.set('tournament', selectedTournament);
    }
    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value); // Instant visual update
    router.push(buildTabUrl(value));
  };

  const handleTournamentChange = (tournament: string) => {
    const params = new URLSearchParams();
    params.set('tournament', tournament);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-row items-center justify-between w-full">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList variant="line">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.path}
              value={tab.path}
              variant="line"
              disabled={tab.disabled}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

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
