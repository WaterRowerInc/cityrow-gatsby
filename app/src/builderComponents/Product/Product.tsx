import { navigate } from "gatsby";
import React from "react";
import { BuilderImageModel } from "../../components/BuilderImage/BuilderImage.type";
import FlashMessage, { FlashMessageVM } from "../../components/FlashMessage/FlashMessage";
import Loader from "../../components/Loader/Loader";
import { PresenterFactory } from "../../presenters/PresenterFactory";
import { ProductPresenter, ProductView } from "../../presenters/Product/ProductPresenter";
import PhysicalProduct from "./Components/PhysicalProduct/PhysicalProduct";
import SubscriptionProduct from "./Components/SubscriptionProduct/SubscriptionProduct";
import "./Product.scss";
import { ProductVM, VariantVM } from "./ProductVM";
import { ReviewsSummaryVM } from "./ReviewsSummaryVM";

declare global {
  interface Window {
    KlarnaOnsiteService: any;
  }
}

class Product extends React.Component<ProductProps, State> implements ProductView {
  state: State = {
    crossSellProducts: [],
    flashMessage: { message: "", type: "none" },
    isLoading: false,
    isSelectingSubscriptionPlan: false,
    isUserLoggedIn: false,
    product: null,
    selectedSubscription: null,
    selectedVariants: undefined,
    subscriptionProducts: [],
    totalPrice: "",
  };
  presenter: ProductPresenter;
  slider: any;

  constructor(props) {
    super(props);
    const presenters = new PresenterFactory();
    this.presenter = presenters.product(this);
  }

  componentDidMount = async () => {
    await this.presenter.start(this.props.slug);
    window.KlarnaOnsiteService = window.KlarnaOnsiteService || [];
    window.KlarnaOnsiteService.push({ eventName: "refresh-placements" });
  };

  showLoader = () => this.setState({ isLoading: true });

  hideLoader = () => this.setState({ isLoading: false });

  showProduct = (product: ProductVM) => this.setState({ product });

  showReviewsSummary = (reviewsSummary: ReviewsSummaryVM) => this.setState({ reviewsSummary });

  showCrossSellProducts = (crossSellProducts: ProductVM[]) => this.setState({ crossSellProducts });

  showSubscriptions = (subscriptionProducts: ProductVM[]) => this.setState({ subscriptionProducts });

  showTotalPrice = (totalPrice: string, totalPriceWithoutSale?: string) =>
    this.setState({ totalPrice, totalPriceWithoutSale });

  updateSelectedVariants = (selectedVariants: VariantVM[]) => this.setState({ selectedVariants });

  selectSubscription = (selectedSubscription: ProductVM) => this.setState({ selectedSubscription });

  setUserLoggedIn = (isUserLoggedIn: boolean) => this.setState({ isUserLoggedIn });

  showSelectSubscriptionPlan = () => this.setState({ isSelectingSubscriptionPlan: true });

  hideSelectSubscriptionPlan = () => this.setState({ isSelectingSubscriptionPlan: false });

  navigateToAccessories = (locale: string, productId: string) =>
    navigate(`/${locale}/accessories?referrer=pdp`, { state: { productId: productId }, replace: true });

  navigateToCheckout = (locale: string) => navigate(`/${locale}/checkout`);

  navigateToSubscriptionPage = (locale: string) => navigate(`/${locale}/subscription`);

  showError = (message: string) => this.setState({ flashMessage: { message, type: "error" } });

  RenderProduct = () => {
    const { cta, headerImage, productDetailAccordion, subscriptionCta, subscriptionLoggedCta, title } = this.props;
    const {
      crossSellProducts,
      isSelectingSubscriptionPlan,
      isUserLoggedIn,
      product,
      reviewsSummary,
      selectedSubscription,
      selectedVariants,
      subscriptionProducts,
      totalPrice,
      totalPriceWithoutSale,
    } = this.state;

    if (product?.isSubscription)
      return (
        <SubscriptionProduct
          isUserLoggedIn={isUserLoggedIn}
          product={product}
          subscriptionProducts={subscriptionProducts}
          productDetailAccordion={productDetailAccordion}
          onSelectSubscription={this.presenter.onSelectSubscription}
          isSelectingSubscriptionPlan={isSelectingSubscriptionPlan}
          selectedSubscription={selectedSubscription}
          onAddToCart={this.presenter.onSelectPlan}
          onClosePlanSelectorModal={this.presenter.onCloseSelectPlan}
          title={title}
          headerImage={headerImage}
          subscriptionLoggedCta={subscriptionLoggedCta}
          subscriptionCta={subscriptionCta}
        />
      );

    return (
      <PhysicalProduct
        addVariant={this.presenter.addVariant}
        removeVariant={this.presenter.removeVariant}
        crossSellProducts={crossSellProducts}
        cta={cta}
        isSelectingSubscriptionPlan={isSelectingSubscriptionPlan}
        onAddToCart={this.presenter.addToCart}
        onClosePlanSelectorModal={this.presenter.onCloseSelectPlan}
        onCrossSellProductsRemove={this.presenter.onCrossSellProductsRemove}
        onCrossSellProductsSelect={this.presenter.onCrossSellProductsSelect}
        onCrossSellVariantsSelect={this.presenter.onCrossSellVariantsSelect}
        onMultipleVariantOptionSelect={this.presenter.onMultipleVariantsSelect}
        onOptionSelect={this.presenter.onVariantUpdate}
        onPlanSelect={this.presenter.onSelectPlan}
        onSelectSubscription={async () => {
          await this.presenter.onSelectSubscription(selectedSubscription);
        }}
        product={product}
        productDetailAccordion={productDetailAccordion}
        reviewsSummary={reviewsSummary}
        selectedSubscription={selectedSubscription}
        selectedVariants={selectedVariants}
        totalPrice={this.props.salePrice || totalPrice}
        totalPriceWithoutSale={this.props.originalPrice || totalPriceWithoutSale}
        title={title}
        headerImage={headerImage}
      />
    );
  };

  render = () => {
    const { flashMessage, isLoading } = this.state;

    return (
      <>
        <FlashMessage message={flashMessage?.message} type={flashMessage?.type} />
        <this.RenderProduct />
        <Loader visible={isLoading} />
      </>
    );
  };
}

export default Product;

export interface ProductProps {
  title: string;
  slug: string;
  originalPrice?: string;
  salePrice?: string;
  cta?: {
    label: string;
    destination: string;
    variation: "primary" | "secondary" | "secondaryWhite" | "link" | "linkInverse";
  };
  productDetailAccordion: {
    header: string;
    body: any;
  }[];
  headerImage?: BuilderImageModel;
  subscriptionLoggedCta?: string;
  subscriptionCta?: string;
}

interface State {
  crossSellProducts: ProductVM[];
  flashMessage: FlashMessageVM;
  isLoading: boolean;
  isSelectingSubscriptionPlan: boolean;
  isUserLoggedIn: boolean;
  product: ProductVM | null;
  reviewsSummary?: ReviewsSummaryVM;
  selectedSubscription: ProductVM | null;
  selectedVariants?: VariantVM[];
  subscriptionProducts: ProductVM[];
  totalPrice: string;
  totalPriceWithoutSale?: string;
}
