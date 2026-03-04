// OTel must be imported before any other module to patch http/express
import './observability/otel-bootstrap';

import express from 'express';
import { env } from './config/env';
import { logger } from './observability/logger';
import { requestLogger } from './observability/request-logger.middleware';
import { contextMiddleware } from './agent/context/context.middleware';
import agentRoutes from './agent/agent.routes';

const app = express();

app.use(contextMiddleware);
app.use(express.json());
app.use(requestLogger);

app.use('/agent', agentRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, nodeEnv: env.NODE_ENV }, 'AI Agent server started');
});

// Graceful shutdown
function shutdown(signal: string) {
  logger.info({ signal }, 'Shutting down');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
