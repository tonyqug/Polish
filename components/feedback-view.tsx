"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface FeedbackViewProps {
  essay: {
    id: string
    title: string
    content: string
  }
}

export function FeedbackView({ essay }: FeedbackViewProps) {
  // This would come from an API in a real application
  const feedback = [
    {
      id: "1",
      text: "Stanford University has been my dream school since I first learned about its pioneering research and innovative spirit.",
      feedback:
        "Strong opening that shows enthusiasm, but consider being more specific about what pioneering research caught your attention.",
      strength: 2,
    },
    {
      id: "2",
      text: "The university's commitment to interdisciplinary education perfectly aligns with my academic goals.",
      feedback:
        "This is a generic statement that could apply to many schools. Try to be more specific about Stanford's unique interdisciplinary programs.",
      strength: 3,
    },
    {
      id: "3",
      text: "As someone passionate about both computer science and environmental sustainability, Stanford's Earth Systems Program and Computer Science department offer the ideal combination for me to pursue my interests.",
      feedback:
        "Excellent specific connection between your interests and Stanford's specific programs. This shows you've done your research.",
      strength: 1,
    },
    {
      id: "4",
      text: "The opportunity to work with faculty who are leading experts in artificial intelligence and climate modeling would be invaluable to my growth as a researcher and innovator.",
      feedback:
        "Good mention of faculty expertise, but consider naming specific professors whose work interests you to show deeper research.",
      strength: 2,
    },
    {
      id: "5",
      text: "Beyond academics, Stanford's vibrant campus culture and diverse student body would provide me with countless opportunities to expand my horizons.",
      feedback: "This is somewhat generic. Consider mentioning specific aspects of campus culture that appeal to you.",
      strength: 3,
    },
    {
      id: "6",
      text: "The entrepreneurial ecosystem, from StartX to the d.school, would nurture my passion for creating technology solutions that address real-world problems.",
      feedback:
        "Excellent specific mention of Stanford's entrepreneurial resources. This shows you understand what makes Stanford unique.",
      strength: 1,
    },
    {
      id: "7",
      text: "I'm particularly drawn to Stanford's commitment to using knowledge in service of humanity. This philosophy resonates deeply with me, as I hope to leverage my education to develop sustainable technologies that can help communities adapt to climate change.",
      feedback:
        "Strong conclusion that ties your personal goals to Stanford's mission. Consider adding a specific example of how you've already begun this work.",
      strength: 2,
    },
  ]

  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null)

  // Parse the HTML content and inject the feedback highlights
  const contentWithHighlights = () => {
    let content = essay.content

    // Replace paragraphs with highlighted versions based on feedback
    feedback.forEach((item) => {
      const escapedText = item.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const regex = new RegExp(`(${escapedText})`, "g")
      content = content.replace(
        regex,
        `<span 
          class="highlight-strength highlight-strength-${item.strength}" 
          data-feedback-id="${item.id}"
          ${selectedFeedback === item.id ? 'style="background-color: var(--primary); color: var(--primary-foreground);"' : ""}
        >$1</span>`,
      )
    })

    return content
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html: contentWithHighlights(),
            }}
            onClick={(e) => {
              const target = e.target as HTMLElement
              const feedbackId = target.getAttribute("data-feedback-id")
              if (feedbackId) {
                setSelectedFeedback(feedbackId === selectedFeedback ? null : feedbackId)
              }
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-lg font-semibold">Feedback</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Click on highlighted text in your essay to see specific feedback. Green = Strong, Yellow = Needs
                    improvement, Red = Needs significant revision.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-4">
            {selectedFeedback ? (
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">{feedback.find((f) => f.id === selectedFeedback)?.text}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feedback.find((f) => f.id === selectedFeedback)?.feedback}
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground">
                <p>Click on highlighted text to see specific feedback</p>
              </div>
            )}

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Feedback Legend</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-100 dark:bg-green-950/30"></div>
                  <span>Strong point</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-100 dark:bg-yellow-950/30"></div>
                  <span>Needs improvement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-100 dark:bg-red-950/30"></div>
                  <span>Needs significant revision</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

