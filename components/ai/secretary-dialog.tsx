"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { SecretaryChat } from "@/components/ai/secretaryChat"

interface SecretaryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SecretaryDialog({ open, onOpenChange }: SecretaryDialogProps) {
  // Prevent background scroll when open (nice UX for modals)
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white dark:bg-neutral-900 border border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle>Chat with AI Secretary</DialogTitle>
          <DialogDescription>Ask about Honore’s skills, projects, and experience.</DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <SecretaryChat />
        </div>
      </DialogContent>
    </Dialog>
  )
}
