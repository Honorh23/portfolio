"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Database, Brain, Zap, Sparkles, ArrowRight } from "lucide-react"
import { SecretaryDialog } from "@/components/ai/secretary-dialog"

export function About() {
  const [openSecretary, setOpenSecretary] = useState(false)
  const highlights = [
    {
      icon: Code,
      title: "Backend Development",
      description: "Expert in Python, Django, and FastAPI for building robust web applications",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Database,
      title: "E-commerce APIs",
      description: "Specialized in creating scalable e-commerce platforms and payment integrations",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Brain,
      title: "AI Integration",
      description: "Passionate about incorporating AI features into web applications",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Real-time Apps",
      description: "Experience with WebSockets and real-time chat applications",
      gradient: "from-orange-500 to-red-500",
    },
  ]

  return (
    <section
      id="about"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-8 shadow-lg">
            <Code className="h-10 w-10 text-white" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-gradient mb-6">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed">
            I'm a passionate Python/Django backend developer with a strong focus on building scalable web applications
            and exploring AI integrations. My experience spans e-commerce platforms, real-time chat systems, and
            innovative AI-powered features.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 group"
              asChild
            >
              <a href="/ai/tour">
                <Sparkles className="h-5 w-5 mr-2 group-hover:animate-spin" />
                Get an AI-guided tour of my work
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="glass border-gradient hover:bg-primary/5 bg-transparent"
              asChild
            >
              <a href="#projects">
                View My Projects
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </Button>

            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-foreground hover:bg-white/90 shadow"
              onClick={() => setOpenSecretary(true)}
            >
              Chat with AI Secretary
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon
            return (
              <Card
                key={index}
                className="glass border-gradient hover:shadow-glow transition-all duration-500 hover:scale-105 group"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${highlight.gradient} rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {highlight.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{highlight.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient mb-2">3+</div>
            <p className="text-muted-foreground">Years Experience</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient mb-2">50+</div>
            <p className="text-muted-foreground">Projects Completed</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient mb-2">100%</div>
            <p className="text-muted-foreground">Client Satisfaction</p>
          </div>
        </div>

        {/* Featured video */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-2">Featured Video</h3>
            <p className="text-muted-foreground">A quick look at my work and approach</p>
          </div>
          <Card className="glass border-gradient overflow-hidden hover:shadow-glow transition-shadow">
            <CardContent className="p-0">
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/toAsio0iMRw"
                  title="YouTube video player"
                  frameBorder={0}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <SecretaryDialog open={openSecretary} onOpenChange={setOpenSecretary} />
    </section>
  )
}
