"use client"

export interface JournalEntry {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  mood?: "happy" | "neutral" | "sad" | "excited" | "thoughtful"
  tags: string[]
}

const STORAGE_KEY = "journal_entries"

export class JournalService {
  static getEntries(): JournalEntry[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }

  static saveEntries(entries: JournalEntry[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }

  static createEntry(entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">): JournalEntry {
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const entries = this.getEntries()
    entries.unshift(newEntry) // Add to beginning for chronological order
    this.saveEntries(entries)
    return newEntry
  }

  static updateEntry(id: string, updates: Partial<Omit<JournalEntry, "id" | "createdAt">>): JournalEntry | null {
    const entries = this.getEntries()
    const index = entries.findIndex((entry) => entry.id === id)

    if (index === -1) return null

    const updatedEntry = {
      ...entries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    entries[index] = updatedEntry
    this.saveEntries(entries)
    return updatedEntry
  }

  static deleteEntry(id: string): boolean {
    const entries = this.getEntries()
    const filteredEntries = entries.filter((entry) => entry.id !== id)

    if (filteredEntries.length === entries.length) return false

    this.saveEntries(filteredEntries)
    return true
  }

  static getEntry(id: string): JournalEntry | null {
    const entries = this.getEntries()
    return entries.find((entry) => entry.id === id) || null
  }
}
