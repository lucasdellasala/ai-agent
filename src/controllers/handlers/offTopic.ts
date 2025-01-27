import { logOffTopic } from "../../utils/logger";

export function handleOffTopic(userMessage: string, userId: string, reason: string): void {
  logOffTopic(userMessage, userId, reason);
}
