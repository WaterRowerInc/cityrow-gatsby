import React from "react";
import "../builder-settings";
import Header from "../builderComponents/Header/Header";
import { PresenterFactory } from "../presenters/PresenterFactory";
import { PageLayoutPresenter, PageLayoutView } from "../presenters/PageLayoutPresenter";
import { navigate } from "gatsby";
import Footer from "../builderComponents/footer/Footer";
import Cart from "../components/Cart/Cart";

class PageLayout extends React.Component<PageLayoutProps, State> implements PageLayoutView {
  state: State = {
    cartItemsQuantity: 0,
    hasFooter: false,
    hasHeader: false,
    isCartLoading: false,
    isCartVisible: false,
    isCheckoutAvailable: false,
  };
  presenter: PageLayoutPresenter;

  constructor(props: PageLayoutProps) {
    super(props);
    const presenters = new PresenterFactory();
    this.presenter = presenters.pageLayout(this);
  }

  componentDidMount = async () => await this.presenter.start(this.props.path!);

  componentWillUnmount = () => this.presenter.dispose();

  closeCart = () => this.setState({ isCartVisible: false });

  loadCart = () => this.setState({ isCartVisible: true, isCartLoading: true });

  navigateToPageWithLocalization = async (slugWithLocalization: string) =>
    await navigate(`/${slugWithLocalization}${this.props.location.search}`);

  setCartStatus = ({ cartItemsQuantity, isCheckoutAvailable }) =>
    this.setState({ isCartLoading: false, isCheckoutAvailable, cartItemsQuantity });

  showFooter = () => this.setState({ hasFooter: true });

  showHeader = () => this.setState({ hasHeader: true });

  render = () => {
    const { path, children } = this.props;
    const { cartItemsQuantity, hasFooter, hasHeader, isCheckoutAvailable, isCartVisible, isCartLoading } = this.state;
    return (
      <>
        <Header
          visible={hasHeader}
          path={path!}
          cartItemsQuantity={cartItemsQuantity || 0}
          onCartClick={this.presenter.showCart}
        />
        {children}
        <Footer path={path!} visible={hasFooter} />
        <Cart
          isCheckoutAvailable={isCheckoutAvailable}
          cartItemsQuantity={cartItemsQuantity}
          isVisible={isCartVisible}
          isLoading={isCartLoading}
          onClose={this.presenter.closeCart}
        />
      </>
    );
  };
}

interface PageLayoutProps {
  children: React.ReactChild;
  path?: string;
  location: {
    search?: string;
  };
}

interface State {
  cartItemsQuantity: number;
  isCartVisible: boolean;
  isCartLoading: boolean;
  isCheckoutAvailable: boolean;
  hasHeader: boolean;
  hasFooter: boolean;
}

export default PageLayout;
