import * as React from "react";
import sha1 from "js-sha1";
import { PresenterFactory } from "../../presenters/PresenterFactory";
import { OrderVM } from "../../builderComponents/PurchaseConfirmation/OrderVM";
import { ImpactPresenter, ImpactView } from "../../presenters/Impact/ImpactPresenter";

declare global {
  interface Window {
    ire: any;
  }
}

class Impact extends React.Component<Props, {}> implements ImpactView {
  presenter: ImpactPresenter;

  constructor(props) {
    super(props);
    const presenters = new PresenterFactory();
    this.presenter = presenters.impact(this);
  }

  componentDidMount = async () => {
    await this.presenter.start(this.props.noRunIdentify);
  };

  componentDidUpdate = async (nextProps) => {
    const { order } = this.props;
    if (nextProps.order !== order && order?.id) {
      const trackConversionOrder = await this.presenter.getTrackConversionOrder(order);
      window.ire("trackConversion", 22133, trackConversionOrder);
    }
  };

  identifyImpactUser = (userId: string, email: string) => {
    window.ire("identify", {
      customerId: userId,
      customerEmail: email ? sha1(email) : email,
    });
  };

  render = () => <></>;
}

export default Impact;

interface Props {
  noRunIdentify?: boolean;
  order?: OrderVM;
}
