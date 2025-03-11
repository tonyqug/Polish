import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

export default function EssaysPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Essays</h1>
          <Button asChild>
            <Link href="/essays/new">
              <Plus className="mr-2 h-4 w-4" />
              New Essay
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {essays.map((essay) => (
            <Card key={essay.id}>
              <CardHeader>
                <CardTitle>{essay.title}</CardTitle>
                <CardDescription>Last updated: {essay.lastUpdated}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant={essay.status === "Feedback Ready" ? "default" : "outline"}>{essay.status}</Badge>
                  <Badge variant="outline">{essay.type}</Badge>
                </div>
                <p className="line-clamp-3 text-sm text-muted-foreground">{essay.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/essays/${essay.id}`}>View Essay</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

const essays = [
  {
    id: "1",
    title: "Why Stanford?",
    type: "Why This School",
    status: "Feedback Ready",
    lastUpdated: "2 days ago",
    excerpt:
      "Stanford University has been my dream school since I first learned about its pioneering research and innovative spirit. The university's commitment to interdisciplinary education perfectly aligns with my academic goals...",
  },
  {
    id: "2",
    title: "Overcoming Challenges",
    type: "Personal Statement",
    status: "In Progress",
    lastUpdated: "1 week ago",
    excerpt:
      "When I broke my leg during the championship game, I thought my basketball career was over. However, this setback taught me resilience and the importance of adapting to unexpected circumstances...",
  },
  {
    id: "3",
    title: "Community Impact",
    type: "Extracurricular Activity",
    status: "Feedback Ready",
    lastUpdated: "2 weeks ago",
    excerpt:
      "Starting a coding club at my local community center allowed me to share my passion for technology while addressing the digital divide in my neighborhood...",
  },
]

