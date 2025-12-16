import { CartCoupon, CartItem, CartItemOption, Discount, EcommerceCart } from "../../domain/orders/EcommerceCart";
import { ProductsDiscountsApplierService } from "../../domain/products/ProductsDiscountsApplierService";
import swell from "swell-js";
import { CartService, CartSubscription, EcommerceCartCallback } from "../../domain/orders/CartService";
import { EcommerceClient } from "./EcommerceClient";
import { Item } from "../../domain/orders/Item";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { UpdateCartRequest } from "../../domain/orders/UpdateCartRequest";
import { ShippingOption } from "../../domain/orders/ShippingOption";
import { Cart } from "../../domain/orders/Cart";
import { roundNumberWithTwoDecimals } from "../../../utils/formatUtils";
import { InvalidCouponError } from "../../domain/coupons/InvalidCouponError";
import { Coupon } from "../../domain/coupons/Coupon";
import { HttpClient } from "../http/HttpClient";

export class EcommerceCartService implements CartService {
  private readonly ecommerceClient: EcommerceClient;
  private readonly cart: Cart;
  private subscribers: EcommerceCartCallback[] = [];
  private productDiscountService: ProductsDiscountsApplierService;
  private httpClient: HttpClient;

  constructor(
    ecommerceClient: EcommerceClient,
    myCart: Cart,
    productDiscountService: ProductsDiscountsApplierService,
    httpClient: HttpClient
  ) {
    this.ecommerceClient = ecommerceClient;
    this.cart = myCart;
    this.productDiscountService = productDiscountService;
    this.httpClient = httpClient;
  }

  addToCart = async (items: Item[]): Promise<EcommerceCart> => {
    try {
      const cart = await swell.cart.get();
      const oldItems = cart?.items?.map((item) => this.itemToJson(item)) || [];
      const newItems = items.map((item) => this.itemToJson(item));
      const response = await swell.cart.setItems([...oldItems, ...newItems]);
      return this.handleSwellResponse(response, this.cart.subscriptionCoupon);
    } catch (e: any) {
      throw new NotExpectedError(e.message);
    }
  };

  applyCouponToCart = async (couponCode: string): Promise<EcommerceCart> => {
    try {
      const response = await swell.cart.applyCoupon(couponCode);
      return this.handleSwellResponse(response, this.cart.subscriptionCoupon);
    } catch (e: any) {
      if (e.message === "Your coupon code was not found or no longer valid") throw new InvalidCouponError();
      throw new NotExpectedError(e.message);
    }
  };

  applySubscriptionCouponToCart = async (subscriptionCoupon: Coupon): Promise<EcommerceCart> => {
    try {
      const response = await swell.cart.get();
      return this.handleSwellResponse(response, subscriptionCoupon);
    } catch (e: any) {
      if (e.message === "Your coupon code was not found or no longer valid") throw new InvalidCouponError();
      throw new NotExpectedError(e.message);
    }
  };

  getCart = async (): Promise<EcommerceCart> => {
    try {
      const response = await swell.cart.get();
      return this.handleSwellResponse(response, this.cart.subscriptionCoupon);
    } catch (e: any) {
      throw new NotExpectedError(e.message);
    }
  };

  getShippingOptions = async (): Promise<ShippingOption[]> => {
    try {
      const response = await swell.cart.getShippingRates();
      return response?.services?.map((shippingService) => this.jsonToShippingService(shippingService)) || [];
    } catch (e: any) {
      throw new NotExpectedError(e.message);
    }
  };

  removeItemFromCart = async (itemId: string): Promise<EcommerceCart> => {
    const response = await swell.cart.removeItem(itemId);
    return this.handleSwellResponse(response, this.cart.subscriptionCoupon);
  };

  removeCouponsFromCart = async (): Promise<EcommerceCart> => {
    try {
      const response = await swell.cart.removeCoupon();
      return this.handleSwellResponse(response);
    } catch (e: any) {
      throw new NotExpectedError(e.message);
    }
  };

  removeSubscriptionsFromCart = async (): Promise<EcommerceCart> => {
    try {
      const cart = await swell.cart.get();
      const itemId = this.getSubscriptionItemIdFromCart(cart);
      if (!itemId) return this.jsonToEcommerceCart(cart);
      let newCart = await swell.cart.removeItem(itemId);
      const itemNeedsSubscriptionId = this.getNeedSubscriptionItemIdFromCart(newCart);
      newCart = await swell.cart.removeItem(itemNeedsSubscriptionId);
      return this.jsonToEcommerceCart(newCart);
    } catch (e: any) {
      throw new NotExpectedError(e.message);
    }
  };

  updateCart = async (updateCartRequest: UpdateCartRequest): Promise<EcommerceCart> => {
    const cart = this.updateCartRequestToCart(updateCartRequest);
    const response = await swell.cart.update(cart);
    return this.handleSwellResponse(response, this.cart.subscriptionCoupon);
  };

