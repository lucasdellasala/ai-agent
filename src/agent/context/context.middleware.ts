import { Request, Response, NextFunction } from 'express';
import { contextStorage } from './context.store';

export function contextMiddleware(req: Request, res: Response, next: NextFunction): void {
  const context = new Map<string, unknown>();
  context.set('requestId', Math.random().toString(36).substring(2, 11));
  context.set('startTime', Date.now());

  contextStorage.run(context, () => next());
}
