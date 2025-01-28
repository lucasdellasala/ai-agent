import { NextFunction, Request, Response } from "express";
import { selectProvider } from "../services/providers/provider.selector";
import { usersDB } from "../data/mockDB";
import { handleOrderStatusRequest } from "./handlers/orderStatusRequest";
import { handleOfferProducts } from "./handlers/offerProducts";
import { handleDerivation } from "./handlers/derivation";
import { handleOffTopic } from "./handlers/offTopic";
import { Context } from "../context/context";

export const processUserMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const providerName = req.body.provider || "openai";
    const provider = selectProvider(providerName);
    Context.update("provider", providerName);

    const userMessage = req.body.message;
    const userId = req.body.userId || "anonymous";
    const userName = usersDB.find((u) => u.id === userId)?.name;
    Context.update("user", { id: userId, name: userName ?? "anonymous" });

    const providerResponse = await provider.getMessageIntent(userMessage);

    for (const intentType of providerResponse.types) {
      switch (intentType) {
        case "ORDER_STATUS": {
          const orderIds = providerResponse.details?.orderIds || [];
          const orders = handleOrderStatusRequest(orderIds);
          Context.update("orders", orders);
          break;
        }

        case "PRODUCT_OFFER": {
          const products = providerResponse.details?.products || [];
          const productOffer = handleOfferProducts(products);
          Context.update("productOffer", productOffer);
          break;
        }

        case "DERIVATION": {
          const reason =
            providerResponse.details?.reason || "Consulta compleja";
          handleDerivation(userMessage, userId, reason);
          break;
        }

        case "OFF_TOPIC": {
          const reason =
            providerResponse.details?.reason || "Tema no relacionado";
          handleOffTopic(userMessage, userId, reason);
          break;
        }
      }
    }

    const isOrderStatusOrProductOffer = providerResponse.types.includes("ORDER_STATUS") || providerResponse.types.includes("PRODUCT_OFFER");

    const shouldRespond = isOrderStatusOrProductOffer;
    console.log({isOrderStatusOrProductOffer}, {shouldRespond});

    if (!shouldRespond) {
      return res.json({
        context: Context.getFullContext(),
        provider_response: providerResponse,
      });
    }

    const { content: finalResponse } = await provider.createFriendlyResponse(
      userMessage,
      userName
    );

    return res.json({
      context: Context.getFullContext(),
      message: finalResponse,
      provider_response: providerResponse,
    });
  } catch (error) {
    next(error);
  }
};
