export const ordersDB = [
  { id: "1", status: "En tránsito" },
  { id: "2", status: "Entregado" },
  { id: "3", status: "Pendiente de despacho" },
];

export const productsDB = [
  { id: "P-100", name: "Rueda", stock: 10 },
  { id: "P-200", name: "Freno", stock: 5 },
  { id: "P-300", name: "Volante", stock: 0 },
];

export const usersDB = [
  { id: "U-001", name: "John Doe" },
  { id: "U-002", name: "Jane Doe" },
];

export function findOrderById(orderId: string) {
  return ordersDB.find((o) => o.id === orderId);
}

export const logs: any[] = [];
