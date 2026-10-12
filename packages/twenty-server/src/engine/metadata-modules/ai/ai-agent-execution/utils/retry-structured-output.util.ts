import { NoObjectGeneratedError } from 'ai';

// Routers such as openrouter/free answer each call with a different model, so
// an output that ignored the schema is worth asking for again.
export const retryStructuredOutput = async <TOutput>({
  maxAttempts,
  generate,
  onFailedAttempt,
}: {
  maxAttempts: number;
  generate: () => Promise<TOutput | null>;
  onFailedAttempt: (attempt: number, error: Error) => void;
}): Promise<TOutput | null> => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const output = await generate();

      if (output !== null) {
        return output;
      }
    } catch (error) {
      if (
        !NoObjectGeneratedError.isInstance(error) ||
        attempt === maxAttempts
      ) {
        throw error;
      }
      onFailedAttempt(attempt, error);
    }
  }

  return null;
};
