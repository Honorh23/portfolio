"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, User, Briefcase, Code, Info, Save, RotateCcw } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navigation } from "@/components/navigation"
import { PortfolioService, type PortfolioData } from "@/lib/portfolio-data"
import { PersonalInfoForm } from "@/components/admin/personal-info-form"
import { ProjectsForm } from "@/components/admin/projects-form"
import { SkillsForm } from "@/components/admin/skills-form"
import { AboutForm } from "@/components/admin/about-form"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const { toast } = useToast()

  useEffect(() => {
    setPortfolioData(PortfolioService.getData())
  }, [])

  const handleDataChange = (newData: PortfolioData) => {
    setPortfolioData(newData)
    setHasChanges(true)
  }

  const handleSave = () => {
    if (portfolioData) {
      PortfolioService.saveData(portfolioData)
      setHasChanges(false)
      toast({
        title: "Success",
        description: "Portfolio data saved successfully!",
      })
    }
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all changes? This cannot be undone.")) {
      setPortfolioData(PortfolioService.getData())
      setHasChanges(false)
      toast({
        title: "Reset Complete",
        description: "All changes have been reset to the last saved version.",
      })
    }
  }

  if (!portfolioData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading admin panel...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <Navigation />

        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-6">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gradient mb-4">Portfolio Admin</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Manage your portfolio content, projects, skills, and personal information
              </p>
            </div>

            {/* Save/Reset Controls */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                {hasChanges && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  >
                    Unsaved Changes
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Changes
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>

            {/* Admin Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Projects
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Skills
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  About
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <Card className="glass border-gradient">
                  <CardHeader>
                    <CardTitle className="text-gradient">Personal Information</CardTitle>
                    <CardDescription>Update your basic information and contact details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PersonalInfoForm data={portfolioData} onChange={handleDataChange} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                <Card className="glass border-gradient">
                  <CardHeader>
                    <CardTitle className="text-gradient">Projects</CardTitle>
                    <CardDescription>Manage your portfolio projects and showcase your work</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProjectsForm data={portfolioData} onChange={handleDataChange} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                <Card className="glass border-gradient">
                  <CardHeader>
                    <CardTitle className="text-gradient">Skills</CardTitle>
                    <CardDescription>Update your technical skills and proficiency levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SkillsForm data={portfolioData} onChange={handleDataChange} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about" className="space-y-6">
                <Card className="glass border-gradient">
                  <CardHeader>
                    <CardTitle className="text-gradient">About Section</CardTitle>
                    <CardDescription>Customize the highlights and content in your about section</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AboutForm data={portfolioData} onChange={handleDataChange} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
