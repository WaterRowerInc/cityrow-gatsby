import React, { PureComponent } from "react";
import EmptyCart from "../Cart/Components/EmptyCart";
import { CartVM } from "../Cart/CartVM";
import Item from "./Components/Item";
import "./CartDetails.scss";
import Promo from "./Components/Promo";
import TotalPricesList from "./Components/TotalPricesList";
import Coupon from "./Components/Coupon";
import { CartPresenter, CartView } from "../../presenters/Cart/CartPresenter";
import { PresenterFactory } from "../../presenters/PresenterFactory";
import Loader from "../Loader/Loader";
import DialogModal from "../DialogModal/DialogModal";
import { navigate } from "gatsby";

interface CartDetailsProps {
  isKlarnaPayment?: boolean;
  onShopNow?: () => void;
}

class CartDetails extends PureComponent<CartDetailsProps, State> implements CartView {
  presenter: CartPresenter;

  constructor(props) {
    super(props);
    this.state = {
      invalidPromoCodeText: "",
      loading: false,
      subscriptionHasTrial: true,
      needsSubscriptionModalVisible: false,
      slugToRedirect: "",
      localizationCode: "",
    };

    const presenters = new PresenterFactory();
    this.presenter = presenters.cart(this);
  }

  componentDidMount = async () => {
    await this.presenter.start();
  };

  componentWillUnmount() {
    this.presenter.dispose();
  }

  hideLoader = () => this.setState({ loading: false });

  showCart = (cart: CartVM) =>
    this.setState({
      cart,
      invalidPromoCodeText: "",
    });

  setLocalizationCode = (localizationCode: string) => this.setState({ localizationCode });

  showNeedsSubscriptionModal = (slug: string) =>
    this.setState({ needsSubscriptionModalVisible: true, slugToRedirect: slug });

  hideNeedsSubscriptionModal = () => {
    navigate(`/${this.state.localizationCode}/products/${this.state.slugToRedirect}`);
    this.setState({ needsSubscriptionModalVisible: false, slugToRedirect: "" });
  };

  showInvalidPromoCode = (message?: string) =>
    this.setState({ invalidPromoCodeText: message || "Please enter a valid code" });

  showLoader = () => this.setState({ loading: true });

  updateSubscriptionTrial = (isTrialing: boolean) => this.setState({ subscriptionHasTrial: isTrialing });

  render() {
    const { isKlarnaPayment, onShopNow } = this.props;
    const { cart, invalidPromoCodeText, loading, subscriptionHasTrial, needsSubscriptionModalVisible } = this.state;
    return (
      <>
        {!cart?.itemsQuantity ? (
          <EmptyCart onShopNow={onShopNow} />
        ) : (
          <div className='cart-details__container'>
            <Loader visible={loading} />
            {cart?.items.map((item) => (
              <Item
                key={item.id}
                item={item}
                onRemoveClick={this.presenter.deleteItemFromCart}
                subscriptionHasTrial={subscriptionHasTrial && !isKlarnaPayment}
              />
            ))}
            <Promo onApplyPromo={this.presenter.applyPromoToCart} />
            {invalidPromoCodeText && <span className='promo-code-box__error-message'>{invalidPromoCodeText}</span>}
            {cart.couponCode && <Coupon coupon={cart.coupon!} onRemovePromo={this.presenter.unapplyCouponsFromCart} />}
            <TotalPricesList
              subscriptionDiscounts={!isKlarnaPayment ? cart?.subscriptionDiscounts : undefined}
              discounts={cart?.discounts}
              subtotal={cart?.subTotal}
              shipping={cart?.shipping}
              tax={cart?.tax}
            />
            <div className='cart-details__total-price__container'>
              <p className='cart-details__total-price__title'>Total</p>
              <p className='cart-details__total-price__price'>
                {isKlarnaPayment ? cart?.totalPrice : cart?.displayPrice}
              </p>
            </div>
          </div>
        )}

        {needsSubscriptionModalVisible && (
          <DialogModal
            title=''
            onDismiss={this.hideNeedsSubscriptionModal}
            dismissText='GOT IT'
            subtitle='This is offer is part of a bundle. The bundle will now be removed from your cart.'
          />
        )}
      </>
    );
  }
}

interface State {
  cart?: CartVM;
  invalidPromoCodeText: string;
  loading: boolean;
  subscriptionHasTrial: boolean;
  needsSubscriptionModalVisible: boolean;
  slugToRedirect: string;
  localizationCode: string;
}

export default CartDetails;
