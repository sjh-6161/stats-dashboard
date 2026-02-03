import { LoadingSection } from "@/components/ui/loading-section"

export default function Loading() {
  return (
    <div className="p-4">
      <div className="h-8 w-64 bg-gray-100 rounded animate-pulse mb-4" />
      <div className="h-5 w-96 bg-gray-100 rounded animate-pulse mb-4" />
      <LoadingSection className="h-[500px]" message="Loading player position stats..." />
    </div>
  )
}
