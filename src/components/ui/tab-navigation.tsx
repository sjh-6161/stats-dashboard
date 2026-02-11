'use client';

import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname } from 'next/navigation';

type Tab = {
  path: string;
  label: string;
  disabled?: boolean;
};

const tabs: Tab[] = [
  { path: '/', label: 'Player' },
  { path: '/team', label: 'Team' },
  { path: '/team-defaults', label: 'Team Defaults' },
  { path: '/player-position', label: 'Player Position' },
  { path: '/wpa', label: 'WPA', disabled: true },
  { path: '/test', label: 'Test', disabled: true },
  { path: '/t-side', label: 'T Side', disabled: true },
];

export function TabNavigation() {
  const pathname = usePathname();

  return (
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
              <Link href={tab.path} prefetch={true}>
                {tab.label}
              </Link>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
