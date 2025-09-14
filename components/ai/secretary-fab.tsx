"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { SecretaryDialog } from "@/components/ai/secretary-dialog"

export function SecretaryFab() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setOpen(true)}
          className="bg-gradient-primary hover:shadow-glow transition-all duration-300 rounded-full p-4 shadow-lg"
        >
          <MessageSquare className="h-5 w-5 mr-2" /> AI Secretary
        </Button>
      </div>
      <SecretaryDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
