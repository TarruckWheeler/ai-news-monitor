import { cn } from "../../lib/utils"
export const Badge = ({ children, variant = "default", className = "", ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-900",
    outline: "border border-gray-200",
    destructive: "bg-red-100 text-red-900",
    secondary: "bg-gray-100 text-gray-900",
  }
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", variants[variant], className)} {...props}>{children}</span>
}
