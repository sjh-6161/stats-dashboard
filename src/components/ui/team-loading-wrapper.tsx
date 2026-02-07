"use client"

import { createContext, useContext, useTransition, type ReactNode } from "react"
import { Spinner } from "./spinner"

type TeamLoadingContextType = {
  isPending: boolean
  startTransition: (callback: () => void) => void
}

const TeamLoadingContext = createContext<TeamLoadingContextType | null>(null)

export function useTeamLoading() {
  const context = useContext(TeamLoadingContext)
  if (!context) {
    throw new Error("useTeamLoading must be used within TeamLoadingWrapper")
  }
  return context
}

export function useOptionalTeamLoading() {
  return useContext(TeamLoadingContext)
}

type TeamLoadingWrapperProps = {
  children: ReactNode
}

export function TeamLoadingWrapper({ children }: TeamLoadingWrapperProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <TeamLoadingContext.Provider value={{ isPending, startTransition }}>
      <div className="relative">
        {children}
        {isPending && (
          <div className="absolute inset-0 top-14 bg-gray-100/70 flex items-center justify-center rounded-lg z-10">
            <div className="flex flex-col items-center gap-2">
              <Spinner className="size-8 text-gray-500" />
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </TeamLoadingContext.Provider>
  )
}
