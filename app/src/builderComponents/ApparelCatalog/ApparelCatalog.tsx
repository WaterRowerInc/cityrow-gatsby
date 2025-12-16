import React from "react";
import Loader from "../../components/Loader/Loader";
import { ApparelPresenter, ApparelView } from "../../presenters/Apparel/ApparelPresenter";
import { PresenterFactory } from "../../presenters/PresenterFactory";
import "./ApparelCatalog.scss";
import ApparelItem from "./ApparelItem/ApparelItem";
import { ApparelVM } from "./ApparelVM";

class ApparelCatalog extends React.Component<ApparelCatalogProps, State> implements ApparelView {
  state: State = { isLoading: true, products: [] };
  presenter: ApparelPresenter;

  constructor(props) {
    super(props);
    const presenters = new PresenterFactory();
    this.presenter = presenters.apparelPage(this);
  }

  componentDidMount = async () => await this.presenter.start();

  hideLoader = () => this.setState({ isLoading: false });

  showLoader = () => this.setState({ isLoading: true });

  showProducts = (products: ApparelVM[]) => this.setState({ products });

  render = () => {
    const { title } = this.props;
    const { isLoading, products } = this.state;
    if (isLoading) return <Loader visible={isLoading} />;
    return (
      <div className='apparel-catalog__container__'>
        <h1 className='apparel-catalog__container__title'>{title}</h1>
        <div className='apparel-catalog__container__title-border'>.</div>
        <div className='apparel-catalog__container__items-box'>
          {products.map((apparelItem) => (
            <ApparelItem key={apparelItem.id} apparelItem={apparelItem} />
          ))}
        </div>
      </div>
    );
  };
}

export default ApparelCatalog;

interface State {
  isLoading: boolean;
  products: ApparelVM[];
}

interface ApparelCatalogProps {
  title: string;
}