  subscribe = (callback: EcommerceCartCallback): CartSubscription => {
    const index = this.subscribers.push(callback) - 1;
    return {
      unsubscribe: () => this.subscribers.splice(index, 1),
    };
  };

  private handleSwellResponse = async (response, subscriptionCoupon?: Coupon): Promise<EcommerceCart> => {
    response = await this.addSubscriptionCouponIfApply(response, subscriptionCoupon);
    const ecommerceCart = this.jsonToEcommerceCart(response);
    this.subscribers.forEach((subscriberCallback) => subscriberCallback(ecommerceCart));
    return ecommerceCart;
  };

  private addSubscriptionCouponIfApply = async (ecommerceCartJson, subscriptionCoupon?: Coupon) => {
    if (subscriptionCoupon)
      return await this.addSubscriptionCouponToEcommerceCart(ecommerceCartJson, subscriptionCoupon);

    const stripeId = ecommerceCartJson?.coupon?.content?.stripeCouponId;
    if (!stripeId) return ecommerceCartJson;
    return await this.addStripeCouponToCart(stripeId, ecommerceCartJson);
  };

  private addSubscriptionCouponToEcommerceCart = async (ecommerceCartJson, subscriptionCoupon: Coupon) => {
    const response = await this.httpClient.get(`/get-coupon/${subscriptionCoupon.stripeId}/USD/`);
    return {
      ...ecommerceCartJson,
      subscriptionCoupon: this.jsonToSubscriptionCoupon(subscriptionCoupon, response.data),
    };
  };

  private addStripeCouponToCart = async (stripeId: string, ecommerceCartJson) => {
    const stripeCoupon = await swell.content.get(`stripe-coupon/${stripeId}`);
    return await this.addSubscriptionCouponToEcommerceCart(ecommerceCartJson, stripeCoupon);
  };

  private jsonToSubscriptionCoupon = ({ id, name, period, stripeId }: Coupon, json?: any): Coupon => ({
    couponCode: stripeId,
    id,
    name,
    period,
    stripeId,
    amountOff: json?.amount_off / 100,
    percentageOff: json?.percent_off / 100,
  });

  private jsonToEcommerceCart = (json: any): EcommerceCart => {
    const subscriptionItem = json?.items?.find((item) => item?.product?.attributes?.isSubscription === "True");
    const subscriptionItemPrice =
      subscriptionItem?.price === 0
        ? subscriptionItem?.product?.options
            ?.find((option) => option.name === "Subscription")
            ?.values?.find(
              (value) => value.name === subscriptionItem?.options.find((option) => option.id === "Plan")?.value
            )?.price
        : 0;
    const subscriptionDiscount =
      json?.subscriptionCoupon?.amountOff ||
      (json?.subscriptionCoupon?.percentageOff ? json?.subscriptionCoupon?.percentageOff * subscriptionItemPrice : 0);
    return {
      items: json?.items?.map((item) => this.jsonToCartItem(item, json?.discounts, json?.promotions?.results)) || [],
      coupon: this.jsonCouponToCartCoupon(json?.coupon || json?.subscriptionCoupon),
      couponCode: json?.couponCode || json?.subscriptionCoupon?.couponCode,
      discountsList: json?.discounts?.map((discount) => this.jsonToDiscount(discount)) || [],
      discounts: roundNumberWithTwoDecimals(
        json?.discounts?.map((discount) => discount.amount)?.reduce((total, amount) => total + amount, 0) || 0
      ),
      subscriptionDiscounts: roundNumberWithTwoDecimals(subscriptionDiscount),
      id: json?.id || "",
      shippingMethod: json?.shipping?.serviceName || "",
      shippingPrice: roundNumberWithTwoDecimals(json?.shipmentPrice || 0),
      subscriptionCoupon: json?.subscriptionCoupon,
      subTotal: roundNumberWithTwoDecimals(json?.subTotal + subscriptionItemPrice || 0),
      tax: roundNumberWithTwoDecimals(json?.taxTotal || 0),
      displayTotal: roundNumberWithTwoDecimals(json?.grandTotal + subscriptionItemPrice - subscriptionDiscount || 0),
      totalPrice: roundNumberWithTwoDecimals(json?.grandTotal || 0),
    };
  };

  private jsonCouponToCartCoupon = (json?: any): CartCoupon => ({ name: json?.name, description: json?.description });

  private itemToJson = ({ productId, quantity, options, bundleItems, variantId }: Item) => ({
    product_id: productId,
    quantity,
    options,
    bundle_items: bundleItems?.length ? bundleItems?.map((items) => this.itemToJson(items)) : undefined,
    variant_id: variantId || undefined,
  });

