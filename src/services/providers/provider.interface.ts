export interface ILanguageModelProvider {
  getMessageIntent: (userMessage: string) => Promise<any>;
  createFriendlyResponse: (initialMessage: string, userName?: string) => Promise<any>;
}
