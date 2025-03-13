"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText } from "lucide-react"
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

interface PaginationData {
  total: number
  pages: number
  currentPage: number
  limit: number
}

export default function EssaysPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [essays, setEssays] = useState<Essay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: 10,
  })

  useEffect(() => {
    async function fetchEssays() {
      if (!user?.email) return
      console.log("fetching essays")
      try {
        const response = await fetch(
          `/api/ai/essays/all?email=${encodeURIComponent(user.email)}&page=${pagination.currentPage}&limit=${pagination.limit}`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch essays")
        }

        const data = await response.json()
        console.log(data)
        setEssays(data.essays)
        setPagination(data.pagination)
      } catch (error) {
        console.error("Error fetching essays:", error)
        toast({
          title: "Error",
          description: "Failed to fetch essays. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEssays()
  }, [user?.email, pagination.currentPage, toast])

  const LoadingSkeleton = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
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

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Essays</h1>
          <Button asChild>
            <Link href="/essays/new">
              <Plus className="mr-2 h-4 w-4" />
              New Essay
            </Link>
          </Button>
        </div>
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Essays</h1>
        <Button asChild>
          <Link href="/essays/new">
            <Plus className="mr-2 h-4 w-4" />
            New Essay
          </Link>
        </Button>
      </div>

      {essays.length === 0 ? (
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
          {essays.map((essay) => (
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

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            disabled={pagination.currentPage === 1}
            onClick={() =>
              setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))
            }
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={pagination.currentPage === pagination.pages}
            onClick={() =>
              setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

