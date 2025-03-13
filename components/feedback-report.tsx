"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/auth-provider"

interface FeedbackReportProps {
  essayId: string;
}

interface Dimension {
  name: string;
  score: number;
  explanation: string;
}

interface Evaluation {
  dimensions: Dimension[];
  overallScore: number;
  overallFeedback: string;
}

interface Theme {
  theme: string;
  evidence: string;
}

interface Takeaways {
  mainThemes: Theme[];
  keyQualities: string[];
  memorableElements: {
    element: string;
    impact: string;
  }[];
  summary: string;
}

export function FeedbackReport({ essayId }: FeedbackReportProps) {
  const { user } = useAuth()
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [takeaways, setTakeaways] = useState<Takeaways | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getReportData() {
      if (!user || !user.email) return
      try {
        const response = await fetch(`/api/ai/essays/all?email=${encodeURIComponent(user.email)}`);
        if (!response.ok) throw new Error("Failed to fetch essays");

        const data = await response.json();
        const essay = data.essays.find((e: any) => e.id === essayId);
        if (!essay) throw new Error("Essay not found");
        console.log(essay)
        setEvaluation({
          dimensions: [
            { name: "Impact", score: essay.evaluation.impact.score, explanation: essay.evaluation.impact.explanation },
            { name: "Relevance", score: essay.evaluation.relevance.score, explanation: essay.evaluation.relevance.explanation },
            { name: "Specificity", score: essay.evaluation.specificity.score, explanation: essay.evaluation.specificity.explanation },
            { name: "Structure", score: essay.evaluation.structure.score, explanation: essay.evaluation.structure.explanation },
            { name: "Voice", score: essay.evaluation.voice.score, explanation: essay.evaluation.voice.explanation }
          ],
          overallScore: essay.evaluation.score,
          overallFeedback: essay.feedback.generalFeedback,
        });

        setTakeaways(essay.takeaways);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getReportData();
  }, [essayId, user?.email]);

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  const chartData = evaluation?.dimensions.map(d => ({
    category: d.name,
    score: d.score * 10,
    fullMark: 100,
  })) || [];

  return (
    <div className="space-y-6">
      <div className = "flex justify-between flex-row ">
      <Card className = "w-[40%]">
        <CardHeader>
          <CardTitle>Essay Evaluation</CardTitle>
          <CardDescription>Analysis across key dimensions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Score" dataKey="score" stroke="blue" fill="blue" fillOpacity={0.6} />
              <Radar name="Maximum" dataKey="fullMark" stroke="gray" fill="gray" fillOpacity={0.1} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className = "flex justify-between flex-col">
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
    </div>
    </div>
  );
}
