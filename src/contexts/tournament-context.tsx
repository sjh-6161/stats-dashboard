'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface TournamentContextType {
  selectedTournament: string | null;
  setSelectedTournament: (tournament: string | null) => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);

  return (
    <TournamentContext.Provider value={{ selectedTournament, setSelectedTournament }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
}
