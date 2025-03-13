import { NextRequest, NextResponse } from "next/server";
import { generateStructuredContent } from "@/app/api/ai/genai";

const takeawaysSchema = {
  type: "object",
  properties: {
    mainThemes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          theme: { type: "string" },
          evidence: { type: "string" }
        },
        required: ["theme", "evidence"]
      }
    },
    keyQualities: {
      type: "array",
      items: {
        type: "string"
      }
    },
    memorableElements: {
      type: "array",
      items: {
        type: "object",
        properties: {
          element: { type: "string" },
          impact: { type: "string" }
        },
        required: ["element", "impact"]
      }
    },
    summary: { type: "string" }
  },
  required: ["mainThemes", "keyQualities", "memorableElements", "summary"]
};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { content, prompt } = await request.json();

    const analysisPrompt = `
      As an expert essay analyst, identify the key takeaways from this college application essay.
      Focus on extracting:
      - Main themes and supporting evidence
      - Key qualities demonstrated by the author
      - Most memorable or impactful elements
      
      Provide a concise yet comprehensive analysis that captures the essence of the essay.

      Essay Prompt: ${prompt}

      Essay Content: ${content}
    `;

    const takeaways = await generateStructuredContent(analysisPrompt, {
      schema: takeawaysSchema
    });

    return NextResponse.json(takeaways);
  } catch (error) {
    console.error("Error analyzing essay takeaways:", error);
    return NextResponse.json(
      { error: "Failed to analyze essay takeaways" },
      { status: 500 }
    );
  }
} 