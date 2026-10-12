import { type AgentResponseSchema } from 'twenty-shared/ai';

import { validateAgentStructuredOutput } from 'src/engine/metadata-modules/ai/ai-agent-execution/utils/validate-agent-structured-output.util';

const parseJson = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
};

const jsonCandidates = (text: string): string[] => {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1];
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');

  return [
    trimmed,
    ...(fenced !== undefined ? [fenced.trim()] : []),
    ...(firstBrace !== -1 && lastBrace > firstBrace
      ? [trimmed.slice(firstBrace, lastBrace + 1)]
      : []),
  ];
};

// An agent told to answer with the JSON usually already did, and re-asking a
// model that ignores response_format schemas only adds a chance to get it wrong.
export const parseAgentStructuredOutputFromText = (
  schema: AgentResponseSchema,
  text: string,
): Record<string, unknown> | null => {
  for (const candidate of jsonCandidates(text)) {
    const validation = validateAgentStructuredOutput(
      schema,
      parseJson(candidate),
    );

    if (validation.success) {
      return validation.value;
    }
  }

  return null;
};
