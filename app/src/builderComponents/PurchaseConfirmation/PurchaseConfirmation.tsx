import * as React from "react";
import "./PurchaseConfirmation.scss";
import {
  PurchaseConfirmationPresenter,
  PurchaseConfirmationView,
} from "../../presenters/PurchaseConfirmation/PurchaseConfirmationPresenter";
import { PresenterFactory } from "../../presenters/PresenterFactory";
import DeliveryInfo from "./Components/DeliveryInfo/DeliveryInfo";
import StoreLinks from "./Components/StoreLinks/StoreLinks";
import Help from "./Components/Help/Help";
import PurchaseDetails from "./Components/PurchaseDetails/PurchaseDetails";
import Loader from "../../components/Loader/Loader";
import FlashMessage, { FlashMessageVM } from "../../components/FlashMessage/FlashMessage";
import { OrderVM } from "./OrderVM";
import Impact from "../../components/Impact/Impact";

class PurchaseConfirmation extends React.PureComponent<Props, State> implements PurchaseConfirmationView {
  presenter: PurchaseConfirmationPresenter;
  state: State = {
    isLoading: false,
    isDeliveryVisible: false,
    flashMessage: {
      message: "",
      type: "none",
    },
  };

  constructor(props) {
    super(props);

    const presenters = new PresenterFactory();
    this.presenter = presenters.purchaseConfirmation(this);
  }

  componentDidMount = async () => {
    await this.presenter.start();
  };

  hideLoader = () => this.setState({ isLoading: false });

  showDeliveryInfo = () => this.setState({ isDeliveryVisible: true });

  showErrorMessage = (message: string) =>
    this.setState({
      flashMessage: {
        message,
        type: "error",
      },
    });

  showLoader = () => this.setState({ isLoading: true });

  showOrder = (order: OrderVM) => this.setState({ order });

  render() {
    const { order, isLoading, isDeliveryVisible, flashMessage } = this.state;
    const { downloadMessage, greetingMessage, subTitle, hideDetails, leftSection, rightSection } = this.props;

    return (
      <div className='purchase-confirmation__container'>
        <FlashMessage message={flashMessage.message} type={flashMessage.type} />
        <div className='purchase-confirmation__content'>
          <div className={"purchase-confirmation__header"}>
            <h2 className={"purchase-confirmation__header-title"}>
              {!!order?.account?.firstName && order?.account?.firstName}
              {greetingMessage}
            </h2>
            <h3 className={"purchase-confirmation__header-subTitle"}>No. {order?.number}</h3>
          </div>

          <div className={"purchase-confirmation__title-border"}>.</div>

          <p className='purchase-confirmation__body'>{subTitle}</p>

          {!hideDetails && (
            <>
              <PurchaseDetails order={order} />

              {isDeliveryVisible && (
                <DeliveryInfo
                  fullName={order?.shipping?.name}
                  street={order?.shipping?.street}
                  city={order?.shipping?.city}
                  zip={order?.shipping?.zip}
                  state={order?.shipping?.state}
                  deliveryType={order?.shipping?.deliveryType}
                />
              )}
            </>
          )}

          <StoreLinks content={downloadMessage} />

          <Help leftSection={leftSection} rightSection={rightSection} />
        </div>
        <div className='purchase-confirmation__footer-waves' />
        <Loader visible={isLoading} />
        <Impact noRunIdentify order={order} />
      </div>
    );
  }
}

export default PurchaseConfirmation;

interface State {
  order?: OrderVM;
  isLoading: boolean;
  isDeliveryVisible: boolean;
  flashMessage: FlashMessageVM;
}

interface Props {
  downloadMessage: string;
  greetingMessage: string;
  subTitle: string;
  hideDetails: boolean;
  leftSection: Section;
  rightSection: Section;
}

export interface Section {
  body: string;
  icon: {
    title: string;
    image: string;
  };
  title: string;
  buttonLabel?: string;
  destination?: string;
  external: boolean;
}
