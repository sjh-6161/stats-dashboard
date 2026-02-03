import { LoadingSection } from "@/components/ui/loading-section"

export default function Loading() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="h-10 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 w-48 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
      <LoadingSection className="h-[400px]" message="Loading team data..." />
    </div>
  )
}
