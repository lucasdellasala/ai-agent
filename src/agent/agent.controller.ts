import { NextFunction, Request, Response } from 'express';
import { selectProvider } from '../llm/provider.selector';
import { usersDB } from './data/mockDB';
import { handleOrderStatusRequest } from './handlers/orderStatusRequest';
import { handleOfferProducts } from './handlers/offerProducts';
import { handleDerivation } from './handlers/derivation';
import { handleOffTopic } from './handlers/offTopic';
import { Context } from './context/context';
import { logger } from '../observability/logger';
import { validateInput } from '../guardrails/input/input-validator';
import { sanitizeInput } from '../guardrails/input/sanitization';
import { detectPromptInjection } from '../guardrails/input/prompt-injection';
import { tokenBudgetLimiter } from '../guardrails/rate-limiter/rate-limiter';
import { circuitBreaker } from '../guardrails/rate-limiter/circuit-breaker';
import { runContentFilters } from '../guardrails/output/content-filter';
import { env } from '../config/env';

export const processUserMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate input
    const validation = validateInput(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }

    const { provider: providerName, userId } = validation.data;

    // 2. Sanitize input
    const userMessage = sanitizeInput(validation.data.message);

    // 3. Detect prompt injection
    const injection = detectPromptInjection(userMessage);
    if (injection.detected) {
      logger.warn({ userId, patterns: injection.patterns, riskScore: injection.riskScore }, 'Prompt injection detected');
      return res.status(400).json({
        error: 'Input rejected: potential prompt injection detected',
        riskScore: injection.riskScore,
      });
    }

    // 4. Check rate limit
    const budget = tokenBudgetLimiter.check(userId, env.MAX_TOKENS_PER_REQUEST);
    if (!budget.allowed) {
      logger.warn({ userId, remaining: budget.remaining }, 'Token budget exceeded');
      return res.status(429).json({
        error: 'Token budget exceeded',
        remaining: budget.remaining,
      });
    }

    // 5. Setup context
    const provider = selectProvider(providerName);
    Context.update('provider', providerName);
    const userName = usersDB.find((u) => u.id === userId)?.name ?? 'anonymous';
    Context.update('user', { id: userId, name: userName });

    logger.info({ provider: providerName, userId, messageLength: userMessage.length }, 'Processing message');

    // 6. LLM call through circuit breaker
    const providerResponse = await circuitBreaker.execute(() => provider.getMessageIntent(userMessage));

    // Record token usage in rate limiter
    tokenBudgetLimiter.consume(userId, providerResponse.metadata.totalTokens);

    // 7. Handle intents
    for (const intentType of providerResponse.types) {
      switch (intentType) {
        case 'ORDER_STATUS': {
          const orderIds = providerResponse.details?.orderIds ?? [];
          Context.update('orders', handleOrderStatusRequest(orderIds));
          break;
        }
        case 'PRODUCT_OFFER': {
          const products = providerResponse.details?.products ?? [];
          Context.update('productOffer', handleOfferProducts(products));
          break;
        }
        case 'DERIVATION': {
          const reason = providerResponse.details?.reasons?.[0] ?? 'Consulta compleja';
          handleDerivation(userMessage, userId, reason);
          break;
        }
        case 'OFF_TOPIC': {
          const reason = providerResponse.details?.reasons?.[0] ?? 'Tema no relacionado';
          handleOffTopic(userMessage, userId, reason);
          break;
        }
      }
    }

    const needsFriendlyResponse =
      providerResponse.types.includes('ORDER_STATUS') ||
      providerResponse.types.includes('PRODUCT_OFFER');

    if (!needsFriendlyResponse) {
      return res.json({
        context: Context.getFullContext(),
        provider_response: providerResponse,
      });
    }

    // 8. Generate friendly response through circuit breaker
    const friendlyResponse = await circuitBreaker.execute(() =>
      provider.createFriendlyResponse(userMessage, userName),
    );

    tokenBudgetLimiter.consume(userId, friendlyResponse.metadata.totalTokens);

    // 9. Content filter on output
    const filterResult = runContentFilters(friendlyResponse.content);
    if (!filterResult.passed) {
      logger.warn({ reasons: filterResult.reasons }, 'Content filter blocked response');
      return res.json({
        context: Context.getFullContext(),
        message: 'Lo siento, no puedo responder a eso en este momento.',
        filtered: true,
        provider_response: providerResponse,
      });
    }

    return res.json({
      context: Context.getFullContext(),
      message: friendlyResponse.content,
      provider_response: providerResponse,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Circuit breaker')) {
      return res.status(503).json({ error: error.message });
    }
    next(error);
  }
};
