"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, ExternalLink, Github } from "lucide-react"
import type { PortfolioData, Project } from "@/lib/portfolio-data"

interface ProjectsFormProps {
  data: PortfolioData
  onChange: (data: PortfolioData) => void
}

export function ProjectsForm({ data, onChange }: ProjectsFormProps) {
  const [projects, setProjects] = useState(data.projects)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    onChange({
      ...data,
      projects,
    })
  }, [projects])

  const handleCreateProject = (projectData: Omit<Project, "id">) => {
    const newProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
    }
    setProjects((prev) => [newProject, ...prev])
    setShowForm(false)
  }

  const handleUpdateProject = (projectData: Omit<Project, "id">) => {
    if (!editingProject) return
    setProjects((prev) =>
      prev.map((project) => (project.id === editingProject.id ? { ...projectData, id: editingProject.id } : project)),
    )
    setEditingProject(null)
  }

  const handleDeleteProject = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects((prev) => prev.filter((project) => project.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Project Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Projects ({projects.length})</h3>
        <Button onClick={() => setShowForm(true)} className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Project Form */}
      {(showForm || editingProject) && (
        <ProjectForm
          project={editingProject}
          onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
          onCancel={() => {
            setShowForm(false)
            setEditingProject(null)
          }}
        />
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="border-gradient">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    {project.featured && (
                      <Badge className="bg-primary/10 text-primary border-primary/20">Featured</Badge>
                    )}
                    <Badge
                      className={
                        project.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : project.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }
                    >
                      {project.status.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <Github className="h-3 w-3" />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingProject(project)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {projects.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">💼</div>
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">Add your first project to showcase your work</p>
              <Button onClick={() => setShowForm(true)} className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add First Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

interface ProjectFormProps {
  project?: Project | null
  onSubmit: (project: Omit<Project, "id">) => void
  onCancel: () => void
}

function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    technologies: project?.technologies.join(", ") || "",
    liveUrl: project?.liveUrl || "",
    githubUrl: project?.githubUrl || "",
    imageUrl: project?.imageUrl || "",
    featured: project?.featured || false,
    status: project?.status || "completed",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title: formData.title,
      description: formData.description,
      technologies: formData.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
      liveUrl: formData.liveUrl || undefined,
      githubUrl: formData.githubUrl || undefined,
      imageUrl: formData.imageUrl || undefined,
      featured: formData.featured,
      status: formData.status as Project["status"],
    })
  }

  return (
    <Card className="border-gradient">
      <CardHeader>
        <CardTitle>{project ? "Edit Project" : "Add New Project"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="My Awesome Project"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the project..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input
              id="technologies"
              value={formData.technologies}
              onChange={(e) => setFormData((prev) => ({ ...prev, technologies: e.target.value }))}
              placeholder="React, Node.js, MongoDB, etc."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liveUrl">Live URL (Optional)</Label>
              <Input
                id="liveUrl"
                value={formData.liveUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, liveUrl: e.target.value }))}
                placeholder="https://myproject.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL (Optional)</Label>
              <Input
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
            />
            <Label htmlFor="featured">Featured Project</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-gradient-primary">
              {project ? "Update Project" : "Add Project"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
