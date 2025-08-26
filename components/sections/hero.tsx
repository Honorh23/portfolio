import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, Mail, Brain, Sparkles, Code, Zap } from "lucide-react"

export function Hero() {
  return (
    <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="mb-6">
            <h1 className="text-5xl sm:text-7xl font-bold mb-4">
              Hi, I'm <span className="text-gradient animate-gradient">Shami Honore</span>
            </h1>
            <div className="flex justify-center items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
              <Code className="h-4 w-4 text-primary" />
              <span>Backend Developer</span>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <Zap className="h-4 w-4 text-accent" />
              <span>AI Enthusiast</span>
            </div>
          </div>

          <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Crafting scalable web applications with <span className="text-primary font-semibold">Python/Django</span>{" "}
            and building innovative <span className="text-accent font-semibold">AI-powered solutions</span> that
            transform ideas into reality
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <a href="#contact">
                <Mail className="h-4 w-4 mr-2" />
                Get In Touch
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gradient hover:bg-primary/5 transition-all duration-300 bg-transparent"
              asChild
            >
              <a href="#projects">
                <Github className="h-4 w-4 mr-2" />
                View Projects
              </a>
            </Button>
          </div>

          <div className="glass rounded-2xl p-8 mb-12 border-gradient max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-accent animate-pulse" />
              <p className="text-lg font-semibold text-gradient">Experience AI-Powered Features</p>
              <Sparkles className="h-5 w-5 text-primary animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>
            <p className="text-muted-foreground mb-6">
              Discover how AI can enhance your experience with personalized interview preparation and interactive
              portfolio tours
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="secondary"
                size="lg"
                asChild
                className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 hover:border-primary/40 transition-all duration-300 transform hover:scale-105"
              >
                <a href="/ai/interview">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Interview Prep
                </a>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                asChild
                className="bg-accent/10 hover:bg-accent/20 text-accent border-accent/20 hover:border-accent/40 transition-all duration-300 transform hover:scale-105"
              >
                <a href="/ai/tour">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Portfolio Tour
                </a>
              </Button>
            </div>
          </div>

          <div className="flex justify-center space-x-8 mb-16">
            <a
              href="https://github.com/shamihonore"
              className="group p-3 rounded-full bg-card hover:bg-primary/10 transition-all duration-300 transform hover:scale-110"
            >
              <Github className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="https://linkedin.com/in/shamihonore"
              className="group p-3 rounded-full bg-card hover:bg-primary/10 transition-all duration-300 transform hover:scale-110"
            >
              <Linkedin className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="mailto:shami.honore@example.com"
              className="group p-3 rounded-full bg-card hover:bg-primary/10 transition-all duration-300 transform hover:scale-110"
            >
              <Mail className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-2 p-4 rounded-full bg-card/50 backdrop-blur-sm">
            <span className="text-xs font-medium text-muted-foreground">Scroll to explore</span>
            <ArrowDown className="h-5 w-5 text-primary animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}
