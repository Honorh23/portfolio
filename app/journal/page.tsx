"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Calendar, Tag, Smile, Meh, Frown, Zap, Brain } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { JournalService, type JournalEntry } from "@/lib/journal"
import { JournalEntryForm } from "@/components/journal/journal-entry-form"
import { Navigation } from "@/components/navigation"

const moodIcons = {
  happy: { icon: Smile, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950" },
  excited: { icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950" },
  thoughtful: { icon: Brain, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950" },
  neutral: { icon: Meh, color: "text-gray-500", bg: "bg-gray-50 dark:bg-gray-950" },
  sad: { icon: Frown, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950" },
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)

  useEffect(() => {
    setEntries(JournalService.getEntries())
  }, [])

  const filteredEntries = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleCreateEntry = (entryData: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => {
    const newEntry = JournalService.createEntry(entryData)
    setEntries([newEntry, ...entries])
    setShowForm(false)
  }

  const handleUpdateEntry = (entryData: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => {
    if (!editingEntry) return

    const updatedEntry = JournalService.updateEntry(editingEntry.id, entryData)
    if (updatedEntry) {
      setEntries(entries.map((entry) => (entry.id === editingEntry.id ? updatedEntry : entry)))
      setEditingEntry(null)
    }
  }

  const handleDeleteEntry = (id: string) => {
    if (confirm("Are you sure you want to delete this journal entry?")) {
      JournalService.deleteEntry(id)
      setEntries(entries.filter((entry) => entry.id !== id))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <Navigation />

        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-gradient mb-4">Private Journal</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Your personal space for thoughts, reflections, and memories
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search entries by title, content, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </div>

            {/* Journal Entry Form */}
            {(showForm || editingEntry) && (
              <div className="mb-8">
                <JournalEntryForm
                  entry={editingEntry}
                  onSubmit={editingEntry ? handleUpdateEntry : handleCreateEntry}
                  onCancel={() => {
                    setShowForm(false)
                    setEditingEntry(null)
                  }}
                />
              </div>
            )}

            {/* Entries List */}
            <div className="space-y-6">
              {filteredEntries.length === 0 ? (
                <Card className="glass border-gradient text-center py-12">
                  <CardContent>
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold mb-2">No journal entries yet</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm ? "No entries match your search." : "Start writing your first journal entry!"}
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => setShowForm(true)} className="bg-gradient-primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Entry
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredEntries.map((entry) => {
                  const moodConfig = entry.mood ? moodIcons[entry.mood] : null
                  const MoodIcon = moodConfig?.icon

                  return (
                    <Card
                      key={entry.id}
                      className="glass border-gradient hover:shadow-glow transition-all duration-300"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-xl">{entry.title}</CardTitle>
                              {MoodIcon && (
                                <div className={`p-1.5 rounded-full ${moodConfig.bg}`}>
                                  <MoodIcon className={`h-4 w-4 ${moodConfig.color}`} />
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(entry.createdAt)}
                              </div>
                              {entry.updatedAt !== entry.createdAt && <span className="text-xs">(edited)</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingEntry(entry)}
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none dark:prose-invert mb-4">
                          <p className="whitespace-pre-wrap">{entry.content}</p>
                        </div>
                        {entry.tags.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            {entry.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
