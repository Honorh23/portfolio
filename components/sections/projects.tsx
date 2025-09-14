import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, ExternalLink } from "lucide-react"

export function Projects() {
  const projects = [
    {
      title: "Blog App with User Features",
      description:
        "A full-featured blog application built with Django and React. Includes user authentication, post creation, commenting system, and admin dashboard.",
      technologies: ["Python", "Django", "React", "PostgreSQL", "Tailwind CSS"],
      featured: true,
      githubUrl: "#",
      liveUrl: "#",
    },
    {
      title: "Mini E-commerce App with Analytics",
      description:
        "E-commerce platform with product catalog, shopping cart, payment integration, and comprehensive analytics dashboard.",
      technologies: ["Django", "DRF", "React", "Stripe API"],
      featured: true,
      githubUrl: "#",
      liveUrl: "#",
    },
    {
      title: "Online Grocery Store with Chat",
      description:
        "Full-stack grocery store application with real-time chat support, order management, and inventory tracking.",
      technologies: ["Django", "WebSockets", "PostgreSQL"],
      featured: true,
      githubUrl: "#",
      liveUrl: "#",
    },
    {
      title: "Accountability App Prototype",
      description:
        "Mobile-first web application for goal tracking and accountability partnerships with progress tracking and notifications.",
      technologies: ["FastAPI", "React Native", "SQLite"],
      featured: false,
      githubUrl: "#",
      liveUrl: "#",
    },
  ]

  return (
    <section id="projects" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Featured Projects</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Here are some of my key projects showcasing my expertise in backend development, e-commerce solutions, and
            AI integrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl font-semibold text-foreground">{project.title}</CardTitle>
                  {project.featured && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Featured
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    Code
                  </Button>
                  {/* <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </Button> */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
