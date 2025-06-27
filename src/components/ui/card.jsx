import { cn } from "../../lib/utils"

export const Card = ({ children, className = "", ...props }) => (
  <div className={cn("rounded-lg border bg-white shadow", className)} {...props}>{children}</div>
)

export const CardHeader = ({ children, className = "", ...props }) => (
  <div className={cn("p-6 pb-3", className)} {...props}>{children}</div>
)

export const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={cn("text-xl font-semibold", className)} {...props}>{children}</h3>
)

export const CardDescription = ({ children, className = "", ...props }) => (
  <p className={cn("text-sm text-gray-600", className)} {...props}>{children}</p>
)

export const CardContent = ({ children, className = "", ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props}>{children}</div>
)
