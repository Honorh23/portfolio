"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SecretaryChat() {
  const [messages, setMessages] = useState<{ type: string; text: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)

  const sendMessage = async () => {
    if (!input) return
    const userMsg = { type: "user", text: input }
    setMessages([...messages, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/secretary/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      })
      const data = await res.json()
      const aiMsg = { type: "ai", text: data.reply }
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
                <span
                  className={`inline-block px-3 py-1 rounded ${
                    msg.type === "user" ? "bg-blue-400 text-white" : "bg-gray-200"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && (
              <div className="flex items-center justify-center mt-2">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Secretary is typing...</span>
              </div>
            )}
          </div>
          <div className="flex">
            <input
              type="text"
              ref={inputRef}
              className="flex-1 border rounded-l px-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your question..."
            />
            <Button onClick={sendMessage} className="rounded-r">
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
