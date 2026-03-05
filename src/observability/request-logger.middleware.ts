import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { logger, hashPrompt } from './logger';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = randomUUID().slice(0, 8);
  const start = Date.now();

  // Attach requestId for downstream use
  (req as unknown as Record<string, unknown>).requestId = requestId;

  res.on('finish', () => {
    const latencyMs = Date.now() - start;
    logger.info({
      requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      latencyMs,
      ...(req.body?.message ? { promptHash: hashPrompt(req.body.message) } : {}),
    }, 'Request completed');
  });

  next();
}