  private jsonToShippingService = (json: any): ShippingOption => ({
    description: json?.description,
    id: json?.id,
    name: json?.name,
    price: roundNumberWithTwoDecimals(json?.price),
  });

  private jsonToCartItem = (
    { id, bundleItems, options, price, product, quantity, productId },
    discounts: any,
    promotions: any
  ): CartItem => {
    const subscriptionPrice = product?.options
      ?.find((option) => option.name === "Subscription")
      ?.values?.find((value) => value.name === options.find((option) => option.id === "Plan")?.value)?.price;
    const discount = this.productDiscountService.getProductDiscount(productId, discounts, promotions);
    const isSubscription = product.attributes?.isSubscription === "True";
    const hasSubscriptionPackage = product.attributes?.hasSubscriptionPackage === "True";
    const { subtitle, disclaimer }: { subtitle?: string; disclaimer?: string } = isSubscription
      ? this.getSubscriptionTexts(product.options, options?.[0]?.value)
      : {};
    return {
      bundleItems: bundleItems?.map((item) => this.jsonToCartItem(item, discounts, promotions)),
      discount: roundNumberWithTwoDecimals(discount?.amount || 0),
      discountTitle: discount?.title,
      disclaimer,
      id,
      isSubscription,
      hasSubscriptionPackage,
      productId,
      name: isSubscription ? this.getSubscriptionProductName(product?.name, options?.[0].value) : product?.name,
      options: options?.map((option) => this.jsonToCartItemOption(option)) || [],
      price: roundNumberWithTwoDecimals(isSubscription && price == 0 ? subscriptionPrice : price),
      originalPrice: roundNumberWithTwoDecimals(product?.price),
      hasSalePrice: price < product?.price,
      quantity,
      subtitle,
      shippingOptions: product?.attributes?.shippingOptions || [],
      allowParcelShipping: product?.attributes?.allowParcelShipping,
      needsSubscription: product?.attributes?.needsSubscription,
      slug: product?.slug,
    };
  };

  private getSubscriptionProductName = (productName: string, planName: string) => {
    if (!planName) return productName;
    return productName.replace("Subscription", `${planName} Subscription`);
  };

  private getSubscriptionTexts = (
    productOptions: any[],
    selectedPlan: string
  ): { disclaimer: string; subtitle: string } => {
    let disclaimer = "";
    let subtitle = "";
    disclaimer = productOptions?.[0]?.description;
    const optionValue = productOptions[0]?.values?.find((value) => value.name === selectedPlan);
    if (optionValue) subtitle = optionValue.description;
    return { disclaimer, subtitle };
  };

  private jsonToCartItemOption = (option): CartItemOption => ({
    name: option?.name || option?.id,
    value: option?.value,
  });

  private updateCartRequestToCart = (request: UpdateCartRequest) => {
    const cart: any = {
      billing: {
        address1: request.address,
        city: request.city,
        country: request.country,
        name: `${request.firstName} ${request.lastName}`,
        phone: request.phone,
        state: request.state,
        zip: request.postalCode,
      },
      shipping: {
        address1: request.address,
        city: request.city,
        country: request.country,
        name: `${request.firstName} ${request.lastName}`,
        phone: request.phone,
        state: request.state,
        zip: request.postalCode,
        service: request.shipping?.service,
      },
    };
    if (request.account?.email) {
      cart["account"] = {
        email: request.account?.email,
        email_optin: request.account.contactMe,
      };
    }
    if (request.card) {
      cart.billing = {
        ...cart.billing,
        card: {
          token: request.card.token,
          last4: request.card.last4,
          exp_month: request.card.expMonth,
          exp_year: request.card.expYear,
          brand: request.card.brand,
          address_check: request.card.addressCheck,
          cvc_check: request.card.cvcCheck,
          zip_check: request.card.zipCheck,
        },
        intent: { stripe: { id: request.paymentIntent } },
        method: "card",
      };
    }
    if (request.klarnaSession) {
      cart.billing = {
        ...cart.billing,
        method: "klarna",
        klarna: {
          source: request.klarnaSession.id,
        },
      };
    }
    return cart;
  };

  private getSubscriptionItemIdFromCart = (cart: any): string => {
    return cart?.items.find((item) =>
      Object.keys(item.product.attributes).find((attribute) => attribute === "subscription")
    )?.id;
  };

  private getNeedSubscriptionItemIdFromCart = (cart: any): string => {
    return cart?.items.find((item) =>
      Object.keys(item.product.attributes).find((attribute) => attribute === "needsSubscription")
    )?.id;
  };

  private jsonToDiscount = (json: any): Discount => ({
    amount: json?.amount || 0,
    rule: {
      productId: json?.rule?.productId,
      type: json?.rule?.type,
      valuePercent: json?.rule?.valuePercent,
      valueType: json?.rule?.valueType,
    },
    type: json.type,
  });
}
