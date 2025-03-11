"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EssayEditor } from "@/components/essay-editor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function NewEssayPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState("")
  const [prompt, setPrompt] = useState("")
  const [content, setContent] = useState("")
  const [essayType, setEssayType] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !content || !essayType) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Essay submitted",
      description: "Your essay has been submitted for feedback.",
    })

    router.push("/essays/1")
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">New Essay</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Essay Title</Label>
            <Input
              id="title"
              placeholder="e.g., Why Harvard?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="essay-type">Essay Type</Label>
            <Select value={essayType} onValueChange={setEssayType} required>
              <SelectTrigger id="essay-type">
                <SelectValue placeholder="Select essay type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal-statement">Personal Statement</SelectItem>
                <SelectItem value="why-school">Why This School</SelectItem>
                <SelectItem value="extracurricular">Extracurricular Activity</SelectItem>
                <SelectItem value="challenge">Overcoming Challenge</SelectItem>
                <SelectItem value="diversity">Diversity Statement</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Essay Prompt (Optional)</Label>
            <Input
              id="prompt"
              placeholder="Paste the exact prompt from the application"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Essay Content</Label>
            <EssayEditor content={content} onChange={setContent} />
            <p className="text-xs text-muted-foreground">Word count: {content.split(/\s+/).filter(Boolean).length}</p>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit for Feedback"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

