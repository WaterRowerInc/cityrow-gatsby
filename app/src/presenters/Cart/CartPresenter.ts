import { IsUserLoggedIn } from "../../core/useCases/IsUserLoggedIn/IsUserLoggedIn";
import { GetCart } from "core/useCases/GetCart/GetCart";
import { CartItemVM, CartVM } from "../../components/Cart/CartVM";
import { Cart } from "../../core/domain/orders/Cart";
import { CartItem } from "../../core/domain/orders/EcommerceCart";
import { ApplyCouponToCart } from "../../core/useCases/ApplyCouponToCart/ApplyCouponToCart";
import { RemoveCouponsFromCart } from "../../core/useCases/RemoveCouponsFromCart/RemoveCouponsFromCart";
import { formatPriceWithCurrencyAndDecimals } from "../../utils/formatUtils";
import { RemoveItemFromCart } from "../../core/useCases/RemoveItemFromCart/RemoveItemFromCart";
import { UpdateCart } from "core/useCases/UpdateCart/UpdateCart";
import { CartSubscription } from "core/domain/orders/CartService";
import { GetLocalizationCode } from "../../core/useCases/GetLocalizationCode/GetLocalizationCode";

export interface CartView {
  hideLoader();

  showCart(cart: CartVM);

  setLocalizationCode(localizationCode: string);

  showInvalidPromoCode(message?: string);

  showNeedsSubscriptionModal(slug: string);

  showLoader();

  updateSubscriptionTrial(isTrialing: boolean);
}

export class CartPresenter {
  cart?: Cart;
  view: CartView;

  private applyCouponToCart: ApplyCouponToCart;
  private removeCouponsFromCart: RemoveCouponsFromCart;
  private removeItemFromCart: RemoveItemFromCart;
  private getCart: GetCart;
  private updateCart: UpdateCart;
  private cartSubscription?: CartSubscription;
  private isUserLoggedIn: IsUserLoggedIn;
  private getLocalizationCode: GetLocalizationCode;

  constructor(
    view: CartView,
    getCart: GetCart,
    applyCouponToCart: ApplyCouponToCart,
    removeCouponsFromCart: RemoveCouponsFromCart,
    removeItemFromCart: RemoveItemFromCart,
    updateCart: UpdateCart,
    isUserLoggedIn: IsUserLoggedIn,
    getLocalizationCode: GetLocalizationCode
  ) {
    this.view = view;
    this.getCart = getCart;
    this.applyCouponToCart = applyCouponToCart;
    this.removeCouponsFromCart = removeCouponsFromCart;
    this.removeItemFromCart = removeItemFromCart;
    this.updateCart = updateCart;
    this.isUserLoggedIn = isUserLoggedIn;
    this.getLocalizationCode = getLocalizationCode;
  }

  start = async (): Promise<void> => {
    this.view.setLocalizationCode(this.getLocalizationCode.execute());
    this.cart = await this.getCart.execute();
    if (this.cart.couponCode) {
      try {
        this.cart = await this.applyCouponToCart.execute(this.cart.couponCode);
      } catch (error) {
        this.cart = await this.removeCouponsFromCart.execute();
      }
    }
    this.view.showCart(this.myCartToVM());
    const isUserLogged = await this.isUserLoggedIn.execute();
    this.view.updateSubscriptionTrial(!isUserLogged);
    this.cartSubscription = this.getCart.subscribe(this.handleCartUpdate);
  };

  dispose = (): void => this.cartSubscription?.unsubscribe();

  handleCartUpdate = async (cart: Cart): Promise<void> => {
    this.cart = cart;
    this.view.showCart(this.myCartToVM());
  };

  applyPromoToCart = async (promoCode: string): Promise<void> => {
    try {
      this.view.showLoader();
      this.cart = await this.applyCouponToCart.execute(promoCode);
      this.view.showCart(this.myCartToVM());
    } catch (error) {
      this.showInvalidPromoCodeError(error);
    }
    this.view.hideLoader();
  };

