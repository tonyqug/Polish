"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, MessageSquare } from "lucide-react"
import { FeedbackView } from "@/components/feedback-view"
import { FeedbackReport } from "@/components/feedback-report"
import { ChatInterface } from "@/components/chat-interface"

export default function EssayPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("feedback")

  // This would come from an API in a real application
  const essay = {
    id: params.id,
    title: "Why Stanford?",
    type: "Why This School",
    prompt: "Please write a statement describing why you are interested in attending Stanford University.",
    content: `<p>Stanford University has been my dream school since I first learned about its pioneering research and innovative spirit. The university's commitment to interdisciplinary education perfectly aligns with my academic goals.</p>
    <p>As someone passionate about both computer science and environmental sustainability, Stanford's Earth Systems Program and Computer Science department offer the ideal combination for me to pursue my interests. The opportunity to work with faculty who are leading experts in artificial intelligence and climate modeling would be invaluable to my growth as a researcher and innovator.</p>
    <p>Beyond academics, Stanford's vibrant campus culture and diverse student body would provide me with countless opportunities to expand my horizons. The entrepreneurial ecosystem, from StartX to the d.school, would nurture my passion for creating technology solutions that address real-world problems.</p>
    <p>I'm particularly drawn to Stanford's commitment to using knowledge in service of humanity. This philosophy resonates deeply with me, as I hope to leverage my education to develop sustainable technologies that can help communities adapt to climate change.</p>`,
    lastUpdated: "2 days ago",
    status: "Feedback Ready",
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
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={() => setActiveTab("chat")}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Ask AI
            </Button>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
            <TabsTrigger value="chat">AI Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="feedback" className="mt-6">
            <FeedbackView essay={essay} />
          </TabsContent>
          <TabsContent value="report" className="mt-6">
            <FeedbackReport essayId={essay.id} />
          </TabsContent>
          <TabsContent value="chat" className="mt-6">
            <ChatInterface essayId={essay.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

