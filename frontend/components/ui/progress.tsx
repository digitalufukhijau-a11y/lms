import * as React from "react"
import { cn } from "@/lib/utils"

const heights = {
  thin: "h-1",
  default: "h-2",
  thick: "h-2.5",
} as const

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  showPercentage?: boolean
  size?: keyof typeof heights
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ 
  className, 
  value = 0,
  max = 100,
  showPercentage = false,
  size = "default",
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className="w-full space-y-1">
      <div
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-surface-2",
          heights[size],
          className
        )}
        {...props}
      >
        <div
          className="h-full bg-brand-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-xs text-ink-600 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }
