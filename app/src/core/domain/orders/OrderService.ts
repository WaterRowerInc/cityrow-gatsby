import { Order } from "./Order";

export interface OrderService {
  createOrder(): Promise<Order>;
  getOrder(): Promise<Order>;
}
