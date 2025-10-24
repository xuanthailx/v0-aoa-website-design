"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { UserRole } from "@/lib/types"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("developer")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [authMode, setAuthMode] = useState<"password" | "magic-link">("password")
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password, role)
      router.push("/chat")
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      })

      if (!response.ok) throw new Error("Failed to send magic link")
      setMagicLinkSent(true)
    } catch (err) {
      setError("Failed to send magic link. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSSO = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })

      if (!response.ok) throw new Error("Google SSO failed")
      const data = await response.json()
      window.location.href = data.authUrl
    } catch (err) {
      setError("Google SSO failed. Please try again.")
      setIsLoading(false)
    }
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">O</span>
            </div>
            <span className="font-bold text-lg text-foreground">OnboardAI</span>
          </div>

          <Card className="border border-border">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>We've sent a magic link to {email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click the link in your email to sign in. The link will expire in 24 hours.
              </p>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setMagicLinkSent(false)
                  setEmail("")
                }}
              >
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">O</span>
          </div>
          <span className="font-bold text-lg text-foreground">OnboardAI</span>
        </div>

        <Card className="border border-border">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your OnboardAI account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-6 border-b border-border">
              <button
                onClick={() => setAuthMode("password")}
                className={`pb-2 px-2 text-sm font-medium transition ${
                  authMode === "password"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Password
              </button>
              <button
                onClick={() => setAuthMode("magic-link")}
                className={`pb-2 px-2 text-sm font-medium transition ${
                  authMode === "magic-link"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Magic Link
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={authMode === "password" ? handlePasswordSubmit : handleMagicLinkSubmit}
            >
              {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-input border-border"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {authMode === "password" && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="bg-input border-border"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="text-right">
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium text-foreground">
                  Role
                </label>
                <select
                  id="role"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <option value="developer">Developer</option>
                  <option value="document_manager">Document Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <Button className="w-full" disabled={isLoading}>
                {isLoading
                  ? authMode === "password"
                    ? "Signing in..."
                    : "Sending link..."
                  : authMode === "password"
                    ? "Sign In"
                    : "Send Magic Link"}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={handleGoogleSSO}
                disabled={isLoading}
              >
                Continue with Google
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link href="/" className="hover:text-foreground transition">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
