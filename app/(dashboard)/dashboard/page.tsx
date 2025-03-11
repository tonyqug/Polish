import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, Sparkles, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button asChild>
            <Link href="/essays/new">
              <Plus className="mr-2 h-4 w-4" />
              New Essay
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Essays Submitted</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">+1 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feedback Received</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+4 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Improvement Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+24%</div>
              <p className="text-xs text-muted-foreground">+8% from last essay</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold tracking-tight">Recent Essays</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentEssays.map((essay) => (
            <Card key={essay.id}>
              <CardHeader>
                <CardTitle>{essay.title}</CardTitle>
                <CardDescription>Last updated: {essay.lastUpdated}</CardDescription>
              </CardHeader>
              <CardContent>
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

const recentEssays = [
  {
    id: "1",
    title: "Why Stanford?",
    lastUpdated: "2 days ago",
    excerpt:
      "Stanford's commitment to interdisciplinary research and innovation aligns perfectly with my academic interests in computer science and environmental sustainability...",
  },
  {
    id: "2",
    title: "Overcoming Challenges",
    lastUpdated: "1 week ago",
    excerpt:
      "When I broke my leg during the championship game, I thought my basketball career was over. However, this setback taught me resilience and the importance of...",
  },
  {
    id: "3",
    title: "Community Impact",
    lastUpdated: "2 weeks ago",
    excerpt:
      "Starting a coding club at my local community center allowed me to share my passion for technology while addressing the digital divide in my neighborhood...",
  },
]

