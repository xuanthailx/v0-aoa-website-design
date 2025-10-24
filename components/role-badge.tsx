"use client"

import { getRoleColor, getRoleDisplayName } from "@/lib/rbac"
import type { UserRole } from "@/lib/types"

interface RoleBadgeProps {
  role: UserRole
  size?: "sm" | "md" | "lg"
}

export function RoleBadge({ role, size = "md" }: RoleBadgeProps) {
  const displayName = getRoleDisplayName(role)
  const colorClass = getRoleColor(role)

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  }

  return (
    <span className={`inline-flex items-center rounded-full font-medium text-white ${colorClass} ${sizeClasses[size]}`}>
      {displayName}
    </span>
  )
}
