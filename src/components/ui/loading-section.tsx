import { Spinner } from "./spinner"
import { cn } from "@/lib/utils"

type LoadingSectionProps = {
  className?: string
  message?: string
}

export function LoadingSection({ className, message }: LoadingSectionProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[200px] bg-gray-50/80 rounded-lg",
        className
      )}
    >
      <Spinner className="size-8 text-gray-400" />
      {message && (
        <p className="mt-3 text-sm text-gray-500">{message}</p>
      )}
    </div>
  )
}
