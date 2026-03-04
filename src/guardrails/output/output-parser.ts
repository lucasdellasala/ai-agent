import { z } from 'zod';
import { logger } from '../../observability/logger';

/**
 * Parse content with a Zod schema, retrying with an LLM call on failure.
 * retryFn receives the original content + error message and should return a corrected string.
 */
export async function parseWithRetry<T>(
  schema: z.ZodType<T>,
  rawContent: string,
  retryFn: (content: string, error: string) => Promise<string>,
  maxRetries = 2,
): Promise<T> {
  let content = rawContent;
  let lastError: string | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const parsed = JSON.parse(content);
      return schema.parse(parsed);
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      logger.warn({ attempt, error: lastError }, 'Output parsing failed, retrying');

      if (attempt < maxRetries) {
        content = await retryFn(content, lastError);
      }
    }
  }

  throw new Error(`Output parsing failed after ${maxRetries + 1} attempts: ${lastError}`);
}