  deleteItemFromCart = async (itemId: string): Promise<void> => {
    const shouldRemoveShippingAfterDeleting = this.shouldRemoveShipping(itemId);
    let cart;
    try {
      if (shouldRemoveShippingAfterDeleting) await this.unselectShippingMethod();
      cart = await this.removeItemFromCart.execute(itemId);
    } catch (error) {
      cart = await this.getCart.execute();
    }
    if (cart.needsSubscription && !cart.hasSubscription) {
      const needsSubscriptionItem = cart.items.find((item) => item.needsSubscription)!;
      this.view.showNeedsSubscriptionModal(needsSubscriptionItem.slug);
      await this.deleteItemFromCart(needsSubscriptionItem.id);
    }
    await this.handleCartUpdate(cart);
  };

  private isPurchaseIncludingRower = (cartItems: CartItem[]) =>
    !!cartItems?.find((item) => item.name.toLowerCase().includes("rower"));

  private shouldRemoveShipping = (itemToDeleteId: string) => {
    const newCartItems = this.cart?.items.filter((item) => item.id !== itemToDeleteId) || [];
    const wasCartIncludingRower = this.cart && this.isPurchaseIncludingRower(this.cart.items);
    return wasCartIncludingRower && !this.isPurchaseIncludingRower(newCartItems);
  };

  unselectShippingMethod = async (): Promise<void> => {
    this.cart = await this.updateCart.execute({ shipping: { service: null } });
  };

  unapplyCouponsFromCart = async (): Promise<void> => {
    this.cart = await this.removeCouponsFromCart.execute();
    this.view.showCart(this.myCartToVM());
  };

  myCartToVM = (): CartVM => {
    const itemDiscounts = this.cart!.items.reduce(
      (currentValue, currentItem) =>
        currentValue +
        (currentItem!.originalPrice! > currentItem.price ? currentItem!.originalPrice! - currentItem.price : 0) *
          currentItem!.quantity!,
      0
    );
    return {
      discounts: formatPriceWithCurrencyAndDecimals(this.cart!.discounts + itemDiscounts, "us-EN"),
      subscriptionDiscounts:
        this.cart!.subscriptionDiscounts > 0
          ? formatPriceWithCurrencyAndDecimals(this.cart!.subscriptionDiscounts, "us-EN")
          : undefined,
      couponCode: this.cart!.couponCode,
      coupon: this.cart?.coupon,
      items: this.cart!.items.map((item) => this.itemToVM(item)),
      itemsQuantity: this.cart!.getItemsQuantity(),
      shipping: formatPriceWithCurrencyAndDecimals(this.cart!.shippingPrice, "us-EN"),
      subTotal: formatPriceWithCurrencyAndDecimals(this.cart!.subTotal + itemDiscounts, "us-EN"),
      tax: formatPriceWithCurrencyAndDecimals(this.cart!.tax, "us-EN"),
      totalPrice: formatPriceWithCurrencyAndDecimals(this.cart!.totalPrice, "us-EN"),
      displayPrice: formatPriceWithCurrencyAndDecimals(this.cart!.displayTotal, "us-EN"),
    };
  };

  private itemToVM = ({
    id,
    bundleItems,
    quantity,
    name,
    options,
    price,
    discount,
    discountTitle,
    isSubscription,
    disclaimer,
    subtitle,
    originalPrice,
    hasSalePrice,
  }: CartItem): CartItemVM => ({
    id,
    name,
    quantity: quantity,
    options: options,
    price: formatPriceWithCurrencyAndDecimals(discount ? price - discount : price, "us-EN"),
    priceWithoutPromotion: formatPriceWithCurrencyAndDecimals(price, "us-EN"),
    appliedPromotionName: discountTitle,
    bundleItems: bundleItems?.map((item) => this.itemToVM(item)),
    isSubscription,
    subtitle,
    disclaimer,
    originalPrice:
      originalPrice && originalPrice > 0 ? formatPriceWithCurrencyAndDecimals(originalPrice, "us-EN") : undefined,
    hasSalePrice: hasSalePrice,
  });

  private showInvalidPromoCodeError = (error) => this.view.showInvalidPromoCode(error.message);
}
