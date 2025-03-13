import { NextRequest, NextResponse } from "next/server";
import { generateStructuredContent } from "@/app/api/ai/genai";

// Updated evaluation schema: Each dimension now requires the explanation before the final numeric score,
// with clear descriptions and enforced property ordering.
const evaluationSchema = {
  type: "object",
  properties: {
    specificity: {
      type: "object",
      properties: {
        explanation: {
          type: "string",
          description: "Provide a detailed explanation for the evaluation of specificity, including reasoning and specific examples from the text."
        },
        score: {
          type: "number",
          minimum: 1,
          maximum: 10,
          description: "Final numeric score for specificity given after the detailed explanation."
        }
      },
      required: ["explanation", "score"],
      propertyOrdering: ["explanation", "score"]
    },
    structure: {
      type: "object",
      properties: {
        explanation: {
          type: "string",
          description: "Provide a detailed explanation for the evaluation of structure, including reasoning and specific examples from the text."
        },
        score: {
          type: "number",
          minimum: 1,
          maximum: 10,
          description: "Final numeric score for structure given after the detailed explanation."
        }
      },
      required: ["explanation", "score"],
      propertyOrdering: ["explanation", "score"]
    },
    voice: {
      type: "object",
      properties: {
        explanation: {
          type: "string",
          description: "Provide a detailed explanation for the evaluation of voice, including reasoning and specific examples from the text."
        },
        score: {
          type: "number",
          minimum: 1,
          maximum: 10,
          description: "Final numeric score for voice given after the detailed explanation."
        }
      },
      required: ["explanation", "score"],
      propertyOrdering: ["explanation", "score"]
    },
    relevance: {
      type: "object",
      properties: {
        explanation: {
          type: "string",
          description: "Provide a detailed explanation for the evaluation of relevance, including reasoning and specific examples from the text."
        },
        score: {
          type: "number",
          minimum: 1,
          maximum: 10,
          description: "Final numeric score for relevance given after the detailed explanation."
        }
      },
      required: ["explanation", "score"],
      propertyOrdering: ["explanation", "score"]
    },
    impact: {
      type: "object",
      properties: {
        explanation: {
          type: "string",
          description: "Provide a detailed explanation for the evaluation of impact, including reasoning and specific examples from the text."
        },
        score: {
          type: "number",
          minimum: 1,
          maximum: 10,
          description: "Final numeric score for impact given after the detailed explanation."
        }
      },
      required: ["explanation", "score"],
      propertyOrdering: ["explanation", "score"]
    },
    overallFeedback: {
      type: "string",
      description: "Provide overall feedback and recommendations for the essay."
    }
  },
  required: [
    "specificity",
    "structure",
    "voice",
    "relevance",
    "impact",
    "overallFeedback"
  ],
  // Enforce top-level ordering of keys for clarity.
  propertyOrdering: [
    "specificity",
    "structure",
    "voice",
    "relevance",
    "impact",
    "overallFeedback"
  ]
};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { content, prompt } = await request.json();

    // Revised prompt instructs the model to provide a thoughtful explanation before the final score.
    const analysisPrompt = `
      As an expert essay evaluator, analyze this college application essay across multiple dimensions.
      For each of the dimensions below, first provide a detailed explanation of your reasoning based on specific examples from the text, and then provide your final numeric score on a scale of 1-10.
      
      The dimensions to evaluate are:
      - Specificity: How well does the essay use concrete details and examples?
      - Structure: How well organized and logically flowing is the essay?
      - Voice: How authentic and personal is the writing style?
      - Relevance: How well does the essay address the prompt?
      - Impact: How memorable and compelling is the essay?
      
      Essay Prompt: ${prompt}
      
      Essay Content: ${content}
      
      Please ensure that your output adheres strictly to the provided JSON schema.
    `;

    const evaluation = await generateStructuredContent(analysisPrompt, {
      schema: evaluationSchema
    });

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Error evaluating essay:", error);
    return NextResponse.json(
      { error: "Failed to evaluate essay" },
      { status: 500 }
    );
  }
}
