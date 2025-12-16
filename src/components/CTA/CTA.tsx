import React from "react";
import { Link } from "gatsby";
import { PresenterFactory } from "../../presenters/PresenterFactory";
import { CTAPresenter, CTAView } from "../../presenters/CTA/CTAPresenter";
import "./CTA.scss";

class CTA extends React.Component<CTAPropsType, State> implements CTAView {
  state: State = { localizationCode: "" };
  presenter: CTAPresenter;

  constructor(props: CTAPropsType) {
    super(props);
    const presenters = new PresenterFactory();
    this.presenter = presenters.cta(this);
  }

  componentDidMount = (): void => this.presenter.start();

  setLocalizationCode = (localizationCode: string): void => this.setState({ localizationCode });

  render = (): React.ReactNode => {
    const { children, className, disabled, external, goTo, onClick, text } = this.props;
    const { localizationCode } = this.state;
    const Tag = external ? "a" : Link;
    return (
      <Tag
        {...(external && { href: goTo })}
        to={external ? goTo : `${localizationCode && `/${this.state.localizationCode}`}${goTo}`}
        className={`cta ${className}`}
        {...(external && { target: "_blank" })}
        {...(external && { rel: "noopener noreferrer" })}
        {...(!disabled && {
          onClick: () => {
            this.presenter.trackAnalytics(window.location.href, goTo, text).then();
            if (onClick) onClick();
          },
        })}
      >
        {children}
      </Tag>
    );
  };
}

interface CTAPropsType {
  className?: string;
  disabled?: boolean;
  external?: boolean;
  goTo: string;
  onClick?: () => void;
  children: React.ReactNode;
  text: string;
}

interface State {
  localizationCode: string;
}

export default CTA;
