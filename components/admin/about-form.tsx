"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Code, Database, Brain, Zap, Globe, Smartphone } from "lucide-react"
import type { PortfolioData, AboutHighlight } from "@/lib/portfolio-data"

interface AboutFormProps {
  data: PortfolioData
  onChange: (data: PortfolioData) => void
}

const iconOptions = [
  { value: "Code", label: "Code", icon: Code },
  { value: "Database", label: "Database", icon: Database },
  { value: "Brain", label: "Brain", icon: Brain },
  { value: "Zap", label: "Zap", icon: Zap },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "Smartphone", label: "Smartphone", icon: Smartphone },
]

export function AboutForm({ data, onChange }: AboutFormProps) {
  const [highlights, setHighlights] = useState(data.aboutHighlights)
  const [editingHighlight, setEditingHighlight] = useState<AboutHighlight | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    onChange({
      ...data,
      aboutHighlights: highlights,
    })
  }, [highlights])

  const handleCreateHighlight = (highlightData: Omit<AboutHighlight, "id">) => {
    const newHighlight: AboutHighlight = {
      ...highlightData,
      id: crypto.randomUUID(),
    }
    setHighlights((prev) => [...prev, newHighlight])
    setShowForm(false)
  }

  const handleUpdateHighlight = (highlightData: Omit<AboutHighlight, "id">) => {
    if (!editingHighlight) return
    setHighlights((prev) =>
      prev.map((highlight) =>
        highlight.id === editingHighlight.id ? { ...highlightData, id: editingHighlight.id } : highlight,
      ),
    )
    setEditingHighlight(null)
  }

  const handleDeleteHighlight = (id: string) => {
    if (confirm("Are you sure you want to delete this highlight?")) {
      setHighlights((prev) => prev.filter((highlight) => highlight.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Highlight Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">About Highlights ({highlights.length})</h3>
        <Button onClick={() => setShowForm(true)} className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Highlight
        </Button>
      </div>

      {/* Highlight Form */}
      {(showForm || editingHighlight) && (
        <HighlightForm
          highlight={editingHighlight}
          onSubmit={editingHighlight ? handleUpdateHighlight : handleCreateHighlight}
          onCancel={() => {
            setShowForm(false)
            setEditingHighlight(null)
          }}
        />
      )}

      {/* Highlights List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {highlights.map((highlight) => {
          const IconComponent = iconOptions.find((option) => option.value === highlight.icon)?.icon || Code
          return (
            <Card key={highlight.id} className="border-gradient">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditingHighlight(highlight)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteHighlight(highlight.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{highlight.title}</h3>
                <p className="text-sm text-muted-foreground">{highlight.description}</p>
              </CardContent>
            </Card>
          )
        })}

        {highlights.length === 0 && (
          <Card className="md:col-span-2 text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-2">No highlights yet</h3>
              <p className="text-muted-foreground mb-4">Add highlights to showcase your key strengths</p>
              <Button onClick={() => setShowForm(true)} className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add First Highlight
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

interface HighlightFormProps {
  highlight?: AboutHighlight | null
  onSubmit: (highlight: Omit<AboutHighlight, "id">) => void
  onCancel: () => void
}

function HighlightForm({ highlight, onSubmit, onCancel }: HighlightFormProps) {
  const [formData, setFormData] = useState({
    icon: highlight?.icon || "Code",
    title: highlight?.title || "",
    description: highlight?.description || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      icon: formData.icon,
      title: formData.title,
      description: formData.description,
    })
  }

  const selectedIcon = iconOptions.find((option) => option.value === formData.icon)
  const IconComponent = selectedIcon?.icon || Code

  return (
    <Card className="border-gradient">
      <CardHeader>
        <CardTitle>{highlight ? "Edit Highlight" : "Add New Highlight"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Backend Development"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, icon: value }))}
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      {selectedIcon?.label}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    )
                  })}
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
              placeholder="Brief description of this highlight..."
              rows={3}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-gradient-primary">
              {highlight ? "Update Highlight" : "Add Highlight"}
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
