import { ChatCompletionTool } from 'openai/resources';

export const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'handle_order_status',
      description: 'Consulta el estado de un pedido.',
      parameters: {
        type: 'object',
        properties: {
          orderIds: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['orderIds'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'handle_product_offer',
      description: 'Ofrece informacion sobre los productos disponibles.',
      parameters: {
        type: 'object',
        properties: {
          products: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['products'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'handle_derivation',
      description: 'Deriva la conversacion a un agente humano.',
      parameters: {
        type: 'object',
        properties: {
          reason: { type: 'string' },
        },
        required: ['reason'],
      },
    },
  },
];
