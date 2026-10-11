import { isPlainObject } from 'twenty-shared/utils';
import { type AgentResponseSchema } from 'twenty-shared/ai';

type StructuredOutputValidation =
  | { success: true; value: Record<string, unknown> }
  | { success: false; error: Error };

// The JSON a model returns is only parsed, never checked, so an output with
// made-up keys would reach the workflow as if it were valid and every
// {{step.field}} reference would silently resolve to nothing.
export const validateAgentStructuredOutput = (
  schema: AgentResponseSchema,
  value: unknown,
): StructuredOutputValidation => {
  if (!isPlainObject(value)) {
    return {
      success: false,
      error: new Error('Structured output is not a JSON object'),
    };
  }

  const expectedKeys = Object.keys(schema.properties);
  const missingKeys = expectedKeys.filter((key) => !(key in value));
  const unexpectedKeys = Object.keys(value).filter(
    (key) => !expectedKeys.includes(key),
  );
  const mistypedKeys = expectedKeys.filter(
    (key) =>
      key in value &&
      value[key] !== null &&
      typeof value[key] !== schema.properties[key].type,
  );

  if (
    missingKeys.length === 0 &&
    unexpectedKeys.length === 0 &&
    mistypedKeys.length === 0
  ) {
    return { success: true, value };
  }

  const problems = [
    missingKeys.length > 0 ? `missing ${missingKeys.join(', ')}` : null,
    unexpectedKeys.length > 0
      ? `unexpected ${unexpectedKeys.join(', ')}`
      : null,
    mistypedKeys.length > 0
      ? `wrong type for ${mistypedKeys.join(', ')}`
      : null,
  ].filter((problem) => problem !== null);

  return {
    success: false,
    error: new Error(
      `Structured output does not match the schema: ${problems.join('; ')}`,
    ),
  };
};
