"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { FeedbackView } from "@/components/feedback-view"
import { FeedbackReport } from "@/components/feedback-report"
import { Skeleton } from "@/components/ui/skeleton"

interface Essay {
  id: string
  title: string
  type: string
  prompt: string
  content: string
  lastUpdated: string
  status: string
}

export default function EssayPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("feedback")
  const [essay, setEssay] = useState<Essay | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchEssay() {
      if (!session?.user?.email) return;

      try {
        const response = await fetch(`/api/essays/${params.id}?email=${encodeURIComponent(session.user.email)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch essay');
        }
        const data = await response.json();
        setEssay(data);
      } catch (error) {
        console.error('Error fetching essay:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEssay();
  }, [params.id, session?.user?.email]);

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/essays">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Essays
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <Skeleton className="h-8 w-64" />
            <div className="mt-2 flex items-center gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!essay) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Essay not found</h1>
          <p className="mt-2 text-muted-foreground">
            The essay you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button asChild className="mt-4">
            <Link href="/essays">Back to Essays</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/essays">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Essays
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{essay.title}</h1>
            <div className="mt-2 flex items-center gap-2">
              <Badge>{essay.type}</Badge>
              <span className="text-sm text-muted-foreground">Last updated: {essay.lastUpdated}</span>
            </div>
          </div>
        </div>

        {essay.prompt && (
          <Card>
            <CardHeader>
              <CardTitle>Essay Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{essay.prompt}</p>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
          </TabsList>
          <TabsContent value="feedback" className="mt-6">
            <FeedbackView essay={essay} />
          </TabsContent>
          <TabsContent value="report" className="mt-6">
            <FeedbackReport essayId={essay.id} essay={essay} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

