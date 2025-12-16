import { CartService } from "../../domain/orders/CartService";

export class GetShippingOptions {
  private readonly cartService: CartService;

  constructor(cartService: CartService) {
    this.cartService = cartService;
  }

  execute = async () => await this.cartService.getShippingOptions();
}
