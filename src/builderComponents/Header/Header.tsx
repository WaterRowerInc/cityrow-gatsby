import clsx from "classnames";
import ProfileDropdown from "components/ProfileDropdown";
import { User } from "core/domain/user/User";
import { graphql, Link, navigate, StaticQuery } from "gatsby";
import React from "react";
import Logo from "../../assets/images/headerLogo.svg";
import CartMenuItem from "../../components/CartMenuItem/CartMenuItem";
import HamburgerMenuItem from "../../components/HamburgerMenuItem/HamburgerMenuItem";
import { HeaderPresenter, HeaderView } from "../../presenters/Header/HeaderPresenter";
import { PresenterFactory } from "../../presenters/PresenterFactory";
import Menu from "./Components/Menu";
import SubHeader from "./Components/SubHeader/SubHeader";
import "./Header.scss";
import { BuilderPageNav, MenuItem } from "./Menu";

class Header extends React.Component<HeaderProps, State> implements HeaderView {
  state: State = { localizationCode: "", isMobileMenuVisible: false };
  presenter: HeaderPresenter;

  constructor(props) {
    super(props);
    const presenters = new PresenterFactory();
    this.presenter = presenters.header(this);
  }

  componentDidMount = () => this.presenter.start(this.props.path);

  componentDidUpdate = () => this.presenter.refreshPath(this.props.path);

  componentWillUnmount = () => this.presenter.dispose();

  setUser = (user: User) => this.setState({ user });

  toggleMobileMenu = () => this.setState({ isMobileMenuVisible: !this.state.isMobileMenuVisible });

  hideMobileMenu = () => this.setState({ isMobileMenuVisible: false });

  setLocalizationCode = (localizationCode: string) => this.setState({ localizationCode });

  navigateToNewPath = async (path: string) => await navigate(path);

  render = () => {
    const { localizationCode, isMobileMenuVisible, user } = this.state;
    const { cartItemsQuantity, onCartClick, path, visible } = this.props;

    const toggleMobileMenu = this.toggleMobileMenu;
    const hideMobileMenu = this.hideMobileMenu;

    if (!visible) return null;

    return (
      <StaticQuery
        query={graphql`
          query {
            allBuilderModels {
              navigationOptions(limit: 1, target: { urlPath: "/menu" }, options: { cachebust: true }) {
                data {
                  options
                }
              }
            }
          }
        `}
        render={(data) => {
          const options = data.allBuilderModels.navigationOptions[0].data.options;
          const currentPageNav: BuilderPageNav = options.find((menu) =>
            menu.path.parent.options?.find((submenu) => path === `/${localizationCode}${submenu.path}`)
          )?.path.parent;
          const menuOptions: MenuItem[] = [];
          options.forEach((option) => {
            if (option.path.parent.name?.toLowerCase() === "login" && user) return;
            if (!option.path.parent.hide) {
              menuOptions.push(option);
            }
          });
          return (
            <div className='header__container'>
              <div
                className={clsx("header__inner_container", {
                  "header__inner_container--sub-menu": currentPageNav?.hasSubmenu,
                })}
              >
                <div className='header__wrapper'>
                  <div className='header__hamburger'>
                    <HamburgerMenuItem onHamburgerClick={toggleMobileMenu} />
                  </div>
                  <Link to={`${localizationCode && `/${localizationCode}`}/`} onClick={hideMobileMenu}>
                    <img src={Logo} className='header__logo' alt='city row brand' />
                  </Link>
                  <div className='header__row'>
                    <Menu
                      menuOptions={menuOptions}
                      countryParam={localizationCode}
                      onMobileCloseClick={hideMobileMenu}
                      isMobileMenuVisible={isMobileMenuVisible}
                      currentPageNav={currentPageNav}
                      isLoggedIn={!!user}
                      onLogOut={this.presenter.handleLogout}
                    />
                    <div className='header__row__right'>
                      <div className='header__row__right__avatar'>
                        {user && <ProfileDropdown onClickOption={this.presenter.handleProfileOptionClick} />}
                      </div>
                      <div>
                        <CartMenuItem cartItemsQuantity={cartItemsQuantity} onCartClick={onCartClick} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {currentPageNav?.hasSubmenu && (
                <SubHeader
                  isHomePath={path === `/${localizationCode}/`}
                  text={currentPageNav?.textSubmenu}
                  localizationCode={localizationCode}
                  options={currentPageNav?.options}
                  cta={currentPageNav?.cta}
                />
              )}
            </div>
          );
        }}
      />
    );
  };
}

export default Header;

interface HeaderProps {
  cartItemsQuantity: number;
  onCartClick: () => void;
  path: string;
  visible: boolean;
}

interface State {
  localizationCode: string;
  isMobileMenuVisible: boolean;
  user?: User | null;
}
