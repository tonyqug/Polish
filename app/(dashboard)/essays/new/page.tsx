"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EssayEditor } from "@/components/essay-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import {getAuth} from "firebase/auth"

interface AnalysisProgress {
  feedback: boolean;
  evaluation: boolean;
  takeaways: boolean;
}

export default function NewEssayPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress>({
    feedback: false,
    evaluation: false,
    takeaways: false,
  });
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [content, setContent] = useState("");
  const [essayType, setEssayType] = useState("");
  const auth = getAuth(); // Get the Firebase auth instance

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email) {
      toast({
        title: "Not logged in",
        description: "Please log in to submit essays.",
        variant: "destructive",
      });
      return;
    }

    if (!title || !content || !essayType) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await auth.currentUser?.getIdToken();
      
      const createResponse = await fetch("/api/essays/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user.email,
          title,
          type: essayType,
          prompt,
          content,
        }),
      });

      if (!createResponse.ok) {
        throw new Error("Failed to create essay");
      }

      const { essayId } = await createResponse.json();
      
      const analysisPromises = [
        fetch(`/api/ai/essays/${essayId}/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, prompt }),
        }).then(() => setAnalysisProgress((prev) => ({ ...prev, feedback: true }))),

        fetch(`/api/ai/essays/${essayId}/evaluation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, prompt }),
        }).then(() => setAnalysisProgress((prev) => ({ ...prev, evaluation: true }))),

        fetch(`/api/ai/essays/${essayId}/takeaways`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, prompt }),
        }).then(() => setAnalysisProgress((prev) => ({ ...prev, takeaways: true }))),
      ];

      await Promise.all(analysisPromises);

      await fetch(`/api/essays/${essayId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user.email,
          status: "Feedback Ready",
        }),
      });

      toast({
        title: "Essay analyzed",
        description: "Your essay has been successfully analyzed.",
      });

      router.push(`/essays/${essayId}`);
    } catch (error) {
      console.error("Error analyzing essay:", error);
      toast({
        title: "Error",
        description: "Failed to analyze essay. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = 
  Object.values(analysisProgress).filter(Boolean).length * (100 / 3)

return (
  <div className="container py-10">
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6">New Essay</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Essay Title</Label>
          <Input
            id="title"
            placeholder="e.g., Why Harvard?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="essay-type">Essay Type</Label>
          <Select value={essayType} onValueChange={setEssayType} required>
            <SelectTrigger id="essay-type">
              <SelectValue placeholder="Select essay type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal-statement">Personal Statement</SelectItem>
              <SelectItem value="why-school">Why This School</SelectItem>
              <SelectItem value="extracurricular">Extracurricular Activity</SelectItem>
              <SelectItem value="challenge">Overcoming Challenge</SelectItem>
              <SelectItem value="diversity">Diversity Statement</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prompt">Essay Prompt (Optional)</Label>
          <Input
            id="prompt"
            placeholder="Paste the exact prompt from the application"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Essay Content</Label>
          <EssayEditor content={content} onChange={setContent} />
          <p className="text-xs text-muted-foreground">Word count: {content.split(/\s+/).filter(Boolean).length}</p>
        </div>

        {isSubmitting && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Analyzing essay...</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${analysisProgress.feedback ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Generating feedback</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${analysisProgress.evaluation ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Evaluating dimensions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${analysisProgress.takeaways ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Extracting takeaways</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Analyzing..." : "Submit for Feedback"}
          </Button>
        </div>
      </form>
    </div>
  </div>
)
}
