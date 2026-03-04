import { NextFunction, Request, Response } from 'express';
import { selectProvider } from '../llm/provider.selector';
import { usersDB } from './data/mockDB';
import { handleOrderStatusRequest } from './handlers/orderStatusRequest';
import { handleOfferProducts } from './handlers/offerProducts';
import { handleDerivation } from './handlers/derivation';
import { handleOffTopic } from './handlers/offTopic';
import { Context } from './context/context';
import { logger } from '../observability/logger';

export const processUserMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const providerName = req.body.provider || 'openai';
    const provider = selectProvider(providerName);
    Context.update('provider', providerName);

    const userMessage: string = req.body.message;
    const userId: string = req.body.userId || 'anonymous';
    const userName = usersDB.find((u) => u.id === userId)?.name ?? 'anonymous';
    Context.update('user', { id: userId, name: userName });

    logger.info({ provider: providerName, userId, messageLength: userMessage.length }, 'Processing message');

    const providerResponse = await provider.getMessageIntent(userMessage);

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

    const friendlyResponse = await provider.createFriendlyResponse(userMessage, userName);

    return res.json({
      context: Context.getFullContext(),
      message: friendlyResponse.content,
      provider_response: providerResponse,
    });
  } catch (error) {
    next(error);
  }
};
