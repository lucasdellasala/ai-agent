import { logDerivation } from "../../utils/logger";

export function handleDerivation(userMessage: string, userId: string, reason: string): void {
  logDerivation(userMessage, userId, reason);
}
