import { DeleteUser } from "../DeleteUser/DeleteUser";
import { OrderService } from "../../domain/orders/OrderService";
import { CartService } from "../../domain/orders/CartService";
import { Order } from "../../domain/orders/Order";
import { UpdateCartRequest } from "../../domain/orders/UpdateCartRequest";
import { Cart } from "../../domain/orders/Cart";
import { TrackAnalyticsOrderCompleted } from "../TrackAnalytics/OrderCompleted/TrackAnalyticsOrderCompleted";
import { IdentifyTraits } from "../../domain/analytics/IdentifyTraits";
import { IdentifyAnalyticsUser } from "../TrackAnalytics/Identify/IdentifyAnalyticsUser";
import { RegisterUser } from "../RegisterUser/RegisterUser";
import { RegisterUserRequest } from "../../domain/auth/RegisterUserRequest";
import { SessionStorage } from "../../domain/auth/SessionStorage";
import { CreateSubscription } from "../CreateSubscription/CreateSubscription";
import { TrackAnalyticsUserConverted } from "../TrackAnalytics/UserConverted/TrackAnalyticsUserConverted";

export class CreateOrder {
  private readonly cart: Cart;
  private readonly cartService: CartService;
  private readonly createSubscription: CreateSubscription;
  private readonly deleteUser: DeleteUser;
  private readonly identifyAnalyticsUser: IdentifyAnalyticsUser;
  private readonly orderService: OrderService;
  private readonly registerUser: RegisterUser;
  private readonly sessionStorage: SessionStorage;
  private readonly trackAnalyticsOrderCompleted: TrackAnalyticsOrderCompleted;
  private readonly trackAnalyticsUserConverted: TrackAnalyticsUserConverted;
  private order?: Order;
  private updateCartRequest?: UpdateCartRequest;
  private userRegistered = false;

  constructor(
    cart: Cart,
    cartService: CartService,
    createSubscription: CreateSubscription,
    deleteUser: DeleteUser,
    identifyAnalyticsUser: IdentifyAnalyticsUser,
    orderService: OrderService,
    registerUser: RegisterUser,
    sessionStorage: SessionStorage,
    trackAnalyticsOrderCompleted: TrackAnalyticsOrderCompleted,
    trackAnalyticsUserConverted: TrackAnalyticsUserConverted
  ) {
    this.cartService = cartService;
    this.cart = cart;
    this.createSubscription = createSubscription;
    this.deleteUser = deleteUser;
    this.identifyAnalyticsUser = identifyAnalyticsUser;
    this.orderService = orderService;
    this.registerUser = registerUser;
    this.sessionStorage = sessionStorage;
    this.trackAnalyticsOrderCompleted = trackAnalyticsOrderCompleted;
    this.trackAnalyticsUserConverted = trackAnalyticsUserConverted;
  }

  execute = async (updateCartRequest: UpdateCartRequest) => {
    try {
      this.updateCartRequest = updateCartRequest;
      const ecommerceCart = await this.cartService.updateCart(this.updateCartRequest);
      this.cart.update(ecommerceCart);
      if (await this.shouldRegisterUser()) {
        await this.registerUser.execute(this.parseRegisterUserRequest());
        this.userRegistered = true;
      }
      this.order = await this.orderService.createOrder();
      if (this.cart.getSubscription()) await this.createSubscription.execute(this.order);
      await this.fireAnalytics();
      this.cart.reset();
    } catch (error: any) {
      if (this.userRegistered) {
        await this.deleteUser.execute();
      }
      throw error;
    }
  };

  private shouldRegisterUser = async () => !(await this.sessionStorage.hasSession()) && this.cart.hasSubscription;

  private parseRegisterUserRequest = (): RegisterUserRequest => ({
    email: this.updateCartRequest?.account?.email,
    firstName: this.updateCartRequest?.firstName,
    lastName: this.updateCartRequest?.lastName,
    password: this.updateCartRequest?.account?.password,
  });

  private parseTraits = (): IdentifyTraits => ({
    city: this.updateCartRequest?.city,
    coupon: this.cart.couponCode,
    created_method: "Checkout",
    currency: "USD",
    email: this.updateCartRequest?.account?.email,
    first_name: this.updateCartRequest?.firstName,
    last_name: this.updateCartRequest?.lastName,
    state: this.updateCartRequest?.state,
    street: this.updateCartRequest?.address,
    total_revenue: this.cart.totalPrice - this.cart.discounts - this.cart.shippingPrice,
  });

  private fireAnalytics = async () => {
    await this.identifyAnalyticsUser.execute(this.parseTraits());
    await this.trackAnalyticsOrderCompleted.execute(this.order!);
    if (this.cart.hasSubscription || this.cart.hasSubscriptionPackage) await this.trackAnalyticsUserConverted.execute();
  };
}
