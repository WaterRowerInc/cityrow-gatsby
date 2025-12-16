import { CartService } from "../../domain/orders/CartService";
import { AuthService } from "../../domain/auth/AuthService";
import { SubscriptionService } from "../../domain/subscriptions/SubscriptionService";
import { SessionStorage } from "../../domain/auth/SessionStorage";
import { UserStorage } from "../../domain/user/UserStorage";
import { Cart } from "../../domain/orders/Cart";
import { User } from "../../domain/user/User";
import { IdentifyTraits } from "../../domain/analytics/IdentifyTraits";
import { IdentifyAnalyticsUser } from "../TrackAnalytics/Identify/IdentifyAnalyticsUser";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics/TrackAnalytics";

export class LogIn {
  private readonly authService: AuthService;
  private readonly cart: Cart;
  private readonly cartService: CartService;
  private readonly identifyAnalyticsUser: IdentifyAnalyticsUser;
  private readonly sessionStorage: SessionStorage;
  private readonly subscriptionService: SubscriptionService;
  private readonly trackAnalytics: TrackAnalytics;
  private readonly userStorage: UserStorage;

  constructor(
    authService: AuthService,
    cart: Cart,
    cartService: CartService,
    identifyAnalyticsUser: IdentifyAnalyticsUser,
    sessionStorage: SessionStorage,
    subscriptionService: SubscriptionService,
    trackAnalytics: TrackAnalytics,
    userStorage: UserStorage
  ) {
    this.authService = authService;
    this.cart = cart;
    this.cartService = cartService;
    this.identifyAnalyticsUser = identifyAnalyticsUser;
    this.sessionStorage = sessionStorage;
    this.subscriptionService = subscriptionService;
    this.trackAnalytics = trackAnalytics;
    this.userStorage = userStorage;
  }

  execute = async (email: string, password: string): Promise<void> => {
    const { user, token } = await this.authService.logIn(email, password);
    await this.userStorage.store(user);
    await this.sessionStorage.store(token);
    try {
      const subscriptionStatus = await this.subscriptionService.getSubscriptionStatus();
      if (subscriptionStatus && subscriptionStatus !== "canceled") {
        await this.cartService.removeSubscriptionsFromCart();
        this.cart.hasSubscription = false;
      }
    } catch (error: any) {
      this.cart.hasSubscription = false;
    }
    await this.identifyAnalyticsUser.execute(this.parseTraits(user));
    await this.trackWebSignedIn();
  };

  private parseTraits = (user: User): IdentifyTraits => ({
    user_id: user.pk!,
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
  });

  private trackWebSignedIn = async () => this.trackAnalytics.execute("Web Signed In");
}
