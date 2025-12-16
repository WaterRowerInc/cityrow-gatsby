import React from "react";
import "./ShopAllItem.scss";
import ShopAllItemProps from "./ShopAllItemProps";
import {
  ComponentWithProductDetailsPresenter,
  ComponentWithProductDetailsView,
} from "../../../../presenters/ComponentWithProductDetails/ComponentWithProductDetailsPresenter";
import { ProductVM } from "builderComponents/Product/ProductVM";
import { PresenterFactory } from "../../../../presenters/PresenterFactory";
import BuilderImage from "../../../../components/BuilderImage/BuilderImage";
import CTAButton from "../../../../components/CTAButton/CTAButton";

class ShopAllItem extends React.PureComponent<Props, State> implements ComponentWithProductDetailsView {
  presenter: ComponentWithProductDetailsPresenter;
  state: State = {};

  constructor(props) {
    super(props);

    const presenters = new PresenterFactory();
    this.presenter = presenters.componentWithProductDetails(this);
  }

  componentDidMount = async () => await this.presenter.start(this.props.item.slug);

  clearProduct = () => this.setState({ product: undefined });

  setProduct = (product: ProductVM) => this.setState({ product });

  render = () => {
    const { description, imageModel, includes, link, name, priceClarification, priceDetail } = this.props.item;
    const { product } = this.state;
    return (
      <div className='shop-all-item__container__'>
        <BuilderImage imageModel={imageModel!} className='shop-all-item__container__photo' />
        <h1 className='shop-all-item__container__name'>{name}</h1>
        <h2 className='shop-all-item__container__price'>
          {product?.priceWithoutSale && (
            <span className='shop-all-item__container__price__original'>{product?.priceWithoutSale}</span>
          )}
          <span className='shop-all-item__container__price__sale'>{product?.price}</span>
        </h2>
        <h3 className='shop-all-item__container__price-clarification'>{priceClarification}</h3>
        <h3 className='shop-all-item__container__price-detail'>{priceDetail}</h3>
        <div className='shop-all-item__container__separator'>.</div>
        {description && (
          <p className='shop-all-item__container__price-detail shop-all-item__container__description'>{description}</p>
        )}
        {includes && (
          <div>
            <h3 className='shop-all-item__container__include-title'>INCLUDES</h3>
            {includes.map((included, index) => (
              <h3 key={`ii${index}`} className='shop-all-item__container__item-included'>
                {included.itemIncluded}
              </h3>
            ))}
          </div>
        )}
        <CTAButton goTo={link} text='SHOP NOW' customClass='shop-all-item__container__cta-box--button' />
      </div>
    );
  };
}

interface Props {
  item: ShopAllItemProps;
}

interface State {
  product?: ProductVM;
}

export default ShopAllItem;
