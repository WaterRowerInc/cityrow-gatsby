import close from "assets/images/close-black.png";
import { Link } from "gatsby";
import React from "react";
import classes from "../../../../assets/images/classes.png";
import clock from "../../../../assets/images/clock.png";
import live from "../../../../assets/images/live.png";
import metrics from "../../../../assets/images/metrics.png";
import CustomButton from "../../../../components/CustomButton/CustomButton";
import Overlay from "../../../../components/Overlay/Overlay";
import { PresenterFactory } from "../../../../presenters/PresenterFactory";
import {
  SubscriptionPlanSelectorModalPresenter,
  SubscriptionPlanSelectorModalView,
} from "../../../../presenters/SubscriptionPlanSelectorModal/SubscriptionPlanSelectorModalPresenter";
import { ProductOptionValueVM, ProductVM } from "../../ProductVM";
import "./SubscriptionPlanSelectorModal.scss";

class SubscriptionPlanSelectorModal
  extends React.PureComponent<Props, State>
  implements SubscriptionPlanSelectorModalView
{
  presenter: SubscriptionPlanSelectorModalPresenter;
  state: State = {
    isUserLoggedIn: false,
    selectedPlan: null,
    locale: "",
  };

  constructor(props) {
    super(props);

    const presenters = new PresenterFactory();
    this.presenter = presenters.subscriptionPlanSelectorModal(this);
  }

  componentDidMount = async () => {
    await this.presenter.start();
  };

  setIsUserLoggedIn = (isUserLoggedIn: boolean) => this.setState({ isUserLoggedIn });

  setSelectedPlan = (selectedPlan) => this.setState({ selectedPlan });

  setLocale = (locale: string) => this.setState({ locale });

  private getVariantPriceFromOptionId = (id: string) =>
    this.props.subscription?.variants.find((variant) => variant.optionsIds.find((optionId) => optionId === id))
      ?.price || 0;

  render() {
    const { isVisible, subscription, onAddToCart, onClose } = this.props;

    const { selectedPlan, isUserLoggedIn } = this.state;

    if (!isVisible || !subscription) return null;
    return (
      <Overlay onClick={onClose}>
        <div className='subscription-plan-selector-modal__container'>
          <img src={close} alt='close' className='subscription-plan-selector-modal__close' />
          <h2 className='subscription-plan-selector-modal__title'>Select Your Subscription Plan</h2>
          <div className='subscription-plan-selector-modal__title-underline'>.</div>
          <p className='subscription-plan-selector-modal__sub-title'>
            Your first two weeks are free! Access hundreds of classes and track your progress with a CITYROW App
            subscription. Choose a monthly plan, or save when you sign up for a year.
          </p>
          {!isUserLoggedIn && (
            <p className='subscription-plan-selector-modal__login__text'>
              Already have an account?
              <Link
                to={`/${this.state.locale}/login?goBack=true`}
                className='subscription-plan-selector-modal__login__link'
              >
                Log In
              </Link>
            </p>
          )}
          <div className='subscription-plan-selector-modal__second-title__container'>
            <div className='subscription-plan-selector-modal__second-title__line' />
            <h6 className='subscription-plan-selector-modal__second-title__title'>SUBSCRIPTION PLANS INCLUDE</h6>
            <div className='subscription-plan-selector-modal__second-title__line' />
          </div>
          <div className='subscription-plan-selector-modal__plan-details__container'>
            <div className='subscription-plan-selector-modal__plan-details__wrapper'>
              <img src={clock} alt='clock' className='subscription-plan-selector-modal__plan-details__icon' />
              <p className='subscription-plan-selector-modal__plan-details__text'>
                Real-time performance data while you row
              </p>
            </div>
            <div className='subscription-plan-selector-modal__plan-details__wrapper'>
              <img src={live} alt='classes' className='subscription-plan-selector-modal__plan-details__icon' />
              <p className='subscription-plan-selector-modal__plan-details__text'>New classes added daily</p>
            </div>
          </div>
          <div className='subscription-plan-selector-modal__plan-details__container'>
            <div className='subscription-plan-selector-modal__plan-details__wrapper'>
              <img src={metrics} alt='metrics' className='subscription-plan-selector-modal__plan-details__icon' />
              <p className='subscription-plan-selector-modal__plan-details__text'>
                Track your progress, set personal goals, hit new records, and acquire badges
              </p>
            </div>
            <div className='subscription-plan-selector-modal__plan-details__wrapper'>
              <img src={classes} alt='trainers' className='subscription-plan-selector-modal__plan-details__icon' />
              <p className='subscription-plan-selector-modal__plan-details__text'>
                Thousands of on-demand classes and multiple class types to choose from
              </p>
            </div>
          </div>
          <div className='subscription-plan-selector-modal__plan-details__closing-line' />
          <div
            className={`subscription-plan-selector-modal__plans-container ${
              subscription.options.length === 1 && "subscription-plan-selector-modal__plans-container--onePlan"
            }`}
          >
            {subscription.options
              .find((option) => option.name?.toLowerCase() === "subscription")
              ?.values.map((optionValue) => {
                const variantPrice = this.getVariantPriceFromOptionId(optionValue.id);
                return (
                  <div
                    key={optionValue.id}
                    className={`subscription-plan-selector-modal__plan__ ${selectedPlan?.id === optionValue.id}`}
                    onClick={() => {
                      this.setSelectedPlan(optionValue);
                      onAddToCart(optionValue);
                    }}
                    role={"button"}
                    onKeyPress={(e) => {
                      if (e.key.toLowerCase() === "enter") {
                        this.setSelectedPlan(optionValue);
                        onAddToCart(optionValue);
                      }
                    }}
                    tabIndex={0}
                  >
                    <div className='subscription-plan-selector-modal__plan__title__container'>
                      <h4 className='subscription-plan-selector-modal__plan__title__text'>{optionValue.name} Plan</h4>
                      {optionValue.name.toLowerCase() === "yearly" && (
                        <div className='subscription-plan-selector-modal__plan__title__most-popular__container'>
                          <p className='subscription-plan-selector-modal__plan__title__most-popular__text'>
                            Most Popular
                          </p>
                        </div>
                      )}
                    </div>
                    <div className='subscription-plan-selector-modal__plan__body-container'>
                      <div className='subscription-plan-selector-modal__plan__price__container'>
                        <div className='subscription-plan-selector-modal__plan__price__number__container'>
                          {variantPrice < optionValue.price && (
                            <h4 className='subscription-plan-selector-modal__plan__price__number-strikethrough'>
                              {`${optionValue.price}.00`}
                            </h4>
                          )}
                          <h4 className='subscription-plan-selector-modal__plan__price__number'>{variantPrice}</h4>
                        </div>
                        <p className='subscription-plan-selector-modal__plan__price__description'>
                          billed {optionValue.name}
                          {!isUserLoggedIn && ` after free ${optionValue.subscriptionTrialDays}-day trial`}
                        </p>
                      </div>
                      <div className='subscription-plan-selector-modal__plan__description__container'>
                        <p className='subscription-plan-selector-modal__plan__description__text'>
                          {optionValue.description}
                        </p>
                      </div>
                      <CustomButton
                        customClass='subscription-plan-selector-modal__plan__add-to-cart'
                        text='ADD PLAN TO CART'
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Overlay>
    );
  }
}

interface Props {
  isVisible: boolean;
  subscription: ProductVM | null;
  onAddToCart: (ProductOptionValueVM: ProductOptionValueVM) => void;
  onClose: () => void;
}

interface State {
  isUserLoggedIn: boolean;
  selectedPlan: ProductOptionValueVM | null;
  locale: string;
}

export default SubscriptionPlanSelectorModal;
