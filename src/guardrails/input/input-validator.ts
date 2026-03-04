import { z } from 'zod';
import { env } from '../../config/env';

export const AgentRequestSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(env.MAX_INPUT_LENGTH, `Message exceeds maximum length of ${env.MAX_INPUT_LENGTH} characters`),
  userId: z.string().optional().default('anonymous'),
  provider: z.enum(['openai', 'deepseek']).optional().default('openai'),
});

export type AgentRequest = z.infer<typeof AgentRequestSchema>;

export function validateInput(body: unknown): { success: true; data: AgentRequest } | { success: false; error: string } {
  const result = AgentRequestSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((i) => i.message).join('; ');
    return { success: false, error: errors };
  }

  return { success: true, data: result.data };
}
