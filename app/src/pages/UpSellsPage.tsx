// noinspection JSUnusedGlobalSymbols

import React from "react";
import { PresenterFactory } from "../presenters/PresenterFactory";
import { UpSellsPresenter, UpSellsView } from "../presenters/UpSellsPresenter";
import { ProductVM } from "../builderComponents/Product/ProductVM";
import Loader from "../components/Loader/Loader";
import "../components/UpSells/UpSellsPage.scss";
import UpSellSection from "../components/UpSells/UpSellSection";
import Impact from "../components/Impact/Impact";

class UpSellsPage extends React.Component<UpSellsProps, State> implements UpSellsView {
  state: State = { isLoading: true, upSells: [], relatedProducts: [] };
  presenter: UpSellsPresenter;

  constructor(props) {
    super(props);
    const presenters = new PresenterFactory();
    this.presenter = presenters.upSellsPage(this);
  }

  componentDidMount = async () => {
    await this.presenter.start(this.props.location.state.productId);
  };

  showLoader = () => this.setState({ isLoading: true });

  hideLoader = () => this.setState({ isLoading: false });

  showUpSells = (upSells: ProductVM[]) => this.setState({ upSells });

  showRelatedProducts = (relatedProducts: ProductVM[]) => this.setState({ relatedProducts });

  render = () => {
    const { isLoading, upSells, relatedProducts } = this.state;
    if (isLoading) return <Loader visible={isLoading} />;
    return (
      <div className='upSellsPage__container'>
        <UpSellSection products={upSells} title='Get Everything You Need' />
        <UpSellSection products={relatedProducts} title='Related Products' />
        <Impact />
      </div>
    );
  };
}

export default UpSellsPage;

interface State {
  isLoading: boolean;
  upSells: ProductVM[];
  relatedProducts: ProductVM[];
}

interface UpSellsProps {
  location: { state: { productId: string } };
}
