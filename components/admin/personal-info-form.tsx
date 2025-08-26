"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, Github, Linkedin, Twitter, Globe } from "lucide-react"
import type { PortfolioData, SocialLink } from "@/lib/portfolio-data"

interface PersonalInfoFormProps {
  data: PortfolioData
  onChange: (data: PortfolioData) => void
}

const socialIcons = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Twitter: Twitter,
  Website: Globe,
}

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const [personalInfo, setPersonalInfo] = useState(data.personalInfo)
  const [socialLinks, setSocialLinks] = useState(data.socialLinks)
  const [newSocialLink, setNewSocialLink] = useState({ platform: "", url: "" })

  useEffect(() => {
    onChange({
      ...data,
      personalInfo,
      socialLinks,
    })
  }, [personalInfo, socialLinks])

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      const newLink: SocialLink = {
        id: crypto.randomUUID(),
        platform: newSocialLink.platform,
        url: newSocialLink.url,
        icon: newSocialLink.platform,
      }
      setSocialLinks((prev) => [...prev, newLink])
      setNewSocialLink({ platform: "", url: "" })
    }
  }

  const removeSocialLink = (id: string) => {
    setSocialLinks((prev) => prev.filter((link) => link.id !== id))
  }

  const updateSocialLink = (id: string, field: string, value: string) => {
    setSocialLinks((prev) =>
      prev.map((link) =>
        link.id === id ? { ...link, [field]: value, icon: field === "platform" ? value : link.icon } : link,
      ),
    )
  }

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={personalInfo.name}
            onChange={(e) => handlePersonalInfoChange("name", e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Professional Title</Label>
          <Input
            id="title"
            value={personalInfo.title}
            onChange={(e) => handlePersonalInfoChange("title", e.target.value)}
            placeholder="e.g., Full Stack Developer"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input
            id="phone"
            value={personalInfo.phone || ""}
            onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="location">Location (Optional)</Label>
          <Input
            id="location"
            value={personalInfo.location || ""}
            onChange={(e) => handlePersonalInfoChange("location", e.target.value)}
            placeholder="City, State/Country"
          />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio/Description</Label>
        <Textarea
          id="bio"
          value={personalInfo.bio}
          onChange={(e) => handlePersonalInfoChange("bio", e.target.value)}
          placeholder="Write a compelling bio that describes your expertise and passion..."
          rows={4}
        />
      </div>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Links */}
          {socialLinks.map((link) => {
            const Icon = socialIcons[link.platform as keyof typeof socialIcons] || Globe
            return (
              <div key={link.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                <Icon className="h-5 w-5 text-primary" />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    value={link.platform}
                    onChange={(e) => updateSocialLink(link.id, "platform", e.target.value)}
                    placeholder="Platform name"
                  />
                  <Input
                    value={link.url}
                    onChange={(e) => updateSocialLink(link.id, "url", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeSocialLink(link.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )
          })}

          {/* Add New Link */}
          <div className="flex items-center gap-3 p-3 border border-dashed border-border rounded-lg">
            <Plus className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                value={newSocialLink.platform}
                onChange={(e) => setNewSocialLink((prev) => ({ ...prev, platform: e.target.value }))}
                placeholder="Platform (e.g., GitHub, LinkedIn)"
              />
              <Input
                value={newSocialLink.url}
                onChange={(e) => setNewSocialLink((prev) => ({ ...prev, url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addSocialLink}
              disabled={!newSocialLink.platform || !newSocialLink.url}
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
