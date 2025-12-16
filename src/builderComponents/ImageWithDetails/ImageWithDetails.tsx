import * as React from "react";
import ContentSection from "./Components/ContentSection/ContentSection";
import ImageFrameFixWidth from "components/ImageFrameFixWidth/ImageFrameFixWidth";
import ImageFrameDynamicWidth from "components/ImageFrameDynamicWidth/ImageFrameDynamicWidth";
import { PresenterFactory } from "../../presenters/PresenterFactory";
import {
  ComponentWithProductDetailsPresenter,
  ComponentWithProductDetailsView,
} from "../../presenters/ComponentWithProductDetails/ComponentWithProductDetailsPresenter";
import { ProductVM } from "../Product/ProductVM";

const containerFrame = {
  fixWidth: ImageFrameFixWidth,
  fullWidth: ImageFrameDynamicWidth,
};

class ImageWithDetails extends React.PureComponent<Props, State> implements ComponentWithProductDetailsView {
  presenter: ComponentWithProductDetailsPresenter;
  state: State = {
    product: undefined,
  };

  constructor(props) {
    super(props);

    const presenters = new PresenterFactory();
    this.presenter = presenters.componentWithProductDetails(this);
  }

  componentDidMount = async () => {
    const { slug } = this.props;
    await this.presenter.start(slug);
  };

  componentDidUpdate = async (prevProps: Props) => {
    if (prevProps.slug === this.props.slug) return;

    const { slug } = this.props;
    await this.presenter.start(slug);
  };

  clearProduct() {
    this.setState({ product: undefined });
  }

  setProduct(product: ProductVM) {
    this.setState({ product });
  }

  render() {
    const { body, bulletsPoints, fullWidth, ctas, header, imageModel, introText, side } = this.props;
    const { product: { price, priceWithoutSale } = { price: "" } } = this.state;
    const Container = containerFrame[fullWidth ? "fullWidth" : "fixWidth"];
    return (
      <Container imageModel={imageModel} side={side}>
        <ContentSection
          header={header}
          introText={introText}
          body={body}
          bulletsPoints={bulletsPoints}
          ctas={ctas}
          price={price}
          priceWithoutSale={priceWithoutSale}
        />
      </Container>
    );
  }
}

interface Props {
  introText: string;
  header: string;
  body: string;
  slug: string;
  bulletsPoints: { text: string }[];
  ctas: {
    label: string;
    destination: string;
    variation: "primary" | "secondary" | "secondaryWhite";
  }[];
  fullWidth: boolean;
  imageModel: {
    areaFocus?: "Left" | "Right";
    image: string;
    title: string;
  };
  side: "Left" | "Right";
}

interface State {
  product?: ProductVM;
}

export default ImageWithDetails;
