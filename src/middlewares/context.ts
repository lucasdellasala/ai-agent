import { Request, Response, NextFunction } from 'express';
import { contextStorage } from '../context/context.store';

export function contextMiddleware(req: Request, res: Response, next: NextFunction) {
  const context = new Map<string, any>();
  
  context.set('requestId', Math.random().toString(36).substring(2, 11));
  context.set('startTime', Date.now());
  
  contextStorage.run(context, () => {
    res.on('finish', () => {
      const executionTime = Date.now() - context.get('startTime');
      console.log(`Request ${context.get('requestId')} took ${executionTime}ms`);
    });
    
    next();
  });
}