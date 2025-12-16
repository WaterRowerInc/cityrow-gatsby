import { ProductService } from "../../../domain/products/ProductService";
import { Cart } from "../../../domain/orders/Cart";
import { ProductAnalyticsRequest } from "../../../domain/analytics/ProductAnalyticsRequest";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics";

export class TrackAnalyticsProductAdded {
  private readonly cart: Cart;
  private readonly productService: ProductService;
  private readonly trackAnalytics: TrackAnalytics;

  constructor(cart: Cart, productService: ProductService, trackAnalytics: TrackAnalytics) {
    this.cart = cart;
    this.productService = productService;
    this.trackAnalytics = trackAnalytics;
  }

  execute = async (productId: string) =>
    await this.trackAnalytics.execute("Product Added", await this.parseOptions(productId));

  private parseOptions = async (productId: string): Promise<ProductAnalyticsRequest> => {
    const product = await this.productService.getFromSlugOrId(productId);
    return {
      cart_id: this.cart.id,
      package: this.cart.getPackage(),
      product_id: product.id,
      sku: product.sku,
      category: product.categories.join(", "),
      name: product.name,
      brand: "CITYROW",
      variant: "",
      price: product.price,
      quantity: product.quantity || 1,
      coupon: "",
      position: 1,
      url: window.location.href || "",
      image_url: product.images?.[0] || "",
    };
  };
}
