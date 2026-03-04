import { findOrderById } from '../data/mockDB';
import { IOrderStatus } from '../context/context';

export function handleOrderStatusRequest(orderIds?: string[]): IOrderStatus[] {
  if (!orderIds || orderIds.length === 0) {
    return [{ orderId: '', status: 'MISSING_ORDER_ID' }];
  }

  return orderIds.map((orderId) => {
    const order = findOrderById(orderId);
    return {
      orderId: order?.id ?? orderId,
      status: order?.status ?? 'ORDER_NOT_FOUND',
    };
  });
}
