"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Smile, Meh, Frown, Zap, Brain } from "lucide-react"
import type { JournalEntry } from "@/lib/journal"

interface JournalEntryFormProps {
  entry?: JournalEntry | null
  onSubmit: (entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

const moodOptions = [
  { value: "happy", label: "Happy", icon: Smile, color: "text-green-500" },
  { value: "excited", label: "Excited", icon: Zap, color: "text-yellow-500" },
  { value: "thoughtful", label: "Thoughtful", icon: Brain, color: "text-blue-500" },
  { value: "neutral", label: "Neutral", icon: Meh, color: "text-gray-500" },
  { value: "sad", label: "Sad", icon: Frown, color: "text-red-500" },
]

export function JournalEntryForm({ entry, onSubmit, onCancel }: JournalEntryFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [mood, setMood] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (entry) {
      setTitle(entry.title)
      setContent(entry.content)
      setMood(entry.mood || "")
      setTags(entry.tags)
    }
  }, [entry])

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setIsSubmitting(true)

    // Simulate loading for better UX
    await new Promise((resolve) => setTimeout(resolve, 300))

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      mood: mood as JournalEntry["mood"],
      tags,
    })

    // Reset form if creating new entry
    if (!entry) {
      setTitle("")
      setContent("")
      setMood("")
      setTags([])
      setNewTag("")
    }

    setIsSubmitting(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <Card className="glass border-gradient">
      <CardHeader>
        <CardTitle className="text-gradient">{entry ? "Edit Journal Entry" : "New Journal Entry"}</CardTitle>
        <CardDescription>
          {entry ? "Update your thoughts and reflections" : "Capture your thoughts and reflections"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What's on your mind?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your thoughts here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="mood">Mood (Optional)</Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger>
                  <SelectValue placeholder="How are you feeling?" />
                </SelectTrigger>
                <SelectContent>
                  {moodOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${option.color}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={!title.trim() || !content.trim() || isSubmitting}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              {isSubmitting ? "Saving..." : entry ? "Update Entry" : "Create Entry"}
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
