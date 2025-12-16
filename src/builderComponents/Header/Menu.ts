export interface MenuItem {
  path: {
    parent: {
      path: string;
      name: string;
      options: MenuItemOption[];
    };
  };
}

export interface MenuItemOption {
  name: string;
  path: string;
  func?: () => void;
}

export interface BuilderPageNav {
  name: string;
  hasSubmenu: boolean;
  textSubmenu: string;
  options: BuilderPageNavOption[];
  cta: BuilderPageNavCta;
}

export interface BuilderPageNavOption {
  name: string;
  path: string;
  isExternal: boolean;
}

export interface BuilderPageNavCta {
  destination: string;
  label: string;
}
