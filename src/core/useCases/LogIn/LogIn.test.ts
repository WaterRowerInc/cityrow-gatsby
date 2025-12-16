import { anything, capture, instance, mock, verify, when } from "ts-mockito";
import { LogIn } from "./LogIn";
import { AuthService } from "../../domain/auth/AuthService";
import { CartService } from "../../domain/orders/CartService";
import { SessionStorage } from "../../domain/auth/SessionStorage";
import { UserStorage } from "../../domain/user/UserStorage";
import { SubscriptionService } from "../../domain/subscriptions/SubscriptionService";
import { Cart } from "../../domain/orders/Cart";
import { IdentifyAnalyticsUser } from "../TrackAnalytics/Identify/IdentifyAnalyticsUser";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics/TrackAnalytics";

const aUser = { firstName: "aFirstName", lastName: "aLastName", email: "test@test.com", pk: "aUserPk" };
const aToken = "someToken";

describe("LogIn should", () => {
  it("log in and store the user and the token obtained", async () => {
    when(authService.logIn(anything(), anything())).thenResolve({ user: aUser, token: aToken });

    await login().execute("mail@mail.com", "1234567");

    const [email, password] = capture(authService.logIn).last();
    expect(email).toBe("mail@mail.com");
    expect(password).toBe("1234567");
    const [user] = capture(userStorage.store).last();
    expect(user).toBe(aUser);
    const [token] = capture(sessionStorage.store).last();
    expect(token).toBe(aToken);
  });

  it("remove subscriptions from the cart if the subscription status is not canceled and set the cart hasSubscriptionStatus in false", async () => {
    when(authService.logIn(anything(), anything())).thenResolve({ user: aUser, token: aToken });
    when(subscriptionService.getSubscriptionStatus()).thenResolve("active");

    await login().execute("mail@mail.com", "1234567");

    verify(cartService.removeSubscriptionsFromCart()).called();
    expect(cart.hasSubscription).toBeFalsy();
  });

  it("not remove subscriptions from the cart if the subscription status is canceled", async () => {
    when(authService.logIn(anything(), anything())).thenResolve({ user: aUser, token: aToken });
    when(subscriptionService.getSubscriptionStatus()).thenResolve("canceled");

    await login().execute("mail@mail.com", "1234567");

    verify(cartService.removeSubscriptionsFromCart()).never();
  });

  it("not remove subscriptions from the cart if the subscription status is null", async () => {
    when(authService.logIn(anything(), anything())).thenResolve({ user: aUser, token: aToken });
    when(subscriptionService.getSubscriptionStatus()).thenResolve(null);

    await login().execute("mail@mail.com", "1234567");

    verify(cartService.removeSubscriptionsFromCart()).never();
  });

  it("not remove subscriptions from the cart if the subscription status fails", async () => {
    when(authService.logIn(anything(), anything())).thenResolve({ user: aUser, token: aToken });
    when(subscriptionService.getSubscriptionStatus()).thenThrow(new Error());

    await login().execute("mail@mail.com", "1234567");

    verify(cartService.removeSubscriptionsFromCart()).never();
  });

  it("track the Web Signed In and Identify analytics event", async () => {
    const someTraits = {
      user_id: aUser.pk,
      email: aUser.email,
      first_name: aUser.firstName,
      last_name: aUser.lastName,
    };
    when(authService.logIn(anything(), anything())).thenResolve({ user: aUser, token: aToken });
    when(userStorage.get()).thenResolve(aUser);

    await login().execute("mail@mail.com", "1234567");

    verify(identifyAnalyticsUser.execute(anything())).once();
    const [traits] = capture(identifyAnalyticsUser.execute).last();
    expect(traits).toStrictEqual(someTraits);
    verify(trackAnalytics.execute("Web Signed In")).calledAfter(identifyAnalyticsUser.execute(anything()));
  });

  beforeEach(() => {
    authService = mock<AuthService>();
    cartService = mock<CartService>();
    identifyAnalyticsUser = mock<IdentifyAnalyticsUser>();
    sessionStorage = mock<SessionStorage>();
    subscriptionService = mock<SubscriptionService>();
    trackAnalytics = mock<TrackAnalytics>();
    userStorage = mock<UserStorage>();
    cart = new Cart();
  });

  function login(): LogIn {
    return new LogIn(
      instance(authService),
      cart,
      instance(cartService),
      instance(identifyAnalyticsUser),
      instance(sessionStorage),
      instance(subscriptionService),
      instance(trackAnalytics),
      instance(userStorage)
    );
  }

  let authService: AuthService;
  let cart: Cart;
  let cartService: CartService;
  let identifyAnalyticsUser: IdentifyAnalyticsUser;
  let sessionStorage: SessionStorage;
  let subscriptionService: SubscriptionService;
  let trackAnalytics: TrackAnalytics;
  let userStorage: UserStorage;
});
