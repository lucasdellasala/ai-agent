import { contextStorage } from './context.store';

export interface IUser {
  name: string;
  id: string;
}

export interface IProduct {
  productName: string;
  available?: boolean;
}

export interface IOrderStatus {
  orderId: string;
  status: string;
}

export interface IProductOffer {
  products: Array<IProduct>;
}

export interface IDerivation {
  reason: string;
}

export interface IOffTopic {
  message: string;
}

export interface IUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface IContext {
  provider?: string;
  user?: IUser;
  orders?: Array<IOrderStatus>;
  productOffer?: IProductOffer;
  derivation?: IDerivation;
  offTopic?: IOffTopic;
  usage?: IUsage;
}

type ContextKey = keyof IContext;

type ContextValue<T extends ContextKey> = IContext[T];

export class Context {
  static get<T extends ContextKey>(key: T): IContext[T] | undefined {
    const store = contextStorage.getStore();
    return store?.get(key);
  }

  static getFullContext(): IContext {
    const store = contextStorage.getStore();
    return store ? Object.fromEntries(store) : {};
  }

  static update<T extends ContextKey>(key: T, value: ContextValue<T>): void {
    const store = contextStorage.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  static updateUsage(newUsage: IUsage): void {
    const currentUsage = Context.get('usage') ?? {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    };

    const updatedUsage: IUsage = {
      prompt_tokens: currentUsage.prompt_tokens + newUsage.prompt_tokens,
      completion_tokens: currentUsage.completion_tokens + newUsage.completion_tokens,
      total_tokens: currentUsage.total_tokens + newUsage.total_tokens,
    };

    this.update('usage', updatedUsage);
  }
}
