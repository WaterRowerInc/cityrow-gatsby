import { Discount, Promotion } from "../orders/EcommerceCart";
import { roundNumberWithTwoDecimals } from "../../../utils/formatUtils";

export class ProductsDiscountsApplierService {
  getProductDiscount = (
    productId: string,
    discounts: Discount[],
    promotions: Promotion[]
  ): { title: string; amount: number } | undefined => {
    const discountsPerProductMap = this.parseDiscountsListToProductsMap(discounts);
    const promotionsMap = this.parsePromotionsListToMap(promotions);

    if (!discountsPerProductMap || !promotionsMap || discountsPerProductMap[productId] === undefined) return;
    const promotion = promotionsMap[discountsPerProductMap[productId]?.type];
    return {
      amount: roundNumberWithTwoDecimals(discountsPerProductMap[productId]?.amount || 0),
      title: promotion?.description || promotion?.name,
    };
  };

  private parseDiscountsListToProductsMap = (discountsList: Discount[]): { [productId: string]: Discount } => {
    const discountsMap: { [productId: string]: Discount } = {};
    discountsList?.forEach((discount) => {
      if (discount.type !== "coupon" && discount.rule.productId) discountsMap[discount.rule.productId!] = discount;
    });
    return discountsMap;
  };

  private parsePromotionsListToMap = (promotionsList: Promotion[]): { [productId: string]: Promotion } => {
    const promotionsMap: { [productId: string]: Promotion } = {};
    promotionsList?.forEach((item) => {
      if (item.id) promotionsMap[`promo-${item.id}`] = item;
    });
    return promotionsMap;
  };
}
