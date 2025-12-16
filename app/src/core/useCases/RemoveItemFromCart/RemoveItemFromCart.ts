import { ProductService } from "../../domain/products/ProductService";
import { CartItem } from "../../domain/orders/EcommerceCart";
import { CartService } from "core/domain/orders/CartService";
import { Cart } from "../../domain/orders/Cart";
import { ItemDoesNotExistOnCartError } from "../../domain/orders/ItemDoesNotExistOnCartError";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics/TrackAnalytics";

export class RemoveItemFromCart {
  private readonly cart: Cart;
  private readonly cartService: CartService;
  private readonly productService: ProductService;
  private readonly trackAnalytics: TrackAnalytics;

  constructor(cart: Cart, cartService: CartService, productService: ProductService, trackAnalytics: TrackAnalytics) {
    this.cart = cart;
    this.cartService = cartService;
    this.productService = productService;
    this.trackAnalytics = trackAnalytics;
  }

  execute = async (itemId: string): Promise<Cart> => {
    const item = this.getItem(itemId);
    if (!item) throw new ItemDoesNotExistOnCartError();

    const ecommerceCart = await this.cartService.removeItemFromCart(itemId);
    const product = await this.productService.getFromSlugOrId(item.productId);
    await this.trackProductRemoved(product.id, product.slug);
    return this.cart.update(ecommerceCart);
  };

  private getItem = (itemId: string): CartItem | undefined => this.cart?.items?.find((item) => item.id === itemId);

  private trackProductRemoved = async (id: string, slug: string) =>
    this.trackAnalytics.execute("Product Removed", {
      product_id: id,
      product_slug: slug,
    });
}
