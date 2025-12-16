import useSubscription from "./useSubscription";

export function checkIfIsMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    typeof navigator !== undefined ? "node" : navigator.userAgent
  ) || typeof global.window !== "undefined"
    ? global.window.innerWidth < 600
    : false;
}

function useCheckMobile() {
  return useSubscription(
    (handler: any) => window.addEventListener("resize", handler),
    (handler: any) => window.removeEventListener("resize", handler),
    checkIfIsMobile
  );
}

export default useCheckMobile;
