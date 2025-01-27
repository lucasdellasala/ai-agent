import { findOrderById } from "../../data/mockDB";
import { IOrderStatus } from "../../context/context";

export function handleOrderStatusRequest(
  orderIds?: Array<string>
): Array<IOrderStatus> {
  if (!orderIds || orderIds?.length === 0) {
    return [
      {
        orderId: "",
        status: "MISSING_ORDER_ID",
      },
    ];
  }

  const orders = orderIds?.map((orderId: string) => findOrderById(orderId));

  if (!orders || orders?.length === 0) {
    return orderIds?.map((orderId: string) => ({
      orderId,
      status: "ORDER_NOT_FOUND",
    }));
  }

  return orders.map((order) => ({
    orderId: order?.id ?? "",
    status: order?.status ?? "",
  }));
}
