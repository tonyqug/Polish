"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, ArrowRight } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface Essay {
  id: string
  title: string
  type: string
  status: string
  lastUpdated: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [recentEssays, setRecentEssays] = useState<Essay[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentEssays() {
      if (!user?.email) return

      try {
        const response = await fetch(
          `/api/ai/essays/all?email=${encodeURIComponent(user.email)}&limit=3`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch essays")
        }

        const data = await response.json()
        setRecentEssays(data.essays)
      } catch (error) {
        console.error("Error fetching essays:", error)
        toast({
          title: "Error",
          description: "Failed to fetch recent essays. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentEssays()
  }, [user?.email, toast])

  const LoadingSkeleton = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-32" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        {/* Welcome Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ""}
          </h1>
          <p className="text-muted-foreground">
            Track your essay progress and get AI-powered feedback to improve your writing.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>New Essay</CardTitle>
              <CardDescription>Start writing a new essay and get AI feedback</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/essays/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Essay
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example Essays</CardTitle>
              <CardDescription>View successful essays for inspiration</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/examples">View Examples</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>AI Chat</CardTitle>
              <CardDescription>Get writing tips and essay guidance</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/chat">Start Chat</Link>
              </Button>
            </CardFooter>
          </Card> */}
        </div>

        {/* Recent Essays */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Recent Essays</h2>
            <Button variant="ghost" asChild>
              <Link href="/essays" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <LoadingSkeleton />
          ) : recentEssays.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-10 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-4" />
              <CardTitle className="text-xl mb-2">No essays yet</CardTitle>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first essay for analysis.
              </p>
              <Button asChild>
                <Link href="/essays/new">Create Essay</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentEssays.map((essay) => (
                <Link key={essay.id} href={`/essays/${essay.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{essay.title}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">{essay.type}</Badge>
                        <Badge
                          variant={essay.status === "Feedback Ready" ? "default" : "secondary"}
                        >
                          {essay.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardFooter>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {new Date(essay.lastUpdated).toLocaleDateString()}
                      </p>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

