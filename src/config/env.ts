import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // LLM provider keys (at least one required)
  OPENAI_API_KEY: z.string().optional(),
  DEEPSEEK_API_KEY: z.string().optional(),

  // Guardrails
  MAX_INPUT_LENGTH: z.coerce.number().default(2000),
  MAX_TOKENS_PER_REQUEST: z.coerce.number().default(4096),
  SESSION_TOKEN_BUDGET: z.coerce.number().default(100000),
  TOKEN_BUDGET_WINDOW_MS: z.coerce.number().default(3600000), // 1 hour

  // Circuit breaker
  CIRCUIT_BREAKER_THRESHOLD: z.coerce.number().default(5),
  CIRCUIT_BREAKER_TIMEOUT_MS: z.coerce.number().default(30000),

  // Observability
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
  OTEL_SERVICE_NAME: z.string().default('ai-agent'),
  PROMETHEUS_PORT: z.coerce.number().default(9464),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  // Load .env file in non-test environments
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('dotenv').config();
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.format();
    console.error('Invalid environment variables:', JSON.stringify(formatted, null, 2));
    process.exit(1);
  }

  if (!result.data.OPENAI_API_KEY && !result.data.DEEPSEEK_API_KEY) {
    console.error('At least one LLM provider key is required (OPENAI_API_KEY or DEEPSEEK_API_KEY)');
    process.exit(1);
  }

  return result.data;
}

export const env = loadEnv();

/** Returns which LLM providers have API keys configured */
export function getAvailableProviders(): string[] {
  const available: string[] = [];
  if (env.OPENAI_API_KEY) available.push('openai');
  if (env.DEEPSEEK_API_KEY) available.push('deepseek');
  return available;
}

/** Returns the default provider based on which keys are available */
export function getDefaultProvider(): string {
  if (env.OPENAI_API_KEY) return 'openai';
  if (env.DEEPSEEK_API_KEY) return 'deepseek';
  return 'openai'; // unreachable due to startup validation
}
