"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogIn, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/auth"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(username, password)
      if (success) {
        onOpenChange(false)
        setUsername("")
        setPassword("")
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-white border-2 border-gray-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <LogIn className="h-5 w-5 text-emerald-600" />
            Login Required
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Please log in to access this feature. Enter your credentials below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-900">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={isLoading}
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-900">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className="pr-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
