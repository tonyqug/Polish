"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface FeedbackReportProps {
  essayId: string
}

export function FeedbackReport({ essayId }: FeedbackReportProps) {
  // This would come from an API in a real application
  const reportData = {
    scores: [
      { category: "Clarity", score: 80, fullMark: 100 },
      { category: "Structure", score: 65, fullMark: 100 },
      { category: "Originality", score: 90, fullMark: 100 },
      { category: "Relevance", score: 75, fullMark: 100 },
      { category: "Specificity", score: 60, fullMark: 100 },
    ],
    strengths: [
      "Strong personal voice and authentic enthusiasm",
      "Good connection between personal interests and specific Stanford programs",
      "Effective mention of Stanford's entrepreneurial resources",
    ],
    improvements: [
      "Be more specific about which pioneering research caught your attention",
      "Avoid generic statements about campus culture",
      "Name specific professors whose work interests you",
      "Add a concrete example of how you've already begun work related to your goals",
    ],
    similarExamples: [
      {
        id: "ex1",
        title: "Stanford Essay Example #1",
        excerpt:
          "The interdisciplinary nature of Stanford's Symbolic Systems program perfectly aligns with my interest in the intersection of cognitive science and artificial intelligence...",
        similarity: "High",
      },
      {
        id: "ex2",
        title: "Stanford Essay Example #2",
        excerpt:
          "Professor Smith's groundbreaking research on climate modeling at Stanford's Earth Systems Science department would provide me with the mentorship I need to develop my own research on sustainable urban planning...",
        similarity: "Medium",
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Essay Evaluation</CardTitle>
            <CardDescription>Analysis of your essay across key dimensions</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                score: {
                  label: "Your Score",
                  color: "hsl(var(--primary))",
                },
                fullMark: {
                  label: "Maximum Score",
                  color: "hsl(var(--muted-foreground))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={reportData.scores}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="var(--color-score)"
                    fill="var(--color-score)"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Maximum"
                    dataKey="fullMark"
                    stroke="var(--color-fullMark)"
                    fill="var(--color-fullMark)"
                    fillOpacity={0.1}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Takeaways</CardTitle>
            <CardDescription>Summary of strengths and areas for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm mb-2">Strengths</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {reportData.strengths.map((strength, index) => (
                    <li key={index} className="text-sm">
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-2">Areas for Improvement</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {reportData.improvements.map((improvement, index) => (
                    <li key={index} className="text-sm">
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Similar Exemplar Essays</CardTitle>
          <CardDescription>Essays with similar themes or approaches that you can learn from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.similarExamples.map((example) => (
              <div key={example.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{example.title}</h3>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">{example.similarity} Similarity</span>
                </div>
                <p className="text-sm text-muted-foreground">{example.excerpt}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

