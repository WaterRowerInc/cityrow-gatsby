import { SessionStorage } from "../../domain/auth/SessionStorage";
import { CartService } from "../../domain/orders/CartService";
import { Item } from "../../domain/orders/Item";
import { Cart } from "../../domain/orders/Cart";
import { TwoActiveSubscriptionsError } from "../../domain/subscriptions/TwoActiveSubscriptionsError";
import { CannotAddTwoSubscriptionPackagesError } from "../../domain/subscriptions/CannotAddTwoSubscriptionPackagesError";
import { SubscriptionService } from "../../domain/subscriptions/SubscriptionService";
import { AlreadyHaveActiveSubscriptionError } from "../../domain/subscriptions/AlreadyHaveActiveSubscriptionError";

export class AddToCart {
  private readonly cart: Cart;
  private readonly cartService: CartService;
  private readonly subscriptionService: SubscriptionService;
  private readonly sessionStorage: SessionStorage;

  constructor(
    cart: Cart,
    cartService: CartService,
    subscriptionService: SubscriptionService,
    sessionStorage: SessionStorage
  ) {
    this.cart = cart;
    this.cartService = cartService;
    this.subscriptionService = subscriptionService;
    this.sessionStorage = sessionStorage;
  }

  execute = async (items: Item[]) => {
    if (this.hasSubscriptionPackage(items)) return this.addToCartItemsWithSubscriptionPackage(items);
    if (this.hasSubscription(items)) return this.addToSubscriptionToCart(items);
    await this.addToCart(items);
  };

  private hasSubscriptionPackage = (items: Item[]) => !!items.find((item) => item.hasSubscriptionPackage);

  private addToCartItemsWithSubscriptionPackage = async (items: Item[]) => {
    if (this.cart.hasSubscriptionPackage) throw new CannotAddTwoSubscriptionPackagesError();
    await this.addToCart(items);
  };

  private hasSubscription = (items: Item[]) => !!items.find((item) => item.isSubscription);

  private addToSubscriptionToCart = async (items: Item[]) => {
    if (this.cart.hasSubscription) throw new TwoActiveSubscriptionsError();
    if (await this.sessionStorage.hasSession()) {
      const subscriptionStatus = await this.subscriptionService.getSubscriptionStatus();
      if (subscriptionStatus && subscriptionStatus !== "canceled") throw new AlreadyHaveActiveSubscriptionError();
    }
    await this.addToCart(items);
  };

  private addToCart = async (items: Item[]) => {
    const ecommerceCart = await this.cartService.addToCart(items);
    this.cart.update(ecommerceCart);
  };
}
