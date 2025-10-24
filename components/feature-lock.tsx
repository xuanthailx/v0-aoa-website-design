"use client"

import type React from "react"

import { Lock } from "lucide-react"
import type { UserRole } from "@/lib/types"
import { getRoleDisplayName } from "@/lib/rbac"

interface FeatureLockProps {
  requiredRole: UserRole
  userRole?: UserRole | null
  children?: React.ReactNode
}

export function FeatureLock({ requiredRole, userRole, children }: FeatureLockProps) {
  const isLocked = !userRole || userRole !== requiredRole

  if (!isLocked) {
    return <>{children}</>
  }

  return (
    <div className="flex items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-muted/50">
      <div className="text-center">
        <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm font-medium text-foreground">
          This feature requires {getRoleDisplayName(requiredRole)} role
        </p>
        <p className="text-xs text-muted-foreground mt-1">Contact your administrator to upgrade your access</p>
      </div>
    </div>
  )
}
