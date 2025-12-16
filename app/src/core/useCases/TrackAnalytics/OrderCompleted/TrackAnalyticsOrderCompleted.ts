import { Cart } from "../../../domain/orders/Cart";
import { OrderCompletedRequest } from "../../../domain/analytics/OrderCompletedRequest";
import { Order } from "../../../domain/orders/Order";
import { CartItem } from "../../../domain/orders/EcommerceCart";
import { ProductAnalyticsRequest } from "../../../domain/analytics/ProductAnalyticsRequest";
import { ProductService } from "../../../domain/products/ProductService";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics";

export class TrackAnalyticsOrderCompleted {
  private readonly cart: Cart;
  private readonly productService: ProductService;
  private readonly trackAnalytics: TrackAnalytics;

  constructor(cart: Cart, productService: ProductService, trackAnalytics: TrackAnalytics) {
    this.cart = cart;
    this.productService = productService;
    this.trackAnalytics = trackAnalytics;
  }

  execute = async (order: Order) =>
    await this.trackAnalytics.execute("Order Completed", await this.parseOptions(order));

  private parseOptions = async (order: Order): Promise<OrderCompletedRequest> => ({
    affiliation: "GO Website",
    coupon: order.coupon,
    currency: order.currency,
    discount: order.discounts,
    order_id: order.id,
    package: this.cart.getPackage(),
    products: await Promise.all(this.cart.items.map(async (item) => await this.parseItemsToOptions(item))),
    revenue: order.total - order.taxes - order.shipmentTotal,
    shipping: order.shipmentTotal,
    shipping_method: order.shipping.deliveryType,
    tax: order.taxes,
    total: order.total,
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
        revenueType: item.isSubscription ? "Recurring" : "Purchase",
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
