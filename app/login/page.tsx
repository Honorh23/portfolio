"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/journal")
    }
  }, [isAuthenticated, router])

  const handleLoginSuccess = () => {
    router.push("/journal")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
      <LoginForm onSuccess={handleLoginSuccess} />
    </div>
  )
}
