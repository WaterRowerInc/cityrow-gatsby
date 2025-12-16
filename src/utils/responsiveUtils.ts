export const isSmallScreen = () => (typeof global.window !== "undefined" ? global.window.innerWidth < 600 : false);

export const isMediumScreenOrSmaller = () =>
  typeof global.window !== "undefined" ? global.window.innerWidth < 1024 : false;
