import { LoadingSection } from "@/components/ui/loading-section"

export default function Loading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-4">
      <LoadingSection className="h-full" message="Loading T-side stats..." />
      <LoadingSection className="h-full" message="Loading chart..." />
    </div>
  )
}
