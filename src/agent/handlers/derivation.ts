import { logger } from '../../observability/logger';

export function handleDerivation(userMessage: string, userId: string, reason: string): void {
  logger.info({ type: 'DERIVATION', userId, reason, messageLength: userMessage.length }, 'Derivation requested');
}
