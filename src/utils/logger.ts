import { logs } from "../data/mockDB";

export function logDerivation(
  userMessage: string,
  userId: string,
  reason: string
) {
  logs.push({
    type: "DERIVATION",
    userId,
    userMessage,
    reason,
    timestamp: new Date().toISOString(),
  });
}

export function logOffTopic(
  userMessage: string,
  userId: string,
  reason: string
) {
  logs.push({
    type: "OFF_TOPIC",
    userId,
    userMessage,
    reason,
    timestamp: new Date().toISOString(),
  });
}
