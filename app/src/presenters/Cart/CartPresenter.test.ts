import { anything, capture, instance, mock, verify, when } from "ts-mockito";
import { InvalidCouponPlanError } from "../../core/domain/coupons/InvalidCouponPlanError";
import { CartBuilder } from "../../core/domain/orders/testing/CartBuilder";
import { ApplyCouponToCart } from "../../core/useCases/ApplyCouponToCart/ApplyCouponToCart";
import { GetCart } from "../../core/useCases/GetCart/GetCart";
import { GetLocalizationCode } from "../../core/useCases/GetLocalizationCode/GetLocalizationCode";
import { IsUserLoggedIn } from "../../core/useCases/IsUserLoggedIn/IsUserLoggedIn";
import { RemoveCouponsFromCart } from "../../core/useCases/RemoveCouponsFromCart/RemoveCouponsFromCart";
import { RemoveItemFromCart } from "../../core/useCases/RemoveItemFromCart/RemoveItemFromCart";
import { UpdateCart } from "../../core/useCases/UpdateCart/UpdateCart";
import { CartPresenter, CartView } from "./CartPresenter";

describe("CartPresenter should", () => {
  it("show the cart on start", async () => {
    const cart = new CartBuilder()
      .withDiscounts(658.509999)
      .withItem({
        discount: 0,
        id: "61897fd97c62f941f81c5032",
        productId: "abcd",
        slug: "abcd",
        name: "Test Item",
        options: [],
        price: 2195,
        quantity: 1,
        bundleItems: [],
        isSubscription: false,
        hasSubscriptionPackage: false,
      })
      .withItem({
        discount: 0,
        id: "61897fd97c62f941f81c5033",
        name: "Test Plan",
        productId: "abcd",
        slug: "abcd",
        options: [
          {
            name: "Plan",
            value: "Monthly",
          },
        ],
        price: 0,
        quantity: 1,
        bundleItems: [],
        isSubscription: true,
        hasSubscriptionPackage: false,
      })
      .withSubTotal(2195)
      .withTotalPrice(1536.5)
      .build();
    when(getCart.execute()).thenResolve(cart);

    await presenter.start();

    const [viewModel] = capture(view.showCart).last();
    expect(viewModel.discounts).toBe("$658.51");
    expect(viewModel.itemsQuantity).toBe(2);
    expect(viewModel.shipping).toBe("$0.00");
    expect(viewModel.subTotal).toBe("$2,195.00");
    expect(viewModel.tax).toBe("$0.00");
    expect(viewModel.totalPrice).toBe("$1,536.50");
    expect(viewModel.items[0]?.id).toBe("61897fd97c62f941f81c5032");
    expect(viewModel.items[0]?.name).toBe("Test Item");
    expect(viewModel.items[0]?.options).toStrictEqual([]);
    expect(viewModel.items[0]?.price).toBe("$2,195.00");
    expect(viewModel.items[1]?.id).toBe("61897fd97c62f941f81c5033");
    expect(viewModel.items[1]?.name).toBe("Test Plan");
    expect(viewModel.items[1]?.options[0]?.name).toBe("Plan");
    expect(viewModel.items[1]?.options[0]?.value).toBe("Monthly");
    expect(viewModel.items[1]?.price).toBe("$0.00");
  });

  it("apply updates to the cart whenever they occur", async () => {
    const cart = new CartBuilder()
      .withItem({
        discount: 0,
        id: "61897fd97c62f941f81c5032",
        productId: "abcd",
        slug: "abcd",
        name: "Test Item",
        options: [],
        price: 2195,
        quantity: 1,
        bundleItems: [],
        isSubscription: false,
        hasSubscriptionPackage: false,
      })
      .build();
    when(getCart.execute()).thenResolve(cart);
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);

    await presenter.start();
    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();

    const [viewModel] = capture(view.showCart).last();
    expect(viewModel.items[0]?.price).toBe("$2,195.00");

    onCartUpdatedCallback(
      new CartBuilder()
        .withItem({
          discount: 0,
          id: "61897fd97c62f941f81c5032",
          productId: "abcd",
          slug: "abcd",
          name: "Test Item",
          options: [],
          price: 1915,
          quantity: 1,
          bundleItems: [],
          isSubscription: false,
          hasSubscriptionPackage: false,
        })
        .build()
    );
    const [viewModelUpdated] = capture(view.showCart).last();
    expect(viewModelUpdated.items[0]?.price).toBe("$1,915.00");
  });

  it("update the cart with a coupon after applying promotion", async () => {
    const couponCode = "MILITARY10";
    when(applyCouponToCart.execute(anything())).thenResolve(new CartBuilder().withCouponCode(couponCode).build());

    await presenter.applyPromoToCart(couponCode);

    const [viewModel] = capture(view.showCart).last();
    verify(applyCouponToCart.execute(anything())).called();
    expect(viewModel.couponCode).toBe(couponCode);
  });

  it("show loader when trying to apply a promotion", async () => {
    const couponCode = "MILITARY10";
    when(applyCouponToCart.execute(anything())).thenResolve(new CartBuilder().withCouponCode(couponCode).build());

    await presenter.applyPromoToCart(couponCode);

    verify(view.showLoader()).called();
    verify(view.hideLoader()).calledAfter(view.showLoader());
  });

  it("show an error if promotion code is not found", async () => {
    const couponCode = "MILITARY10";
    const errorMessage = "invalid promo code";
    when(applyCouponToCart.execute(anything())).thenReject(new Error(errorMessage));

    await presenter.applyPromoToCart(couponCode);

    verify(view.showInvalidPromoCode(errorMessage)).called();
    verify(view.showLoader()).called();
    verify(view.hideLoader()).calledAfter(view.showLoader());
  });

  it("show an specific error message if the error is InvalidCouponPlanError", async () => {
    const couponCode = "MILITARY10";
    const error = new InvalidCouponPlanError();
    when(applyCouponToCart.execute(anything())).thenReject(error);

    await presenter.applyPromoToCart(couponCode);

    verify(view.showInvalidPromoCode(error.message)).called();
    verify(view.showLoader()).called();
    verify(view.hideLoader()).calledAfter(view.showLoader());
  });

  it("remove the item from the cart is called", async () => {
    const anItemId = "anItemId";
    when(removeItemFromCart.execute(anItemId)).thenResolve(new CartBuilder().withCouponCode(undefined).build());

    await presenter.deleteItemFromCart(anItemId);
    verify(removeItemFromCart.execute(anItemId)).called();
  });

  it("update the cart without any coupons after removing them", async () => {
    when(removeCouponsFromCart.execute()).thenResolve(new CartBuilder().withCouponCode(undefined).build());

    await presenter.unapplyCouponsFromCart();

    verify(removeCouponsFromCart.execute()).called();
    const [viewModel] = capture(view.showCart).last();
    expect(viewModel.couponCode).toBe(undefined);
  });

  it("update cart subscription trial status (text) on start", async () => {
    when(getCart.execute()).thenResolve(
      new CartBuilder()
        .withItem({
          discount: 600,
          discountTitle: "30% off on all rowers",
          id: "61897fd97c62f941f81c5032",
          productId: "abcdef123456",
          slug: "abcdef123456",
          name: "Test Item",
          options: [],
          price: 2195,
          quantity: 1,
          bundleItems: [],
          isSubscription: false,
          hasSubscriptionPackage: false,
        })
        .build()
    );
    when(isUserLoggedIn.execute()).thenResolve(anything());

    await presenter.start();

    verify(view.updateSubscriptionTrial(anything())).called();
  });

  it("show the promotions applied to items", async () => {
    when(getCart.execute()).thenResolve(
      new CartBuilder()
        .withItem({
          discount: 600,
          discountTitle: "30% off on all rowers",
          id: "61897fd97c62f941f81c5032",
          productId: "abcdef123456",
          slug: "abcdef123456",
          name: "Test Item",
          options: [],
          price: 2195,
          quantity: 1,
          bundleItems: [],
          isSubscription: false,
          hasSubscriptionPackage: false,
        })
        .build()
    );

    await presenter.start();

    const [viewModel] = capture(view.showCart).last();
    expect(viewModel.items[0].appliedPromotionName).toBe("30% off on all rowers");
    expect(viewModel.items[0].priceWithoutPromotion).toBe("$2,195.00");
    expect(viewModel.items[0].price).toBe("$1,595.00");
  });

  beforeEach(() => {
    view = mock<CartView>();
    applyCouponToCart = mock<ApplyCouponToCart>();
    getCart = mock<GetCart>();
    removeCouponsFromCart = mock<RemoveCouponsFromCart>();
    removeItemFromCart = mock<RemoveItemFromCart>();
    updateCart = mock<UpdateCart>();
    isUserLoggedIn = mock<IsUserLoggedIn>();
    getLocalizationCode = mock<GetLocalizationCode>();
    presenter = createPresenter();
  });

  function createPresenter(): CartPresenter {
    return new CartPresenter(
      instance(view),
      instance(getCart),
      instance(applyCouponToCart),
      instance(removeCouponsFromCart),
      instance(removeItemFromCart),
      instance(updateCart),
      instance(isUserLoggedIn),
      instance(getLocalizationCode)
    );
  }

  let view: CartView;
  let presenter: CartPresenter;
  let applyCouponToCart: ApplyCouponToCart;
  let getCart: GetCart;
  let removeCouponsFromCart: RemoveCouponsFromCart;
  let removeItemFromCart: RemoveItemFromCart;
  let updateCart: UpdateCart;
  let isUserLoggedIn: IsUserLoggedIn;
  let getLocalizationCode: GetLocalizationCode;
});
