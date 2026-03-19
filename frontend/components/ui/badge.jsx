import * as React from "react"
import { cn } from "@/lib/utils"

const badgeVariants = {
  success: "bg-[#DCFCE7] text-[#15803D]",
  warning: "bg-[#FEF3C7] text-[#92400E]",
  danger: "bg-[#FEE2E2] text-[#B91C1C]",
  info: "bg-[#DBEAFE] text-[#1D4ED8]",
  brand: "bg-[#E8F7EE] text-[#0F7A3D]",
  accent: "bg-[#EEF2FF] text-[#4338CA]",
  neutral: "bg-surface-2 text-ink-600",
}

const Badge = React.forwardRef(({ 
  className, 
  variant = "neutral",
  ...props 
}, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded px-2 py-1 text-xs font-medium",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
