// genai.ts

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

if (!process.env.GEMINI_KEY) {
  throw new Error("GEMINI_KEY environment variable is not set");
}

const defaultModelName = process.env.GEMINI_MODEL || "gemini-2.0-flash-exp";
const apiKey: string = process.env.GEMINI_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// A default generative model instance without extra schema configuration.
const defaultModel = genAI.getGenerativeModel({ model: defaultModelName });

/**
 * Parses the raw text response to a JSON object of type T.
 * This function removes markdown formatting (e.g. backticks) and trims extra content.
 *
 * @param textResponse - The raw text response from Gemini Generative AI.
 * @returns The parsed JSON object.
 * @throws If the text cannot be parsed as JSON.
 */
export function parseJSONResponse<T = any>(textResponse: string): T {
  let cleanedText = textResponse.replace(/`/g, '').trim();
  cleanedText = cleanedText.replace(/^`?json\n?|`$/g, '').trim();

  // Cut off any trailing text past the final closing brace.
  const lastBraceIndex = cleanedText.lastIndexOf('}');
  if (lastBraceIndex !== -1) {
    cleanedText = cleanedText.slice(0, lastBraceIndex + 1);
  }
  
  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Failed to parse JSON response:", error, cleanedText);
    throw new Error("Invalid JSON response");
  }
}

/**
 * Options for structured content generation.
 */
export interface StructuredGenerationOptions<T = any> {
  /**
   * A JSON Schema object defining the expected output.
   * When provided, the helper creates a new model instance with generationConfig set to:
   *    responseMimeType: "application/json",
   *    responseSchema: schema
   */
  schema?: any;
  /**
   * A custom parser function to transform the output text into type T.
   * Defaults to JSON parsing if not provided.
   */
  parser?: (text: string) => T;
  /**
   * Optional override for the model name (e.g., "gemini-1.5-pro").
   */
  modelName?: string;
  /**
   * Extra options that will be passed directly to the generateContent API call.
   */
  extraOptions?: Record<string, any>;
}

/**
 * Generates structured content using Gemini Generative AI.
 *
 * This function abstracts the difficulty of configuring the model.
 * If a schema is provided in options, it automatically creates a model instance with that schema.
 * Otherwise, it uses the default model and assumes you might be providing schema instructions in the prompt.
 *
 * @param prompt - The prompt or conversation context.
 * @param options - Structured generation options (schema, custom parser, model override, etc.).
 * @returns The structured output of type T.
 * @throws If generation or parsing fails.
 */
export async function generateStructuredContent<T = any>(
  prompt: string | any[],
  options: StructuredGenerationOptions<T> = {}
): Promise<T> {
  const { schema, parser, modelName, extraOptions } = options;
  let modelInstance;
  
  if (schema) {
    // Create a new model instance with the JSON schema configured.
    modelInstance = genAI.getGenerativeModel({
      model: modelName || defaultModelName,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
      ...extraOptions,
    });
  } else {
    // Use the default model instance.
    modelInstance = defaultModel;
  }

  try {
    // Pass structuredOutput true by default along with any extra options.
    const response = await modelInstance.generateContent(
      prompt,
      {...extraOptions }
    );
    const textResponse = response.response.text();
    
    // Use the custom parser if provided; otherwise, default to JSON parsing.
    return parser ? parser(textResponse) : parseJSONResponse<T>(textResponse);
  } catch (error) {
    console.error("Error generating structured content:", error);
    throw error;
  }
}

/**
 * Generates content without any additional structured output configuration.
 *
 * Use this function if you prefer to handle raw responses or specify schema details via your prompt.
 *
 * @param prompt - The prompt or conversation context.
 * @param extraOptions - Extra options for the generation call.
 * @returns The raw response from Gemini Generative AI.
 */
export async function generateContent(
  prompt: string | any[],
  extraOptions: Record<string, any> = {}
): Promise<any> {
  try {
    const response = await defaultModel.generateContent(prompt, extraOptions);
    return response;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}


// import { generateStructuredContent, generateContent, parseJSONResponse } from '@/lib/genai';
// Generate structured JSON output using a schema:

// ts
// Copy
// Edit
// // Define your JSON schema (note property ordering is important).
// const recipeSchema = {
//   description: "List of recipes",
//   type: "array",
//   items: {
//     type: "object",
//     properties: {
//       recipeName: {
//         type: "string",
//         description: "Name of the recipe",
//         nullable: false,
//       },
//     },
//     required: ["recipeName"],
//     propertyOrdering: ["recipeName"]
//   },
// };

// const prompt = "List a few popular cookie recipes.";
// const recipes = await generateStructuredContent(prompt, {
//   schema: recipeSchema,
//   // Optional: a custom parser can be provided if desired.
//   // parser: (text) => myCustomParser(text),
// });

// console.log(recipes);