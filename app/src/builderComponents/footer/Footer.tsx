import * as React from "react";
import { graphql, navigate, StaticQuery } from "gatsby";
import { Dropdown } from "semantic-ui-react";
import TextFieldWithButton from "components/TextFieldWithButton/TextFieldWithButton";
import Navigation from "./components/Navigation/Navigation";
import UserStatusIndicator from "./components/UserStatusIndicator/UserStatusIndicator";
import "./footer.scss";
import { PresenterFactory } from "../../presenters/PresenterFactory";
import { FooterPresenter, FooterView } from "../../presenters/FooterPresenter";
import Country from "../../core/domain/localization/Country";
import { DropdownOptionType } from "../../components/Form/DropdownField/DropdownOptionType";
import { User } from "../../core/domain/user/User";
import { Link } from "gatsby";

class Footer extends React.Component<FooterProps, State> implements FooterView {
  state: State = { localizationCode: "", countryList: [], currentCountry: "", user: null };
  presenter: FooterPresenter;

  constructor(props) {
    super(props);
    const presenters = new PresenterFactory();
    this.presenter = presenters.footer(this);
  }

  componentDidMount = () => this.presenter.start(this.props.path);

  componentDidUpdate = () => this.presenter.refreshPath(this.props.path);

  componentWillUnmount = () => this.presenter.dispose();

  setLocalizationCode = (localizationCode: string) => this.setState({ localizationCode });

  showCountries = (countries: Country[]) => this.setState({ countryList: countries });

  updateSelectedCountry = (country: string) => this.setState({ currentCountry: country });

  navigateToNewPath = async (path: string) => await navigate(path);

  setUser = (user: User | null) => this.setState({ user });

  render() {
    const { localizationCode, currentCountry, countryList, user } = this.state;

    if (!this.props.visible) return null;

    return (
      <div className='footer__wrapper'>
        <div className='footer__inner-wrapper'>
          <div className='footer__container'>
            <div className="footer__links">
              <div className="asd">
                    <Link
                        to={`${localizationCode && `/${localizationCode}`}/app`}
                        className='footer__links__link'>
                        App
                    </Link>
                     <Link
                        to={`${localizationCode && `/${localizationCode}`}/experience/overview`}
                        className='footer__links__link'>
                        Experience
                    </Link>
                         <a
                        className='footer__links__link'
                        href="https://go-help.cityrow.com/en/"
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                       Help
                    </a>
              </div>
              <div className="asd">
                      <a
                        className='footer__links__link'
                        href="mailto:go@cityrow.com?subject=Inquiry about CITYROW GO"
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        Contact Us
                    </a>
                     <Link
                        to={`${localizationCode && `/${localizationCode}`}/privacy-policy`}
                        className='footer__links__link'>
                        Privacy Policy
                    </Link>
                     <Link
                        to={`${localizationCode && `/${localizationCode}`}/terms-of-service`}
                        className='footer__links__link'>
                        Terms of Service
                    </Link>
              </div>
            </div>
          </div>

          <div className='footer__container'>
            <UserStatusIndicator
              localizationCode={localizationCode}
              onLogout={this.presenter.handleLogout}
              isAuthenticated={!!user}
            />
          </div>

          <div className='footer__container'>
            <div className='footer__dropdowns'>
              <div className='footer__country'>
                <p className='footer__country-label'>COUNTRY/REGION</p>
                <div>
                  <Dropdown
                    disabled={true}
                    value={currentCountry}
                    fluid={true}
                    onChange={this.presenter.changeLocale}
                    selection={true}
                    search={true}
                    selectOnBlur={false}
                    options={countryList}
                    icon='chevron down'
                  />
                </div>
              </div>
              <div className='footer__stay-touch'>
                <p className='footer__stay-touch-title'>STAY IN TOUCH</p>
                <TextFieldWithButton
                  placeholder='Email'
                  onSubmit={this.presenter.trackEmailSubmitted}
                  actionText='GO'
                  type='email'
                  className='footer__stay-touch-input'
                />
              </div>
            </div>

            <div className='footer__social-networks__'>
              <a
                href='https://www.facebook.com/cityrow/'
                target='_blank'
                rel='noopener noreferrer'
                className='footer__social-networks__icon'
              >
                <div className='footer__social-networks__facebook' />
              </a>
              <a
                href='https://www.instagram.com/cityrow/'
                target='_blank'
                rel='noopener noreferrer'
                className='footer__social-networks__icon'
              >
                <div className='footer__social-networks__instagram' />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;

const query = graphql`
  query {
    allBuilderModels {
      navigationOptions(limit: 1, query: { name: "Footer" }, options: { cachebust: true }) {
        content
      }
    }
  }
`;

interface FooterProps {
  path: string;
  visible: boolean;
}

interface State {
  localizationCode: string;
  currentCountry: string;
  countryList: DropdownOptionType[];
  user: User | null;
}
