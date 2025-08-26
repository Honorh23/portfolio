"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { PortfolioData, Skill } from "@/lib/portfolio-data"

interface SkillsFormProps {
  data: PortfolioData
  onChange: (data: PortfolioData) => void
}

const skillCategories = [
  { value: "backend", label: "Backend", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  { value: "frontend", label: "Frontend", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  {
    value: "database",
    label: "Database",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  { value: "tools", label: "Tools", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
  { value: "ai", label: "AI/ML", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" },
]

export function SkillsForm({ data, onChange }: SkillsFormProps) {
  const [skills, setSkills] = useState(data.skills)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    onChange({
      ...data,
      skills,
    })
  }, [skills])

  const handleCreateSkill = (skillData: Omit<Skill, "id">) => {
    const newSkill: Skill = {
      ...skillData,
      id: crypto.randomUUID(),
    }
    setSkills((prev) => [...prev, newSkill])
    setShowForm(false)
  }

  const handleUpdateSkill = (skillData: Omit<Skill, "id">) => {
    if (!editingSkill) return
    setSkills((prev) =>
      prev.map((skill) => (skill.id === editingSkill.id ? { ...skillData, id: editingSkill.id } : skill)),
    )
    setEditingSkill(null)
  }

  const handleDeleteSkill = (id: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      setSkills((prev) => prev.filter((skill) => skill.id !== id))
    }
  }

  const groupedSkills = skillCategories.map((category) => ({
    ...category,
    skills: skills.filter((skill) => skill.category === category.value),
  }))

  return (
    <div className="space-y-6">
      {/* Add Skill Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Skills ({skills.length})</h3>
        <Button onClick={() => setShowForm(true)} className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {/* Skill Form */}
      {(showForm || editingSkill) && (
        <SkillForm
          skill={editingSkill}
          onSubmit={editingSkill ? handleUpdateSkill : handleCreateSkill}
          onCancel={() => {
            setShowForm(false)
            setEditingSkill(null)
          }}
        />
      )}

      {/* Skills by Category */}
      <div className="space-y-6">
        {groupedSkills.map((category) => (
          <Card key={category.value} className="border-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className={category.color}>{category.label}</Badge>
                <span className="text-sm text-muted-foreground">({category.skills.length} skills)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {category.skills.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No {category.label.toLowerCase()} skills added yet
                </p>
              ) : (
                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">{skill.proficiency}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="ghost" size="sm" onClick={() => setEditingSkill(skill)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteSkill(skill.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

interface SkillFormProps {
  skill?: Skill | null
  onSubmit: (skill: Omit<Skill, "id">) => void
  onCancel: () => void
}

function SkillForm({ skill, onSubmit, onCancel }: SkillFormProps) {
  const [formData, setFormData] = useState({
    name: skill?.name || "",
    category: skill?.category || "backend",
    proficiency: skill?.proficiency || 50,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name: formData.name,
      category: formData.category as Skill["category"],
      proficiency: formData.proficiency,
    })
  }

  return (
    <Card className="border-gradient">
      <CardHeader>
        <CardTitle>{skill ? "Edit Skill" : "Add New Skill"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Python, React, PostgreSQL"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {skillCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="proficiency">Proficiency Level: {formData.proficiency}%</Label>
            <Slider
              id="proficiency"
              min={1}
              max={100}
              step={5}
              value={[formData.proficiency]}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, proficiency: value[0] }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-gradient-primary">
              {skill ? "Update Skill" : "Add Skill"}
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
