import { Coupon } from "../../domain/coupons/Coupon";
import { CouponService } from "../../domain/coupons/CouponService";
import { EcommerceClient } from "./EcommerceClient";

export class EcommerceCouponService implements CouponService {
  private readonly ecommerceClient: EcommerceClient;

  constructor(ecommerceClient: EcommerceClient) {
    this.ecommerceClient = ecommerceClient;
  }

  findByCode = async (code: string): Promise<Coupon | undefined> => {
    const response = await this.ecommerceClient.ecommerceApi.content.get(`stripe-coupon?search=${code}`);
    const subscriptionCoupon = response?.results?.find((coupon) =>
      [coupon.stripeId.toLowerCase(), coupon.name.toLowerCase()].includes(code.toLowerCase())
    );
    return this.jsonToCoupon(subscriptionCoupon);
  };

  private jsonToCoupon = ({ period, stripeId, id, name }): Coupon => ({
    couponCode: stripeId,
    id,
    name,
    period,
    stripeId,
  });
}
