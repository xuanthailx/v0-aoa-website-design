"use client"

import { useAuth } from "@/lib/auth-context"
import { canAccessPage } from "@/lib/rbac"
import type { ProtectedRouteProps } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function ProtectedRoute({ requiredRoles, children, fallback }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!canAccessPage(user?.role || null, requiredRoles)) {
      router.push("/access-denied")
    }
  }, [isAuthenticated, isLoading, user?.role, requiredRoles, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || null
  }

  if (!canAccessPage(user?.role || null, requiredRoles)) {
    return fallback || null
  }

  return <>{children}</>
}
