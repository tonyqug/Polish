"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface FeedbackViewProps {
  essay: {
    id: string
    title: string
    content: string
    prompt: string
  }
}

interface Feedback {
  text: string
  comment: string
  type: "strength" | "improvement" | "suggestion"
  startIndex: number
  endIndex: number
}

export function FeedbackView({ essay }: FeedbackViewProps) {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getFeedback() {
      try {
        const response = await fetch(`/api/ai/essays/${essay.id}/feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: essay.content,
            prompt: essay.prompt,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }

        const data = await response.json();
        setFeedback(data.highlights);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getFeedback();
  }, [essay.id, essay.content, essay.prompt]);

  // Parse the HTML content and inject the feedback highlights
  const contentWithHighlights = () => {
    if (isLoading) return essay.content;

    let content = essay.content;
    feedback.forEach((item) => {
      const textToHighlight = content.slice(item.startIndex, item.endIndex);
      const escapedText = textToHighlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escapedText})`, "g");
      content = content.replace(
        regex,
        `<span 
          class="highlight-${item.type}" 
          data-feedback-index="${item.startIndex}"
          ${selectedFeedback?.startIndex === item.startIndex ? 'style="background-color: var(--primary); color: var(--primary-foreground);"' : ""}
        >$1</span>`
      );
    });

    return content;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
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
              const target = e.target as HTMLElement;
              const feedbackIndex = target.getAttribute("data-feedback-index");
              if (feedbackIndex) {
                const index = parseInt(feedbackIndex);
                const feedbackItem = feedback.find(f => f.startIndex === index);
                setSelectedFeedback(selectedFeedback?.startIndex === index ? null : feedbackItem || null);
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
                    Click on highlighted text in your essay to see specific feedback. Green = Strength, Yellow = Needs
                    improvement, Orange = Suggestion for enhancement.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-4">
            {selectedFeedback ? (
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">{selectedFeedback.text}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedFeedback.comment}
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
                  <span>Strength</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-100 dark:bg-yellow-950/30"></div>
                  <span>Needs improvement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-100 dark:bg-orange-950/30"></div>
                  <span>Suggestion</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

