import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

export interface EmptyStateProps {
  icon?: LucideIcon
  title?: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ 
  icon: Icon,
  title,
  description,
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-ink-400" />
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-ink-900 mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-ink-600 max-w-md mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  )
}
