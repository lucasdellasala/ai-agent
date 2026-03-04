import { logger } from '../../observability/logger';

export function handleOffTopic(userMessage: string, userId: string, reason: string): void {
  logger.info({ type: 'OFF_TOPIC', userId, reason, messageLength: userMessage.length }, 'Off-topic message');
}
