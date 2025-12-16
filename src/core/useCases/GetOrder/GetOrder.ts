import { Order } from "../../domain/orders/Order";
import { OrderService } from "../../domain/orders/OrderService";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";

export class GetOrder {
  private readonly orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  execute = async (): Promise<Order> => {
    try {
      return await this.orderService.getOrder();
    } catch (e: any) {
      throw new NotExpectedError(e.message);
    }
  };
}
