// Security utility functions

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function sanitizeInput(input: string): string {
  // Basic HTML sanitization
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

export function checkHoneypot(honeypotValue: string): boolean {
  // Honeypot should be empty for legitimate users
  return honeypotValue.trim() === ""
}

export function validateFormData(data: {
  name: string
  email: string
  message: string
  website?: string
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Required fields
  if (!data.name.trim()) {
    errors.push("Name is required")
  }

  if (!data.email.trim()) {
    errors.push("Email is required")
  } else if (!validateEmail(data.email)) {
    errors.push("Invalid email format")
  }

  if (!data.message.trim()) {
    errors.push("Message is required")
  }

  // Check honeypot
  if (data.website && !checkHoneypot(data.website)) {
    errors.push("Spam detected")
  }

  // Length validations
  if (data.name.length > 100) {
    errors.push("Name is too long")
  }

  if (data.message.length > 2000) {
    errors.push("Message is too long")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Rate limiting helper (client-side)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map()

  canAttempt(key: string, maxAttempts = 5, windowMs = 60000): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(key) || []

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter((time) => now - time < windowMs)

    if (recentAttempts.length >= maxAttempts) {
      return false
    }

    // Add current attempt
    recentAttempts.push(now)
    this.attempts.set(key, recentAttempts)

    return true
  }

  getRemainingTime(key: string, windowMs = 60000): number {
    const attempts = this.attempts.get(key) || []
    if (attempts.length === 0) return 0

    const oldestAttempt = Math.min(...attempts)
    const remainingTime = windowMs - (Date.now() - oldestAttempt)

    return Math.max(0, remainingTime)
  }
}
