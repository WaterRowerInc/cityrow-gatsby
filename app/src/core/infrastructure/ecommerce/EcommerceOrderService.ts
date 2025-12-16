import { ProductsDiscountsApplierService } from "../../domain/products/ProductsDiscountsApplierService";
import swell from "swell-js";
import { EcommerceClient } from "./EcommerceClient";
import { OrderService } from "../../domain/orders/OrderService";
import {
  Order,
  OrderItem,
  OrderItemOption,
  OrderItemProduct,
  OrderItemProductOption,
  OrderItemProductOptionValue,
} from "../../domain/orders/Order";

export class EcommerceOrderService implements OrderService {
  private readonly ecommerceClient: EcommerceClient;
  private productDiscountService: ProductsDiscountsApplierService;

  constructor(ecommerceClient: EcommerceClient, productDiscountService: ProductsDiscountsApplierService) {
    this.ecommerceClient = ecommerceClient;
    this.productDiscountService = productDiscountService;
  }

  createOrder = async (): Promise<Order> => {
    const order = await swell.cart.submitOrder();
    return this.jsonToOrder(order);
  };

  getOrder = async (): Promise<Order> => {
    const order = await swell.cart.getOrder();
    return this.jsonToOrder(order);
  };

  private jsonToOrder = (json: any): Order => ({
    account: json?.account,
    accountId: json?.accountId,
    cardToken: json?.billing?.klarna?.source || json?.billing?.card?.token,
    currency: json?.currency,
    coupon: json?.couponCode || "",
    discounts: json?.discountTotal,
    id: json?.id,
    items: json?.items?.map((item) => this.jsonToOrderItem(item, json?.discounts, json?.promotions?.results)) || [],
    number: json?.number,
    paymentMethod: json?.billing?.klarna?.source ? "klarna" : "card",
    shipmentTotal: json?.shipmentTotal,
    shipping: {
      city: json?.shipping?.city,
      country: json?.shipping?.country,
      deliveryType: json?.shipping?.serviceName || "",
      name: json?.shipping?.name,
      state: json?.shipping?.state,
      street: json?.shipping?.address1,
      zip: json?.shipping?.zip,
    },
    subTotal: json?.subTotal,
    taxes: json?.taxTotal,
    total: json?.grandTotal,
  });

  private jsonToOrderItem = (json: any, discounts: any, promotions: any): OrderItem => ({
    discount: json?.discountTotal || 0,
    discountEach: json?.discountEach || 0,
    hasSalePrice: json?.product?.price > json?.price,
    name: json?.product?.name,
    options: json?.options?.map((option) => this.jsonToOrderItemOption(option)) || [],
    originalPrice: json?.product?.price,
    product: this.jsonToOrderItemProduct(json?.product, discounts, promotions),
    price: json?.price,
    quantity: json?.quantity,
  });

  private jsonToOrderItemOption = (json: any): OrderItemOption => ({
    id: json?.id,
    name: json?.name,
    value: json?.value,
  });

  private jsonToOrderItemProduct = (product: any, discounts: any, promotions: any): OrderItemProduct => {
    const discount = this.productDiscountService.getProductDiscount(product?.id, discounts, promotions);

    return {
      discountTitle: discount?.title,
      id: product?.id,
      isSubscription: product?.attributes?.isSubscription === "True",
      name: product?.name,
      options: product?.options?.map((option) => this.jsonToOrderItemProductOption(option)) || [],
      sku: product?.sku || "",
    };
  };

  private jsonToOrderItemProductOption = (json: any): OrderItemProductOption => ({
    attributeId: json?.attributeId,
    values: json?.values?.map((value) => this.jsonToOrderItemProductOptionValue(value)) || [],
  });

  private jsonToOrderItemProductOptionValue = (json: any): OrderItemProductOptionValue => ({
    name: json?.name,
    paymentPlanId: json?.stripePlansId,
  });
}
