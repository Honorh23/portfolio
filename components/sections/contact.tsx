"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { submitContactForm } from "@/lib/api"

// Cloudflare Turnstile component
declare global {
  interface Window {
    turnstile: {
      render: (element: string | HTMLElement, options: any) => string
      reset: (widgetId?: string) => void
      getResponse: (widgetId?: string) => string
    }
  }
}

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // Honeypot field
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    // Check honeypot
    if (formData.website.trim() !== "") {
      toast({
        title: "Spam Detected",
        description: "Your submission was flagged as spam.",
        variant: "destructive",
      })
      return
    }

    // Get Turnstile token
    let token = ""
    if (typeof window !== "undefined" && window.turnstile) {
      token = window.turnstile.getResponse()
      if (!token) {
        toast({
          title: "CAPTCHA Required",
          description: "Please complete the CAPTCHA verification.",
          variant: "destructive",
        })
        return
      }
    }

    setIsSubmitting(true)

    try {
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        message: `Subject: ${formData.subject}\n\n${formData.message}`,
        website: formData.website,
        turnstile_token: token,
      })

      setIsSubmitted(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        website: "",
      })

      // Reset Turnstile
      if (typeof window !== "undefined" && window.turnstile) {
        window.turnstile.reset()
      }

      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you soon!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Get In Touch</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            I'm always interested in discussing new opportunities, collaborations, or just having a chat about
            technology and AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Email</h3>
                <p className="text-muted-foreground">shami.honore@example.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Location</h3>
                <p className="text-muted-foreground">Available for remote work</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Response Time</h3>
                <p className="text-muted-foreground">Usually within 24 hours</p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-8">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-primary mb-1">Secure Contact Form</h4>
                  <p className="text-xs text-muted-foreground">
                    This form is protected by CAPTCHA and anti-spam measures to ensure secure communication.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {isSubmitted ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    Message Sent Successfully!
                  </>
                ) : (
                  "Send a Message"
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Thank you for reaching out!</h3>
                  <p className="text-muted-foreground mb-4">
                    Your message has been sent successfully. I'll get back to you within 24 hours.
                  </p>
                  <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Input
                        name="name"
                        placeholder="Your Name *"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Your Email *"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <Input
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <Textarea
                    name="message"
                    placeholder="Your Message *"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />

                  {/* Honeypot field - hidden from users */}
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Cloudflare Turnstile CAPTCHA */}
                  <div className="flex justify-center">
                    <TurnstileWidget onVerify={setTurnstileToken} />
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    * Required fields. Your information is secure and will not be shared.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

// Turnstile Widget Component
function TurnstileWidget({ onVerify }: { onVerify: (token: string) => void }) {
  const [isLoaded, setIsLoaded] = useState(false)

  React.useEffect(() => {
    // Load Turnstile script
    if (typeof window !== "undefined" && !window.turnstile) {
      const script = document.createElement("script")
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
      script.async = true
      script.defer = true
      script.onload = () => setIsLoaded(true)
      document.head.appendChild(script)
    } else if (window.turnstile) {
      setIsLoaded(true)
    }
  }, [])

  React.useEffect(() => {
    if (isLoaded && typeof window !== "undefined" && window.turnstile) {
      const widgetId = window.turnstile.render("#turnstile-widget", {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA", // Test key
        callback: onVerify,
        "error-callback": () => {
          console.error("Turnstile error")
        },
        theme: "light",
        size: "normal",
      })

      return () => {
        if (window.turnstile) {
          window.turnstile.reset(widgetId)
        }
      }
    }
  }, [isLoaded, onVerify])

  return (
    <div className="flex flex-col items-center space-y-2">
      <div id="turnstile-widget" className="min-h-[65px] flex items-center justify-center">
        {!isLoaded && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading security verification...</span>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground text-center">Protected by Cloudflare Turnstile</p>
    </div>
  )
}
