
import * as React from "react"
import { cn } from "@/lib/utils"

export interface CustomProgressProps 
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  indicatorClassName?: string
}

const CustomProgress = React.forwardRef<
  HTMLDivElement,
  CustomProgressProps
>(({ className, value = 0, indicatorClassName, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <div
      className={cn(
        "h-full w-full flex-1 bg-primary transition-all",
        indicatorClassName
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
))

CustomProgress.displayName = "CustomProgress"

export { CustomProgress }
