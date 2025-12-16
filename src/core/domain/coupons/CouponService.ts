import { Coupon } from "./Coupon";

export interface CouponService {
  findByCode(code: string): Promise<Coupon | undefined>;
}
