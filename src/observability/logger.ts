import pino from 'pino';
import { createHash } from 'crypto';

const isDev = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  ...(isDev
    ? { transport: { target: 'pino-pretty', options: { colorize: true } } }
    : {}),
  redact: {
    paths: ['req.headers.authorization', 'apiKey', '*.apiKey', '*.api_key', 'env.OPENAI_API_KEY', 'env.DEEPSEEK_API_KEY'],
    censor: '[REDACTED]',
  },
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
});

/** Hash prompt content for logging without exposing PII */
export function hashPrompt(content: string): string {
  return createHash('sha256').update(content).digest('hex').slice(0, 12);
}
