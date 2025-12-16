import React from "react";
import BuilderBackgroundImage from "../../../components/BuilderImage/BuilderBackgroundImage";
import BulletList from "../../../components/BulletList/BulletList";
import CTAButton from "../../../components/CTAButton/CTAButton";
import {
  ComponentWithProductDetailsPresenter,
  ComponentWithProductDetailsView,
} from "../../../presenters/ComponentWithProductDetails/ComponentWithProductDetailsPresenter";
import { PresenterFactory } from "../../../presenters/PresenterFactory";
import { ProductVM } from "../../Product/ProductVM";

export class ProductSection extends React.PureComponent<Props, State> implements ComponentWithProductDetailsView {
  presenter: ComponentWithProductDetailsPresenter;
  state: State = {};

  constructor(props) {
    super(props);

    const presenters = new PresenterFactory();
    this.presenter = presenters.componentWithProductDetails(this);
  }

  componentDidMount = async () => await this.presenter.start(this.props.product.slug);

  componentDidUpdate = async (prevProps: Props) => {
    if (prevProps.product.slug === this.props.product.slug) return;

    await this.presenter.start(this.props.product.slug);
  };

  clearProduct = () => this.setState({ productVM: undefined });

  setProduct = (productVM: ProductVM) => this.setState({ productVM });

  render() {
    const { product } = this.props;
    const { productVM: { price, priceWithoutSale } = {} } = this.state;

    return (
      <div className='productComparison__productSectionContainer'>
        <BuilderBackgroundImage
          contain
          className='productComparison__image'
          imageModel={{ image: product?.image!, title: product?.title! }}
        />
        <h3 className='productComparison__title'>{product?.title}</h3>
        <h5 className='productComparison__subTitle'>{product?.subTitle}</h5>

        <div className='productComparison__priceContainer'>
          <span className='productComparison__priceContainer__text'>Starting at</span>{" "}
          <span className='productComparison__priceContainer__price-without-sale'>{priceWithoutSale}</span>
          <span className='productComparison__priceContainer__price'>{price}</span>
        </div>

        {product?.cta && (
          <CTAButton
            customClass='productComparison__cta'
            goTo={product.cta.destination}
            external={product.cta.external}
            text={product.cta.label}
            variation={product.cta.variation}
          />
        )}

        <div className='productComparison__uniqueFeature'>
          <BulletList options={product?.uniqueFeatures} labelKey='feature' />
        </div>

        <div className='productComparison__ctasContainer'>
          {product?.ctas?.map((cta, index) => (
            <CTAButton
              key={`cta-${index}`}
              customClass='productComparison__cta'
              goTo={cta.destination}
              external={cta.external}
              text={cta.label}
              variation={cta.variation}
            />
          ))}
        </div>
      </div>
    );
  }
}

interface Props {
  product: ProductComparisonDetail;
}

interface State {
  productVM?: ProductVM;
}

export interface ProductComparisonDetail {
  image: string;
  name: string;
  title: string;
  subTitle: string;
  slug: string;
  uniqueFeatures: { feature: string }[];
  cta: CTA;
  ctas: CTA[];
}

interface CTA {
  label: string;
  destination: string;
  external: boolean;
  variation: "primary" | "secondary" | "secondaryWhite" | "link" | "linkInverse";
}
