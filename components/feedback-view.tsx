"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/components/auth-provider"

interface FeedbackViewProps {
  essayId: string;
}

interface Feedback {
  text: string;
  comment: string;
  type: "strength" | "improvement" | "suggestion";
  startIndex: number;
  endIndex: number;
}

export function FeedbackView({ essayId }: FeedbackViewProps) {
  const { user } = useAuth()
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [popoverOpen, setPopoverOpen] = useState<number | null>(null); // Track which popover is open
  const [essay, setEssay] = useState<any>({});

  useEffect(() => {
    async function getFeedback() {
      if (!user || !user.email) return
      try {
        const response = await fetch(`/api/ai/essays/all?email=${encodeURIComponent(user?.email)}`);
        if (!response.ok) throw new Error("Failed to fetch essays");

        const data = await response.json();
        const essay = data.essays.find((e: any) => e.id === essayId);
        if (!essay) throw new Error("Essay not found");
        console.log(essay)
        setFeedback(essay.feedback.highlights);
        setEssay(essay)
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getFeedback();
  }, [essay.id, essay.content, essay.prompt]);

  const handleMouseEnter = (index: number) => {
    const feedbackItem = feedback.find(f => f.startIndex === index);
    setSelectedFeedback(feedbackItem || null);
    setPopoverOpen(index); // Open the specific popover
  };

  const handleMouseLeave = () => {
    setSelectedFeedback(null);
    setPopoverOpen(null); // Close all popovers
  };


  const contentWithHighlights = () => {
    if (isLoading) return essay.content;

    let content = essay.content;
    let lastIndex = 0;
    const highlightedContent: any[] = [];

    const sortedFeedback = [...feedback].sort((a, b) => a.startIndex - b.startIndex);

    sortedFeedback.forEach((item) => {
      if (item.startIndex > lastIndex) {
        highlightedContent.push(content.substring(lastIndex, item.startIndex));
      }

      const textToHighlight = content.slice(item.startIndex, item.endIndex);

      highlightedContent.push(
        <Popover key={item.startIndex} open={popoverOpen === item.startIndex} onOpenChange={(isOpen) => {
            if (!isOpen) {
                setPopoverOpen(null)
            }
        }}>
          <PopoverTrigger asChild>
            <span
              className={`highlight-${item.type}`}
              style={{
                backgroundColor: item.type === 'strength' ? 'rgba(0, 255, 0, 0.3)' : item.type === 'improvement' ? 'rgba(255, 255, 0, 0.5)' : 'rgba(255, 165, 0, 0.5)',
                padding: '2px 4px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              data-feedback-index={item.startIndex}
              onMouseEnter={() => handleMouseEnter(item.startIndex)}
              onMouseLeave={handleMouseLeave}
            >
              {textToHighlight}
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="grid gap-1">
              <div className="text-sm font-medium">{item.text}</div>
              <div className="text-xs text-muted-foreground">{item.comment}</div>
              <div className="text-xs">Type: {item.type}</div>
            </div>
          </PopoverContent>
        </Popover>
      );

      lastIndex = item.endIndex;
    });

    if (lastIndex < content.length) {
      highlightedContent.push(content.substring(lastIndex));
    }

    return highlightedContent;
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
      <Card className = "h-[600px]">
        <CardContent className="p-6">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {contentWithHighlights()}
          </div>
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
                    Hover over highlighted text in your essay to see specific feedback. Green = Strength, Yellow = Needs
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
                <p>Hover over highlighted text to see specific feedback</p>
              </div>
            )}

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Feedback Legend</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Strength</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span>Needs improvement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                  <span>Suggestion</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}