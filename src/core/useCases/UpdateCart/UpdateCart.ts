import { CartService } from "../../domain/orders/CartService";
import { UpdateCartRequest } from "../../domain/orders/UpdateCartRequest";
import { Cart } from "../../domain/orders/Cart";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";

export class UpdateCart {
  private readonly cart: Cart;
  private readonly cartService: CartService;

  constructor(cart: Cart, cartService: CartService) {
    this.cart = cart;
    this.cartService = cartService;
  }

  execute = async (updateCartRequest: UpdateCartRequest): Promise<Cart> => {
    try {
      const ecommerceCart = await this.cartService.updateCart(updateCartRequest);
      return this.cart.update(ecommerceCart);
    } catch (e: any) {
      throw new NotExpectedError(e.message);
    }
  };
}
