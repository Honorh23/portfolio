"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

export function SecretaryChat() {
  const [messages, setMessages] = useState<{ type: string; text: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)

  // Minimal Markdown renderer (bold, lists, paragraphs)
  const renderMarkdownLite = (text: string) => {
    const blocks = text.split(/\n\n+/)
    const inline = (s: string) => {
      const parts: (string | JSX.Element)[] = []
      let rest = s
      const boldRe = /\*\*(.+?)\*\*/
      while (true) {
        const m = rest.match(boldRe)
        if (!m) {
          parts.push(rest)
          break
        }
        const [all, inner] = m
        const idx = m.index ?? 0
        if (idx > 0) parts.push(rest.slice(0, idx))
        parts.push(<strong key={parts.length}>{inner}</strong>)
        rest = rest.slice(idx + all.length)
      }
      return parts
    }

    return (
      <div className="space-y-3">
        {blocks.map((block, i) => {
          const lines = block.split(/\n/)
          const isList = lines.every((l) => l.trim().startsWith("- "))
          if (isList) {
            return (
              <ul key={i} className="list-disc pl-5 space-y-1">
                {lines.map((l, j) => (
                  <li key={j}>{inline(l.replace(/^\s*-\s*/, ""))}</li>
                ))}
              </ul>
            )
          }
          // Headings keywords
          if (/^(Key Points:|Related Projects:)/i.test(block.trim())) {
            return (
              <p key={i} className="font-semibold">
                {inline(block.trim())}
              </p>
            )
          }
          return (
            <p key={i} className="whitespace-pre-wrap">
              {inline(block)}
            </p>
          )
        })}
      </div>
    )
  }

  const sendMessage = async () => {
    if (!input) return
    const userMsg = { type: "user", text: input }
    setMessages([...messages, userMsg])
    setInput("")
    setLoading(true)

    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
      const res = await fetch(`${base}/secretary/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      })
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`)
      }
      const data = await res.json()
      const raw = typeof data.reply === "string" ? data.reply : ""
      const safe = raw && raw.trim().length > 0 ? raw : "I couldn’t generate a response just now. Please try again."
      const aiMsg = { type: "ai", text: safe }
      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to get a reply from the secretary",
        variant: "destructive",
      })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2 text-primary" />
            AI Secretary Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 overflow-y-auto mb-4 border rounded p-2 bg-muted">
            {messages.length === 0 && (
              <p className="text-center text-muted-foreground">Ask me anything!</p>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 ${msg.type === "user" ? "text-right" : "text-left"}`}
              >
                {msg.type === "user" ? (
                  <span className="inline-block px-3 py-1 rounded bg-blue-400 text-white whitespace-pre-wrap">
                    {msg.text}
                  </span>
                ) : (
                  <div className="inline-block max-w-full text-left px-3 py-2 rounded bg-white text-foreground shadow-sm">
                    {renderMarkdownLite(msg.text)}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center justify-center mt-2">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Secretary is typing...</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              ref={inputRef}
              className="flex-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your question..."
            />
            <Button onClick={sendMessage} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending
                </>
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
