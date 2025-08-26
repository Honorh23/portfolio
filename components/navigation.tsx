"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Code, Brain, User, Mail, LogIn, LogOut, BookOpen, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LoginDialog } from "@/components/auth/login-dialog"
import { useAuth } from "@/lib/auth"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()

  const publicNavItems = [
    { href: "#about", label: "About", icon: User },
    { href: "#projects", label: "Projects", icon: Code },
    { href: "#skills", label: "Skills", icon: Brain },
    { href: "#contact", label: "Contact", icon: Mail },
  ]

  const protectedNavItems = [
    { href: "/journal", label: "Journal", icon: BookOpen, requiresAuth: true, showAlways: true },
    ...(isAuthenticated ? [{ href: "/admin", label: "Admin", icon: Settings, requiresAuth: true }] : []),
  ]

  const aiNavItems = [{ href: "/ai/interview", label: "AI Interview Prep", icon: Brain }]

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const handleProtectedClick = (e: React.MouseEvent, item: any) => {
    if (item.requiresAuth && !isAuthenticated) {
      e.preventDefault()
      setShowLoginDialog(true)
    }
  }

  return (
    <>
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="text-xl font-bold text-primary">
                Shami Honore
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {publicNavItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.label}
                  </a>
                ))}

                {aiNavItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.label}
                  </a>
                ))}

                {protectedNavItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    onClick={(e) => handleProtectedClick(e, item)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Theme Toggle, Auth & Mobile Menu Button */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />

              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Welcome, {user?.username}</span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setShowLoginDialog(true)} className="hidden md:flex">
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
              )}

              <div className="md:hidden">
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
                {publicNavItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className="text-foreground hover:text-primary flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </a>
                  )
                })}

                {aiNavItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className="text-foreground hover:text-primary flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </a>
                  )
                })}

                <div className="border-t border-border pt-2 mt-2">
                  <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Account
                  </p>
                  {protectedNavItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        className="text-foreground hover:text-primary flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors"
                        onClick={(e) => {
                          handleProtectedClick(e, item)
                          if (!item.requiresAuth || isAuthenticated) {
                            setIsOpen(false)
                          }
                        }}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </a>
                    )
                  })}
                </div>

                <div className="border-t border-border pt-2 mt-2">
                  {isAuthenticated ? (
                    <div className="px-3 py-2">
                      <p className="text-sm text-muted-foreground mb-2">Welcome, {user?.username}</p>
                      <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowLoginDialog(true)
                        setIsOpen(false)
                      }}
                      className="text-foreground hover:text-primary flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </>
  )
}
