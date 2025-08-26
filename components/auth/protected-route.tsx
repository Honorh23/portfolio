"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/lib/auth"
import { LoginForm } from "./login-form"

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background">
        {fallback || <LoginForm />}
      </div>
    )
  }

  return <>{children}</>
}
