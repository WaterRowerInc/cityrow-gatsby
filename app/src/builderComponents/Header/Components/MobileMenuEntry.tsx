import React from "react";
import clsx from "classnames";
import { Link } from "gatsby";
import subMenuDown from "assets/images/subMenuDown.png";
import subMenuUp from "assets/images/subMenuUp.png";
import "./Menu.scss";
import { BuilderPageNav, MenuItem, MenuItemOption } from "../Menu";

const MobileMenuEntry = ({
  countryParam,
  currentPageNav,
  item,
  onMobileCloseClick,
  noLink = false,
}: {
  countryParam: string;
  currentPageNav: BuilderPageNav;
  item: MenuItem;
  onMobileCloseClick: () => void;
  noLink?: boolean;
}) => {
  const [isSubVisible, setIsSubVisible] = React.useState(currentPageNav?.name === item?.path?.parent?.name);
  const switchSubVisibility = () => setIsSubVisible(!isSubVisible);
  const hasSubMenus = item?.path?.parent?.options?.length > 0;
  const generateSubMenus = () => {
    return item?.path?.parent?.options?.map((sub_menu: MenuItemOption) =>
      sub_menu.path.includes("http") ? (
        <a key={`sub_menu--${sub_menu.path}`} href={sub_menu.path}>
          {sub_menu.name}
        </a>
      ) : (
        <Link
          key={`sub_menu--${sub_menu.path}`}
          to={`${countryParam && `/${countryParam}`}${sub_menu.path}`}
          activeClassName={"menu__mobile--entry--active"}
          className={"menu__mobile--entry--alt"}
          onClick={sub_menu.func ?? onMobileCloseClick}
        >
          {sub_menu.name}
        </Link>
      )
    );
  };

  return (
    <React.Fragment>
      <div className={"menu__mobile--entry"} onClick={switchSubVisibility}>
        {hasSubMenus && !noLink && (
          <img className={"menu__mobile--caret"} alt={"arrow"} src={isSubVisible ? subMenuUp : subMenuDown} />
        )}
        {item.path.parent.path.includes("http") ? (
          <a className='menu__mobile--entry--normal' href={item.path.parent.path}>
            {item.path.parent.name}
          </a>
        ) : (
          <Link
            to={hasSubMenus || noLink ? "#" : `${countryParam && `/${countryParam}`}${item?.path?.parent?.path}`}
            activeClassName='menu__mobile--entry--active'
            className='menu__mobile--entry--normal'
            onClick={hasSubMenus ? switchSubVisibility : onMobileCloseClick}
          >
            {item?.path?.parent?.name}
          </Link>
        )}
        <div
          className={clsx("menu__mobile--entry--subs", {
            "menu__mobile--entry--subs-visible": isSubVisible,
          })}
        >
          {generateSubMenus()}
        </div>
      </div>
    </React.Fragment>
  );
};

export default MobileMenuEntry;
