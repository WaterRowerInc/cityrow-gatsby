import React from "react";
import "./AccessoriesCatalog.scss";
import { AccessoryPresenter, AccessoryView } from "../../presenters/Accessory/AccessoryPresenter";
import { PresenterFactory } from "../../presenters/PresenterFactory";
import { AccessoryVM } from "./AccessoryItem/AccessoryVM";
import { BundleVM } from "./BundleItem/BundleVM";
import Loader from "../../components/Loader/Loader";
import BundleItem from "./BundleItem/BundleItem";
import AccessoryItem from "./AccessoryItem/AccessoryItem";
import CTAButton from "components/CTAButton/CTAButton";

class AccessoriesCatalog extends React.Component<AccessoriesCatalogProps, State> implements AccessoryView {
  state: State = { isLoading: true, accessoryProducts: [], bundleProducts: [], isCheckoutButtonVisible: false };
  presenter: AccessoryPresenter;

  constructor(props) {
    super(props);
    const presenters = new PresenterFactory();
    this.presenter = presenters.accessoryPage(this);
  }

  componentDidMount = async () => await this.presenter.start(window.location.search);

  hideLoader = () => this.setState({ isLoading: false });

  showLoader = () => this.setState({ isLoading: true });

  showAccessoryProducts = (accessoryProducts: AccessoryVM[]) => this.setState({ accessoryProducts });

  showBundleProducts = (bundleProducts: BundleVM[]) => this.setState({ bundleProducts });

  showCheckoutButton = () => this.setState({ isCheckoutButtonVisible: true });

  render = () => {
    const { kitsTitle, accessoriesTitle } = this.props;
    const { isLoading, accessoryProducts, bundleProducts, isCheckoutButtonVisible } = this.state;
    if (isLoading) return <Loader visible={isLoading} />;
    return (
      <div className={"accessories-catalog__container__"}>
        {!!bundleProducts.length && (
          <>
            <h1 className={"accessories-catalog__container__title"}>{kitsTitle}</h1>
            <div className={"accessories-catalog__container__title-border"}>{"."}</div>
            <div className={"accessories-catalog__container__bundles-box"}>
              <div className={"accessories-catalog__container__bundles-box--container"}>
                {bundleProducts.map((bundleItem) => (
                  <BundleItem key={bundleItem.id} bundleItem={bundleItem} />
                ))}
              </div>
            </div>
          </>
        )}
        {!!accessoryProducts.length && (
          <>
            <h1 className={"accessories-catalog__container__title"}>{accessoriesTitle}</h1>
            <div className={"accessories-catalog__container__title-border"}>{"."}</div>
            <div className={"accessories-catalog__container__items-box"}>
              {accessoryProducts.map((accessoryItem) => (
                <AccessoryItem key={accessoryItem.id} accessoryItem={accessoryItem} />
              ))}
            </div>
            {isCheckoutButtonVisible && <CTAButton text='Proceed to checkout' goTo='/checkout' />}
          </>
        )}
      </div>
    );
  };
}

export default AccessoriesCatalog;

interface State {
  isLoading: boolean;
  accessoryProducts: AccessoryVM[];
  bundleProducts: BundleVM[];
  isCheckoutButtonVisible?: boolean;
}

interface AccessoriesCatalogProps {
  kitsTitle: string;
  accessoriesTitle: string;
}
