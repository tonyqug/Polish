import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ExamplesPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Example Essays</h1>
          <p className="text-muted-foreground mt-2">
            Browse our curated collection of successful college application essays
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exampleEssays.map((essay) => (
            <Card key={essay.id}>
              <CardHeader>
                <CardTitle>{essay.title}</CardTitle>
                <CardDescription>Accepted to: {essay.acceptedTo}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {essay.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="line-clamp-3 text-sm text-muted-foreground">{essay.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/examples/${essay.id}`}>Read Full Essay</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

const exampleEssays = [
  {
    id: "1",
    title: "The Power of Curiosity",
    acceptedTo: "Harvard University",
    tags: ["Personal Statement", "Research", "Science"],
    excerpt:
      "I've always been the kid who took apart the toaster. My parents weren't thrilled about the mess of springs and wires on the kitchen counter, but they recognized my insatiable curiosity about how things work...",
  },
  {
    id: "2",
    title: "Finding My Voice Through Poetry",
    acceptedTo: "Yale University",
    tags: ["Personal Statement", "Arts", "Identity"],
    excerpt:
      "Words have always been my refuge. As a shy child of immigrants, I often struggled to express myself in conversation, but on paper, my thoughts flowed freely. Poetry became my voice when my spoken words failed me...",
  },
  {
    id: "3",
    title: "Why Princeton Engineering",
    acceptedTo: "Princeton University",
    tags: ["Why This School", "Engineering", "Research"],
    excerpt:
      "Princeton's commitment to using engineering to address societal challenges resonates deeply with me. Professor Zhang's work on sustainable urban infrastructure particularly caught my attention because it aligns with my goal to...",
  },
  {
    id: "4",
    title: "Leading Through Service",
    acceptedTo: "Stanford University",
    tags: ["Leadership", "Community Service", "Impact"],
    excerpt:
      "When our town was devastated by flooding, I saw firsthand how community organization could make a difference. As the president of my school's volunteer club, I coordinated with local officials to establish a network of...",
  },
  {
    id: "5",
    title: "The Language of Mathematics",
    acceptedTo: "MIT",
    tags: ["Academic Interest", "Mathematics", "Problem Solving"],
    excerpt:
      "I see mathematics as a universal language that transcends cultural barriers. My fascination began in eighth grade when my teacher showed us how the Fibonacci sequence appears throughout nature, from pinecones to galaxies...",
  },
  {
    id: "6",
    title: "From Refugee to Researcher",
    acceptedTo: "Columbia University",
    tags: ["Overcoming Challenges", "Identity", "Resilience"],
    excerpt:
      "The sound of air raid sirens still echoes in my memory. At twelve years old, I left everything behind—my home, my friends, my sense of security. Arriving in America as a refugee, I faced the daunting task of rebuilding my life...",
  },
]

