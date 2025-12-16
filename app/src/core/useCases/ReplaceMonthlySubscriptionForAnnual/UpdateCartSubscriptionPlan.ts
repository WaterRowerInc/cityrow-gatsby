import { CartService } from "../../domain/orders/CartService";
import { Cart } from "../../domain/orders/Cart";
import { CartItem } from "../../domain/orders/EcommerceCart";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";

export class UpdateCartSubscriptionPlan {
  private readonly cart: Cart;
  private readonly cartService: CartService;

  constructor(cart: Cart, cartService: CartService) {
    this.cart = cart;
    this.cartService = cartService;
  }

  execute = async (item: CartItem, newPlan: string, shouldChargeSubscription?: boolean) => {
    try {
      await this.cartService.removeItemFromCart(item.id);
      const cart = await this.cartService.addToCart([
        {
          isSubscription: true,
          options: [{ name: shouldChargeSubscription ? "Subscription" : "Plan", value: newPlan }],
          productId: item.productId,
          quantity: 1,
        },
      ]);
      this.cart.update(cart);
    } catch (e: any) {
      throw new NotExpectedError(e.message);
    }
  };
}
