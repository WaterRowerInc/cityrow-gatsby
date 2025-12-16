import React from "react";
import { Link } from "gatsby";
import clsx from "classnames";
import "./Menu.scss";
import close from "assets/images/close.png";
import MobileMenuEntry from "./MobileMenuEntry";
import { MenuItem } from "../Menu";

const Menu = ({
  countryParam,
  menuOptions,
  onMobileCloseClick,
  isMobileMenuVisible,
  currentPageNav,
  isLoggedIn,
  onLogOut,
}: {
  countryParam: string;
  menuOptions: MenuItem[];
  onMobileCloseClick: () => void;
  isMobileMenuVisible: boolean;
  currentPageNav: any;
  isLoggedIn: boolean;
  onLogOut: () => void;
}) => (
  <>
    <div className='menu__desktop'>
      {menuOptions.map((item: MenuItem, index: number) => {
        return (
          <React.Fragment key={`top_menu-${index}`}>
            {item.path.parent.path.includes("http") ? (
              <a className='menu__text' href={item.path.parent.path} target='_blank' rel='noreferrer'>
                {item.path.parent.name}
              </a>
            ) : (
              <Link
                partiallyActive
                key={`top_menu--${index}`}
                to={`${countryParam && `/${countryParam}`}${item.path.parent.path}`}
                className='menu__text'
                activeClassName='menu__option-active'
              >
                {item.path.parent.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>

    {isMobileMenuVisible && (
      <div
        className={clsx("menu__mobile", {
          "menu__mobile--with-ribbon": window?.document?.getElementsByClassName("ribbon__container__"),
        })}
      >
        <img src={close} alt='close' className='menu__mobile--close' onClick={onMobileCloseClick} />
        {menuOptions.map((item: MenuItem, index: number) => (
          <MobileMenuEntry
            item={item}
            currentPageNav={currentPageNav}
            countryParam={countryParam}
            onMobileCloseClick={onMobileCloseClick}
            key={`mob_menu-${index}`}
          />
        ))}
        {isLoggedIn && (
          <MobileMenuEntry
            item={{
              path: {
                parent: {
                  name: "MY ACCOUNT",
                  options: [
                    { name: "Profile", path: "/profile" },
                    { name: "Subscription", path: "/subscription" },
                    { name: "Logout", path: "#", func: onLogOut },
                  ],
                  path: "#",
                },
              },
            }}
            currentPageNav={currentPageNav}
            countryParam={countryParam}
            onMobileCloseClick={onMobileCloseClick}
          />
        )}
      </div>
    )}
  </>
);

export default Menu;
