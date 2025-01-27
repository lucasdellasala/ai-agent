import { AsyncLocalStorage } from 'async_hooks';

// Creamos una instancia global del almacenamiento
export const contextStorage = new AsyncLocalStorage<Map<string, any>>();
