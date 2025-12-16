import { CartCallback, CartService, CartSubscription } from "../../domain/orders/CartService";
import { Cart } from "../../domain/orders/Cart";
import { ProductService } from "../../domain/products/ProductService";

export class GetCart {
  private readonly cart: Cart;
  private readonly cartService: CartService;
  private readonly productService: ProductService;

  constructor(cart: Cart, cartService: CartService, productService: ProductService) {
    this.cart = cart;
    this.cartService = cartService;
    this.productService = productService;
  }

  execute = async (): Promise<Cart> => {
    const ecommerceCart = await this.cartService.getCart();
    return this.cart.update(ecommerceCart);
  };

  subscribe = (callback: CartCallback): CartSubscription => {
    return this.cartService.subscribe(async (ecommerceCart) => {
      return callback(this.cart.update(ecommerceCart));
    });
  };
}
