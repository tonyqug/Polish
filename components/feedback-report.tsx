"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

interface FeedbackReportProps {
  essayId: string
  essay: {
    content: string
    prompt: string
  }
}

interface Dimension {
  name: string
  score: number
  explanation: string
}

interface Evaluation {
  dimensions: Dimension[]
  overallScore: number
  overallFeedback: string
}

interface Theme {
  theme: string
  evidence: string
}

interface Takeaways {
  mainThemes: Theme[]
  keyQualities: string[]
  memorableElements: {
    element: string
    impact: string
  }[]
  summary: string
}

export function FeedbackReport({ essayId, essay }: FeedbackReportProps) {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [takeaways, setTakeaways] = useState<Takeaways | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getReportData() {
      try {
        const [evalResponse, takeawaysResponse] = await Promise.all([
          fetch(`/api/ai/essays/${essayId}/evaluation`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: essay.content,
              prompt: essay.prompt,
            }),
          }),
          fetch(`/api/ai/essays/${essayId}/takeaways`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: essay.content,
              prompt: essay.prompt,
            }),
          })
        ]);

        if (!evalResponse.ok || !takeawaysResponse.ok) {
          throw new Error('Failed to fetch report data');
        }

        const [evalData, takeawaysData] = await Promise.all([
          evalResponse.json(),
          takeawaysResponse.json()
        ]);

        setEvaluation(evalData);
        setTakeaways(takeawaysData);
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getReportData();
  }, [essayId, essay.content, essay.prompt]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const chartData = evaluation?.dimensions.map(d => ({
    category: d.name,
    score: d.score * 10, // Convert 1-10 to percentage
    fullMark: 100,
  })) || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Essay Evaluation</CardTitle>
            <CardDescription>Analysis across key dimensions</CardDescription>
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
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
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
            <CardDescription>Main themes and qualities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm mb-2">Main Themes</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {takeaways?.mainThemes.map((theme, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{theme.theme}</span>: {theme.evidence}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-2">Key Qualities Demonstrated</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {takeaways?.keyQualities.map((quality, index) => (
                    <li key={index} className="text-sm">
                      {quality}
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
          <CardTitle>Memorable Elements</CardTitle>
          <CardDescription>Standout aspects of your essay</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {takeaways?.memorableElements.map((element, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="mb-2">
                  <h3 className="font-medium">{element.element}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{element.impact}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

