'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";  // Importing useRouter from Next.js
import {useState, useEffect} from 'react'



export default function LandingPage() {
  const auth = getAuth();
  const router = useRouter();  // Call useRouter directly

  useEffect(() => {

  }, []);

  const signIn = async (garb:any,{callbackUrl}:any) => {
    const provider = new GoogleAuthProvider();
    
    try {
      // Sign in with popup
      await signInWithPopup(auth, provider);
      console.log("User signed in!");
  
      // Redirect to '/examples' after successful sign-in
      router.push(callbackUrl);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl text-primary">Polish</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Button onClick = {() => signIn("google", { callbackUrl: "/dashboard" })} className="text-sm font-medium text-foreground hover:text-muted-foreground">
              Log in
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Perfect Your College Essays with AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Get personalized, detailed feedback on your college application essays by comparing them to
                    exemplary essays from successful applicants.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" onClick = {() => signIn("google", { callbackUrl: "/dashboard" })}>
                    <span>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </Button>
                  <Button variant="outline" size="lg" asChild onClick = {() => signIn("google", { callbackUrl: "/examples" })}>
                    <span>View Example Essays</span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="College Essay Feedback"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                  src="/placeholder.svg?height=400&width=600"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Our AI-powered platform provides actionable feedback to help you craft compelling college essays.
                </p>
              </div>
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12">
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <h3 className="text-xl font-bold">Submit Your Essay</h3>
                  <p className="text-muted-foreground">
                    Upload your draft and our AI will analyze it against our curated library of successful essays.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    2
                  </div>
                  <h3 className="text-xl font-bold">Receive Detailed Feedback</h3>
                  <p className="text-muted-foreground">
                    Get personalized insights on structure, content, and style with specific suggestions for
                    improvement.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    3
                  </div>
                  <h3 className="text-xl font-bold">Refine and Perfect</h3>
                  <p className="text-muted-foreground">
                    Use our interactive tools to revise your essay and chat with our AI for additional guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Key Features</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Everything you need to craft the perfect college application essay.
                </p>
              </div>
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.title} className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <h3 className="font-bold">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <p className="text-center text-sm text-muted-foreground">© 2025 Polish. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: "AI-Powered Feedback",
    description: "Get detailed, contextual feedback on your essay's structure, content, and style.",
  },
  {
    title: "Exemplar Comparisons",
    description: "See how your essay compares to successful essays from past applicants.",
  },
  {
    title: "Interactive Editor",
    description: "Edit your essay with real-time suggestions and improvements.",
  },
  {
    title: "Visual Analytics",
    description: "View your essay's strengths and weaknesses through intuitive charts and graphs.",
  },
  {
    title: "AI Chat Assistant",
    description: "Ask follow-up questions and get personalized guidance from our AI.",
  },
  {
    title: "Progress Tracking",
    description: "Track your improvements over time as you refine your essays.",
  },
]

