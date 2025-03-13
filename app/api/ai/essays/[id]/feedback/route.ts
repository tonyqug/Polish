import { NextRequest, NextResponse } from "next/server";
import { generateStructuredContent } from "@/app/api/ai/genai";

const feedbackSchema = {
  type: "object",
  properties: {
    highlights: {
      type: "array",
      items: {
        type: "object",
        properties: {
          text: { type: "string" },
          startIndex: { type: "number" },
          endIndex: { type: "number" },
          comment: { type: "string" },
          type: { 
            type: "string",
            enum: ["strength", "improvement", "suggestion"]
          }
        },
        required: ["text", "startIndex", "endIndex", "comment", "type"]
      }
    },
    generalFeedback: { type: "string" }
  },
  required: ["highlights", "generalFeedback"]
};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { content, prompt } = await request.json();

    const analysisPrompt = `
      As an expert essay reviewer, analyze the following college application essay.
      Provide specific, constructive feedback highlighting both strengths and areas for improvement.
      Focus on content, structure, and effectiveness in answering the prompt.

      Essay Prompt: ${prompt}

      Essay Content: ${content}

      Provide feedback that includes specific text selections with detailed comments.
      For each highlight, indicate whether it's a strength, needs improvement, or is a suggestion.
      Also provide overall feedback about the essay's effectiveness.
    `;

    const feedback = await generateStructuredContent(analysisPrompt, {
      schema: feedbackSchema
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Error analyzing essay:", error);
    return NextResponse.json(
      { error: "Failed to analyze essay" },
      { status: 500 }
    );
  }
} 