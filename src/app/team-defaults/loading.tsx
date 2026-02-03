import { LoadingSection } from "@/components/ui/loading-section"

export default function Loading() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="h-10 w-48 bg-gray-100 rounded animate-pulse" />
      </div>
      <LoadingSection className="h-[500px]" message="Loading team defaults..." />
    </div>
  )
}
