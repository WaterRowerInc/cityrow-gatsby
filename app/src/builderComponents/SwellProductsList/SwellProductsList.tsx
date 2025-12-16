import React from "react";
import "./SwellProductsList.scss";
import { PresenterFactory } from "../../presenters/PresenterFactory";
import Loader from "../../components/Loader/Loader";
import { SwellProductInfoVM } from "../../components/SwellProductInfo/SwellProductInfoVM";
import { SwellProductListPresenter, SwellProductListView } from "../../presenters/SwellProductListPresenter";
import SwellProductInfo from "./SwellProductInfo/SwellProductInfo";

class SwellProductsList extends React.Component<State> implements SwellProductListView {
  state: State = { isLoading: true, products: [] };
  presenter: SwellProductListPresenter;

  constructor(props) {
    super(props);
    const presenters = new PresenterFactory();
    this.presenter = presenters.swellProductsListPage(this);
  }

  componentDidMount = async () => await this.presenter.start();

  hideLoader = () => this.setState({ isLoading: false });

  showLoader = () => this.setState({ isLoading: true });

  showProducts = (products: SwellProductInfoVM[]) => this.setState({ products });

  render = () => {
    const { isLoading, products } = this.state;
    if (isLoading) return <Loader visible={isLoading} />;
    return (
      <div className={"swell-product-list__container__"}>
        <h1 className={"swell-product-list__container__title"}>{"Swell Products List"}</h1>
        <div className={"swell-product-list__container__title-border"}>{"."}</div>
        <div className={"swell-product-list__container__items-box"}>
          {products.map((swellProduct) => (
            <SwellProductInfo product={swellProduct} key={swellProduct.id} />
          ))}
        </div>
      </div>
    );
  };
}

export default SwellProductsList;

interface State {
  isLoading: boolean;
  products: SwellProductInfoVM[];
}
