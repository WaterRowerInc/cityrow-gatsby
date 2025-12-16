import { Cart } from "../../../domain/orders/Cart";
import { CartItem } from "../../../domain/orders/EcommerceCart";
import { ProductService } from "../../../domain/products/ProductService";
import { CheckoutStartedRequest } from "../../../domain/analytics/CheckoutStartedRequest";
import { ProductAnalyticsRequest } from "../../../domain/analytics/ProductAnalyticsRequest";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics";

export class TrackAnalyticsCheckoutStarted {
  private readonly cart: Cart;
  private readonly productService: ProductService;
  private readonly trackAnalytics: TrackAnalytics;

  constructor(cart: Cart, productService: ProductService, trackAnalytics: TrackAnalytics) {
    this.cart = cart;
    this.productService = productService;
    this.trackAnalytics = trackAnalytics;
  }

  execute = async () => this.trackAnalytics.execute("Checkout Started", await this.parseOptions());

  private parseOptions = async (): Promise<CheckoutStartedRequest> => ({
    affiliation: "GO Website",
    cart_id: this.cart.id,
    coupon: this.cart.couponCode || "",
    currency: "USD",
    discount: this.cart.discounts,
    package: this.cart.getPackage(),
    products: await Promise.all(this.cart.items.map(async (item) => await this.parseItemsToOptions(item))),
    shipping: this.cart.shippingPrice,
    tax: this.cart.tax,
  });

  private parseItemsToOptions = async (item: CartItem): Promise<ProductAnalyticsRequest> => {
    try {
      const product = await this.productService.getFromSlugOrId(item.productId);
      return {
        product_id: product.id,
        brand: "CITYROW",
        category: product.categories.join(", "),
        coupon: "",
        image_url: product.images?.[0] || "",
        name: item.name,
        position: 1,
        price: item.price,
        quantity: item.quantity,
        sku: product.sku,
        url: "",
        variant: "",
      };
    } catch (e) {
      return {
        product_id: "",
        brand: "CITYROW",
        category: "",
        coupon: "",
        image_url: "",
        name: item.name,
        position: 1,
        price: item.price,
        quantity: item.quantity,
        sku: "",
        url: "",
        variant: "",
      };
    }
  };
}
