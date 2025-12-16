import { OrderItemVM, OrderVM } from "../../builderComponents/PurchaseConfirmation/OrderVM";
import { parsePriceWithCurrencyToNumber } from "../../utils/formatUtils";
import { TrackConversionOrder, TrackConversionOrderItem } from "../../components/Impact/TrackConversionOrder";
import { GetUser } from "../../core/useCases/GetUser/GetUser";

export interface ImpactView {
  identifyImpactUser(userId: string, email: string);
}

export class ImpactPresenter {
  private view: ImpactView;
  private getUser: GetUser;

  constructor(view: ImpactView, getUser: GetUser) {
    this.view = view;
    this.getUser = getUser;
  }

  start = async (noRunIdentify?: boolean) => {
    if (noRunIdentify) return;
    try {
      const user = await this.getUser.execute();
      this.view.identifyImpactUser(user.pk!, user.email);
    } catch (e) {
      this.view.identifyImpactUser("", "");
    }
  };

  getTrackConversionOrder = async (order: OrderVM): Promise<TrackConversionOrder> => {
    let user;
    try {
      user = await this.getUser.execute();
    } catch (e) {
      user = { pk: order.accountId, email: "" };
    }
    return {
      currencyCode: order.currency,
      customerCountry: "US",
      customerEmail: user.email,
      customerId: user.pk,
      customerStatus: "",
      items: order.items.map((item) => this.parseTrackOrderItem(item)),
      orderDiscount: parsePriceWithCurrencyToNumber(order.discounts),
      orderId: order.id,
      orderPromoCode: order.coupon,
      orderShippingCost: order.shipmentTotal,
      orderTax: parsePriceWithCurrencyToNumber(order.taxes),
      promotionalCode: order.coupon,
      subTotal: parsePriceWithCurrencyToNumber(order.subTotal),
    };
  };

  private parseTrackOrderItem = (item: OrderItemVM): TrackConversionOrderItem => ({
    category: "Fitness",
    discount: item.discountEach,
    totalDiscount: item.discount,
    name: item.name,
    quantity: item.quantity,
    subTotal: parsePriceWithCurrencyToNumber(item.originalPrice),
    sku: item.product.sku,
  });
}
