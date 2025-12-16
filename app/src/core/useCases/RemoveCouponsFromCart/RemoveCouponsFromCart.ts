import { CartService } from "core/domain/orders/CartService";
import { Cart } from "../../domain/orders/Cart";

export class RemoveCouponsFromCart {
  private readonly cartService: CartService;
  private readonly cart: Cart;

  constructor(cart: Cart, cartService: CartService) {
    this.cartService = cartService;
    this.cart = cart;
  }

  execute = async (): Promise<Cart> => {
    const ecommerceCart = await this.cartService.removeCouponsFromCart();
    return this.cart.update(ecommerceCart);
  };
}
