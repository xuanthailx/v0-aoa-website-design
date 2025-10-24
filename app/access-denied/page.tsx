"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AccessDeniedPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>

        {user && (
          <div className="bg-muted p-4 rounded-lg mb-6 text-left">
            <p className="text-sm text-muted-foreground mb-1">Your current role:</p>
            <p className="text-sm font-medium text-foreground capitalize">{user.role}</p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/chat">Go to Chat</Link>
          </Button>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          If you believe this is an error, please contact your administrator.
        </p>
      </div>
    </div>
  )
}
