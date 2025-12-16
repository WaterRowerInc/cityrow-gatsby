import { GetSlugWithLocalizationCode } from "../core/useCases/GetSlugWithLocalizationCode/GetSlugWithLocalizationCode";
import { GetCart } from "../core/useCases/GetCart/GetCart";
import { CartSubscription } from "core/domain/orders/CartService";
import { IdentifyAnalyticsUser } from "../core/useCases/TrackAnalytics/Identify/IdentifyAnalyticsUser";

export interface PageLayoutView {
  navigateToPageWithLocalization(locale: string);

  closeCart();

  loadCart();

  setCartStatus(status: { cartItemsQuantity: number; isCheckoutAvailable: boolean });

  showFooter();

  showHeader();
}

const PAGES_WITHOUT_FOOTER = ["-app"];
const PAGES_WITHOUT_HEADER = ["-app"];

export class PageLayoutPresenter {
  private view: PageLayoutView;
  private cartUpdatesSubscription?: CartSubscription;
  private getCart: GetCart;
  private getSlugWithLocalizationCode: GetSlugWithLocalizationCode;
  private identifyAnalyticsUser: IdentifyAnalyticsUser;

  constructor(
    view: PageLayoutView,
    getCart: GetCart,
    getSlugWithLocalizationCode: GetSlugWithLocalizationCode,
    identifyAnalyticsUser: IdentifyAnalyticsUser
  ) {
    this.view = view;
    this.getCart = getCart;
    this.getSlugWithLocalizationCode = getSlugWithLocalizationCode;
    this.identifyAnalyticsUser = identifyAnalyticsUser;
  }

  start = async (slug: string) => {
    this.initHeader(slug);
    this.initFooter(slug);
    this.identifyAnalyticsUser.execute().then();
    this.handleCartUpdate(await this.getCart.execute());
    this.cartUpdatesSubscription = this.getCart.subscribe(this.handleCartUpdate);
    this.initLocalization(slug);
  };

  closeCart = () => this.view.closeCart();

  dispose = () => this.cartUpdatesSubscription?.unsubscribe();

  showCart = async () => this.view.loadCart();

  private initHeader = (slug: string) => {
    if (PAGES_WITHOUT_HEADER.find((page) => slug.includes(page))) return;
    this.view.showHeader();
  };

  private initFooter = (slug: string) => {
    if (PAGES_WITHOUT_FOOTER.find((page) => slug.includes(page))) return;
    this.view.showFooter();
  };

  private handleCartUpdate = (cart) => {
    const cartItemsQuantity = cart.getItemsQuantity();
    const isCheckoutAvailable = !!cartItemsQuantity;
    this.view.setCartStatus({ cartItemsQuantity, isCheckoutAvailable });
  };

  private initLocalization = (slug: string) => {
    const slugWithLocalization = this.getSlugWithLocalizationCode.execute(slug);
    if (slugWithLocalization.toLowerCase() !== slug.toLowerCase())
      this.view.navigateToPageWithLocalization(slugWithLocalization);
  };
}
