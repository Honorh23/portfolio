"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Play, Pause, Volume2, VolumeX, User, Code, Brain, FileText, Mail, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateTourScript } from "@/lib/api"

interface TourSection {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

interface TourResponse {
  script: string
  audio_url?: string
}

export function AITourGuide() {
  const [selectedSection, setSelectedSection] = useState<string>("home")
  const [isLoading, setIsLoading] = useState(false)
  const [tourScript, setTourScript] = useState<string>("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { toast } = useToast()

  const tourSections: TourSection[] = [
    {
      id: "home",
      title: "Welcome & Introduction",
      icon: User,
      description: "Get introduced to Shami and his expertise in Python/Django development",
    },
    {
      id: "projects",
      title: "Featured Projects",
      icon: Code,
      description: "Explore key projects including e-commerce platforms and AI integrations",
    },
    {
      id: "skills",
      title: "Technical Skills",
      icon: Brain,
      description: "Discover technical expertise in backend development and AI technologies",
    },
    {
      id: "blog",
      title: "Blog & Insights",
      icon: FileText,
      description: "Learn about technical blog posts and development insights",
    },
    {
      id: "contact",
      title: "Get In Touch",
      icon: Mail,
      description: "Find out how to connect and collaborate on projects",
    },
  ]

  const handleSectionSelect = async (sectionId: string) => {
    setSelectedSection(sectionId)
    setIsLoading(true)
    setTourScript("")

    try {
      const response = await generateTourScript({ section: sectionId })
      setTourScript(response.script)

      // If audio URL is provided, load it
      if (response.audio_url && audioRef.current) {
        audioRef.current.src = response.audio_url
      }

      toast({
        title: "Tour Script Generated",
        description: `AI guide is ready to introduce the ${sectionId} section!`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate tour script. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    } else {
      // Fallback: Use Web Speech API for text-to-speech
      if ("speechSynthesis" in window) {
        if (isPlaying) {
          window.speechSynthesis.cancel()
          setIsPlaying(false)
        } else {
          const utterance = new SpeechSynthesisUtterance(tourScript)
          utterance.rate = 0.9
          utterance.pitch = 1
          utterance.volume = isMuted ? 0 : 1

          utterance.onstart = () => setIsPlaying(true)
          utterance.onend = () => setIsPlaying(false)
          utterance.onerror = () => setIsPlaying(false)

          window.speechSynthesis.speak(utterance)
        }
      }
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  const currentSection = tourSections.find((section) => section.id === selectedSection)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          <Sparkles className="h-8 w-8 text-primary inline-block mr-2" />
          AI Portfolio Tour Guide
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Let our AI guide introduce you to different sections of the portfolio with personalized explanations and
          insights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Choose a Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tourSections.map((section) => {
                const Icon = section.icon
                return (
                  <Button
                    key={section.id}
                    variant={selectedSection === section.id ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => handleSectionSelect(section.id)}
                    disabled={isLoading}
                  >
                    <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{section.description}</div>
                    </div>
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* AI Guide Interface */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  AI Tour Guide
                </span>
                {currentSection && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {currentSection.title}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Avatar Section */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/30">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Shami's AI Guide</h3>
                <p className="text-sm text-muted-foreground">Your personal portfolio assistant</p>
              </div>

              {/* Tour Script Display */}
              <div className="bg-muted/50 rounded-lg p-4 mb-4 min-h-[200px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Generating tour script...</span>
                  </div>
                ) : tourScript ? (
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-primary">AI Guide says:</span>
                    </div>
                    <p className="text-foreground leading-relaxed">{tourScript}</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a section to get started with your personalized tour</p>
                  </div>
                )}
              </div>

              {/* Audio Controls */}
              {tourScript && (
                <div className="flex items-center justify-center space-x-4">
                  <Button variant="outline" size="sm" onClick={handlePlayPause} disabled={isLoading}>
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? "Pause" : "Play Audio"}
                  </Button>

                  <Button variant="ghost" size="sm" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
              )}

              {/* Hidden audio element for future TTS integration */}
              <audio
                ref={audioRef}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                style={{ display: "none" }}
              />
            </CardContent>
          </Card>

          {/* Quick Navigation */}
          {tourScript && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/#about">
                      <User className="h-4 w-4 mr-2" />
                      View About
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/#projects">
                      <Code className="h-4 w-4 mr-2" />
                      See Projects
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/#contact">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Me
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
