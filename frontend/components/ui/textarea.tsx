import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ 
  className, 
  error,
  ...props 
}, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-lg border bg-surface-0 px-3 py-2 text-base resize-y",
        "placeholder:text-ink-400",
        "focus:outline-none focus:ring-2 focus:ring-brand-50 focus:border-brand-500",
        "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-400",
        "transition-colors duration-150",
        error && "border-danger-500 focus:ring-danger-500/20 focus:border-danger-500",
        !error && "border-border",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
