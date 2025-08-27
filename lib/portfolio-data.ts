"use client"

export interface PersonalInfo {
  name: string
  title: string
  bio: string
  email: string
  phone?: string
  location?: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
}

export interface Skill {
  id: string
  name: string
  category: "backend" | "frontend" | "database" | "tools" | "ai"
  proficiency: number // 1-100
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  imageUrl?: string
  featured: boolean
  status: "completed" | "in-progress" | "planned"
}

export interface AboutHighlight {
  id: string
  icon: string
  title: string
  description: string
}

export interface PortfolioData {
  personalInfo: PersonalInfo
  socialLinks: SocialLink[]
  skills: Skill[]
  projects: Project[]
  aboutHighlights: AboutHighlight[]
}

const STORAGE_KEY = "portfolio_data"

const defaultPortfolioData: PortfolioData = {
  personalInfo: {
    name: "Shami Honore",
    title: "Python/Django Developer & AI Enthusiast",
    bio: "Crafting scalable web applications with Python/Django and building innovative AI-powered solutions that transform ideas into reality",
    email: "shami.honore@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
  },
  socialLinks: [
    { id: "1", platform: "GitHub", url: "https://github.com/shamihonore", icon: "Github" },
    { id: "2", platform: "LinkedIn", url: "https://linkedin.com/in/shamihonore", icon: "Linkedin" },
    { id: "3", platform: "Twitter", url: "https://twitter.com/shamihonore", icon: "Twitter" },
  ],
  skills: [
    { id: "1", name: "Python", category: "backend", proficiency: 95 },
    { id: "2", name: "Django", category: "backend", proficiency: 90 },
    { id: "3", name: "FastAPI", category: "backend", proficiency: 85 },
    { id: "4", name: "PostgreSQL", category: "database", proficiency: 88 },
    { id: "5", name: "React", category: "frontend", proficiency: 75 },
    { id: "6", name: "TypeScript", category: "frontend", proficiency: 80 },
    { id: "7", name: "Docker", category: "tools", proficiency: 85 },
    { id: "8", name: "AWS", category: "tools", proficiency: 78 },
    { id: "9", name: "Machine Learning", category: "ai", proficiency: 70 },
  ],
  projects: [
    {
      id: "1",
      title: "E-commerce API Platform",
      description:
        "Scalable Django REST API with payment integration, inventory management, and real-time notifications",
      technologies: ["Django", "PostgreSQL", "Redis", "Celery", "Stripe API"],
      liveUrl: "https://ecommerce-api.example.com",
      githubUrl: "https://github.com/shamihonore/ecommerce-api",
      featured: true,
      status: "completed",
    },
    {
      id: "2",
      title: "AI Chat Application",
      description: "Real-time chat app with AI-powered message suggestions and sentiment analysis",
      technologies: ["FastAPI", "WebSockets", "OpenAI API", "React", "MongoDB"],
      liveUrl: "https://ai-chat.example.com",
      githubUrl: "https://github.com/shamihonore/ai-chat",
      featured: true,
      status: "completed",
    },
    {
      id: "3",
      title: "Portfolio Analytics Dashboard",
      description: "Analytics dashboard for tracking portfolio performance with interactive charts",
      technologies: ["Django", "Chart.js", "PostgreSQL", "Bootstrap"],
      githubUrl: "https://github.com/shamihonore/portfolio-analytics",
      featured: false,
      status: "in-progress",
    },
  ],
  aboutHighlights: [
    {
      id: "1",
      icon: "Code",
      title: "Backend Development",
      description: "Expert in Python, Django, and FastAPI for building robust web applications",
    },
    {
      id: "2",
      icon: "Database",
      title: "E-commerce APIs",
      description: "Specialized in creating scalable e-commerce platforms and payment integrations",
    },
    {
      id: "3",
      icon: "Brain",
      title: "AI Integration",
      description: "Passionate about incorporating AI features into web applications",
    },
    {
      id: "4",
      icon: "Zap",
      title: "Real-time Apps",
      description: "Experience with WebSockets and real-time chat applications",
    },
  ],
}

export class PortfolioService {
  static getData(): PortfolioData {
    if (typeof window === "undefined") return defaultPortfolioData
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...defaultPortfolioData, ...JSON.parse(stored) } : defaultPortfolioData
  }

  static saveData(data: PortfolioData): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  static updatePersonalInfo(info: PersonalInfo): void {
    const data = this.getData()
    data.personalInfo = info
    this.saveData(data)
  }

  static updateSocialLinks(links: SocialLink[]): void {
    const data = this.getData()
    data.socialLinks = links
    this.saveData(data)
  }

  static updateSkills(skills: Skill[]): void {
    const data = this.getData()
    data.skills = skills
    this.saveData(data)
  }

  static updateProjects(projects: Project[]): void {
    const data = this.getData()
    data.projects = projects
    this.saveData(data)
  }

  static updateAboutHighlights(highlights: AboutHighlight[]): void {
    const data = this.getData()
    data.aboutHighlights = highlights
    this.saveData(data)
  }
}
