"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  MessageSquare,
} from "lucide-react"

interface SectionInfo {
  id: string
  name: string
  description: string
  speech: string
  tips: string[]
}

const sectionData: SectionInfo[] = [
  {
    id: "hero",
    name: "Hero Section",
    description: "Welcome to Shami's portfolio! This is where first impressions are made.",
    speech:
      "Welcome to Shami Honore's portfolio! I'm your AI tour guide, and I'm excited to show you around. This hero section introduces Shami as a passionate Python Django backend developer and AI enthusiast. Notice the beautiful gradient design and the call-to-action buttons that invite you to explore the AI-powered features. The floating background elements add a modern, dynamic feel to the page.",
    tips: [
      "The gradient text effect makes the name stand out",
      "AI feature buttons showcase the portfolio's unique capabilities",
      "Clean, professional design with modern animations",
    ],
  },
  {
    id: "about",
    name: "About Section",
    description: "Learn about Shami's background, experience, and passion for technology.",
    speech:
      "Now we're in the About section, where you can learn about Shami's journey as a developer. This section highlights his expertise in Python, Django, and AI technologies. The layout is clean and professional, making it easy to understand his background and skills. Notice how the content is structured to tell a compelling story about his experience and passion for building scalable web applications.",
    tips: [
      "Personal story creates connection with visitors",
      "Technical expertise is clearly highlighted",
      "Professional yet approachable tone",
    ],
  },
  {
    id: "projects",
    name: "Projects Section",
    description: "Explore Shami's portfolio of impressive projects and technical achievements.",
    speech:
      "Welcome to the Projects section! This is where Shami showcases his technical expertise through real-world applications. Each project card displays the technologies used, key features, and links to live demos or repositories. The cards have beautiful hover effects and are organized to highlight the most impressive work first. This section demonstrates practical application of his skills in Python, Django, and various modern technologies.",
    tips: [
      "Project cards show both technical skills and creativity",
      "Live demo links provide immediate value to visitors",
      "Technology badges help recruiters quickly assess skills",
    ],
  },
  {
    id: "skills",
    name: "Skills Section",
    description: "Discover Shami's technical expertise and proficiency levels.",
    speech:
      "Here in the Skills section, you can see a comprehensive overview of Shami's technical abilities. The skills are organized by category - backend development, frontend technologies, databases, and tools. Each skill shows proficiency levels, giving you a clear understanding of his expertise. The visual representation makes it easy to quickly assess his technical stack and identify areas of specialization.",
    tips: [
      "Categorized skills make it easy to find relevant expertise",
      "Proficiency levels provide honest assessment",
      "Covers full-stack capabilities despite backend focus",
    ],
  },
  {
    id: "contact",
    name: "Contact Section",
    description: "Connect with Shami through the secure contact form and social links.",
    speech:
      "Finally, we've reached the Contact section! This is where potential clients and employers can get in touch with Shami. The contact form includes security features like CAPTCHA protection and honeypot spam prevention. You'll also find links to his social profiles and professional networks. The form is designed to be user-friendly while maintaining high security standards.",
    tips: [
      "Secure contact form protects against spam",
      "Multiple contact options provide flexibility",
      "Professional presentation encourages legitimate inquiries",
    ],
  },
]

export function ScrollAITour() {
  const [isActive, setIsActive] = useState(false)
  const [currentSection, setCurrentSection] = useState<string>("hero")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [hasSpokenSection, setHasSpokenSection] = useState<Set<string>>(new Set())
  const [isMinimized, setIsMinimized] = useState(false)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const currentSectionData = sectionData.find((section) => section.id === currentSection)

  // Initialize intersection observer for scroll detection
  useEffect(() => {
    if (!isActive) return

    const sections = ["hero", "about", "projects", "skills", "contact"]
    const sectionElements = sections
      .map((id) => document.getElementById(id) || document.querySelector(`[data-section="${id}"]`))
      .filter(Boolean)

    if (sectionElements.length === 0) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const sectionId = entry.target.id || entry.target.getAttribute("data-section") || "hero"
            setCurrentSection(sectionId)
          }
        })
      },
      {
        threshold: [0.3, 0.5, 0.7],
        rootMargin: "-20% 0px -20% 0px",
      },
    )

    sectionElements.forEach((element) => {
      if (element) observerRef.current?.observe(element)
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [isActive])

  // Auto-speak when entering new section
  useEffect(() => {
    if (!isActive || !isAudioEnabled || !currentSectionData) return

    // Only speak if we haven't spoken about this section yet
    if (!hasSpokenSection.has(currentSection)) {
      speakText(currentSectionData.speech)
      setHasSpokenSection((prev) => new Set([...prev, currentSection]))
    }
  }, [currentSection, isActive, isAudioEnabled, currentSectionData, hasSpokenSection])

  const speakText = useCallback(
    (text: string) => {
      if (!isAudioEnabled) return

      // Stop any current speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      speechRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [isAudioEnabled],
  )

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  const startTour = () => {
    setIsActive(true)
    setHasSpokenSection(new Set())
    setIsMinimized(false)
    // Scroll to top to start tour
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const stopTour = () => {
    setIsActive(false)
    stopSpeaking()
    observerRef.current?.disconnect()
  }

  const toggleAudio = () => {
    if (isAudioEnabled) {
      stopSpeaking()
    }
    setIsAudioEnabled(!isAudioEnabled)
  }

  const resetTour = () => {
    setHasSpokenSection(new Set())
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId) || document.querySelector(`[data-section="${sectionId}"]`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  if (!isActive) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={startTour}
          className="bg-gradient-primary hover:shadow-glow transition-all duration-300 rounded-full p-4 shadow-lg"
          size="lg"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Start AI Tour
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="glass border-gradient shadow-2xl max-w-sm animate-float">
        <CardContent className="p-4">
          {!isMinimized ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gradient">AI Tour Guide</h3>
                    <p className="text-xs text-muted-foreground">Exploring: {currentSectionData?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)}>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={stopTour}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Current Section Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/10 text-primary border-primary/20">{currentSectionData?.name}</Badge>
                  {isSpeaking && (
                    <Badge className="bg-accent/10 text-accent border-accent/20 animate-pulse">Speaking...</Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{currentSectionData?.description}</p>

                {/* Tips */}
                {currentSectionData?.tips && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground">Key Highlights:</p>
                    <ul className="space-y-1">
                      {currentSectionData.tips.slice(0, 2).map((tip, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-start">
                          <span className="text-primary mr-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleAudio}
                    className={isAudioEnabled ? "text-primary" : "text-muted-foreground"}
                  >
                    {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakText(currentSectionData?.speech || "")}
                    disabled={!isAudioEnabled}
                  >
                    {isSpeaking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={resetTour}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakText(currentSectionData?.speech || "")}
                  className="text-xs"
                  disabled={!isAudioEnabled}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Repeat
                </Button>
              </div>

              {/* Section Navigation */}
              <div className="grid grid-cols-5 gap-1">
                {sectionData.map((section) => (
                  <Button
                    key={section.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollToSection(section.id)}
                    className={`text-xs p-1 h-8 ${
                      currentSection === section.id
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "hover:bg-muted"
                    }`}
                  >
                    {section.name.split(" ")[0]}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            /* Minimized View */
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs font-medium text-gradient">AI Tour</span>
                {isSpeaking && <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setIsMinimized(false)}>
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={stopTour}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
