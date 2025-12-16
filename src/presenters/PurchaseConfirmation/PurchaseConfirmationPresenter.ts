import { formatPriceWithCurrencyAndDecimals } from "../../utils/formatUtils";
import { OrderItemProductVM, OrderItemVM, OrderVM } from "../../builderComponents/PurchaseConfirmation/OrderVM";
import { Order, OrderItemProduct } from "../../core/domain/orders/Order";
import { GetOrder } from "../../core/useCases/GetOrder/GetOrder";

export interface PurchaseConfirmationView {
  showOrder(order: OrderVM);

  showDeliveryInfo();

  showLoader();

  hideLoader();

  showErrorMessage(message: string);
}

export class PurchaseConfirmationPresenter {
  private view: PurchaseConfirmationView;
  private getOrder: GetOrder;

  constructor(view: PurchaseConfirmationView, getOrder: GetOrder) {
    this.view = view;
    this.getOrder = getOrder;
  }

  start = async () => {
    this.view.showLoader();
    try {
      const order = await this.getOrder.execute();

      if (order.items.length > 1 || !order.items[0].product.isSubscription) this.view.showDeliveryInfo();

      this.view.showOrder(this.orderToVM(order));
    } catch (error) {
      this.view.showErrorMessage("Order not found!");
    }
    this.view.hideLoader();
  };

  private orderToVM(order: Order): OrderVM {
    const originalPricesSum = order?.items?.reduce(
      (currentSum, currentItem) =>
        currentSum +
        (currentItem.originalPrice > currentItem.price ? currentItem.originalPrice : currentItem.price) *
          currentItem.quantity,
      0
    );
    const individualDiscounts = order?.items?.reduce(
      (currentSum, currentItem) =>
        currentSum +
        (currentItem.originalPrice > currentItem.price ? currentItem.originalPrice - currentItem.price : 0) *
          currentItem.quantity,
      0
    );
    return {
      account: order?.account,
      accountId: order?.accountId,
      cardToken: order.cardToken,
      coupon: order.coupon,
      currency: order.currency,
      delivery: formatPriceWithCurrencyAndDecimals(order!.shipmentTotal, "us-EN"),
      discounts: formatPriceWithCurrencyAndDecimals(order!.discounts + individualDiscounts, "us-EN"),
      id: order?.id,
      items: order?.items?.map(
        (item): OrderItemVM => ({
          discount: item.discount,
          discountEach: item.discountEach,
          hasSalePrice: item.hasSalePrice,
          name: item.name,
          options: item?.options,
          originalPrice: formatPriceWithCurrencyAndDecimals(item?.originalPrice, "us-EN"),
          product: this.orderItemProductToVM(item?.product),
          price: formatPriceWithCurrencyAndDecimals(item?.price - (item?.discount || 0), "us-EN"),
          quantity: item?.quantity,
        })
      ),
      number: order?.number,
      paymentMethod: order?.paymentMethod,
      shipmentTotal: order?.shipmentTotal,
      shipping: order?.shipping,
      subTotal: formatPriceWithCurrencyAndDecimals(originalPricesSum, "us-EN"),
      taxes: formatPriceWithCurrencyAndDecimals(order!.taxes, "us-EN"),
      total: formatPriceWithCurrencyAndDecimals(order!.total, "us-EN"),
    };
  }

  private orderItemProductToVM = (item: OrderItemProduct): OrderItemProductVM => ({
    discountTitle: item.discountTitle,
    id: item.id,
    name: item.name,
    options: item.options,
    sku: item.sku,
    isSubscription: item.isSubscription,
  });
}
