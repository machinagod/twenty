import { type AgentResponseSchema } from 'twenty-shared/ai';

// Providers without native structured outputs (openai-compatible ones such as
// OpenRouter) drop the response_format schema and only ask for "some JSON", so
// the schema has to travel in the prompt for the model to know the keys.
export const buildStructuredOutputPrompt = ({
  executionResultsText,
  schema,
}: {
  executionResultsText: string;
  schema: AgentResponseSchema;
}): string => `Based on the following execution results, generate the structured output according to the schema.

Execution Results: ${executionResultsText}

Answer with a single JSON object that matches this JSON schema exactly: use these keys and no others, with the given value types.

${JSON.stringify(schema, null, 2)}`;
